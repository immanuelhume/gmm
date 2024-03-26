import { Address } from "./util";
import {
  CallFrameView,
  DataType,
  Float64View,
  FnView,
  BuiltinView,
  FrameView,
  NodeView,
  clone,
  BuiltinId,
  MachineState,
  wordSize,
  BlockFrameView,
  Global,
  GlobalView,
} from "./heapviews";
import {
  IAssign,
  ILoadFn,
  Opcode,
  UnaryOp,
  BinaryOp,
  IUnaryOp,
  ICall,
  IBinaryOp,
  IGoto,
  InstrView,
  ILoadNameLoc,
  IPop,
  ILoadC,
  IPush,
  IEnterBlock,
  IExitBlock,
  ILoadName,
  ILoadStr,
  IJof,
} from "./instructions";

type EvalFn = (state: MachineState) => void;

export const microcode: Record<Opcode, EvalFn> = {
  [Opcode.BinaryOp]: function (state: MachineState): void {
    const instr = new IBinaryOp(state.bytecode, state.pc);
    execBinaryOp(state, instr.op());
    state.pc += IBinaryOp.size;
  },
  [Opcode.UnaryOp]: function (state: MachineState): void {
    const instr = new IUnaryOp(state.bytecode, state.pc);
    execUnaryOp(state, instr.op());
    state.pc += IUnaryOp.size;
  },
  [Opcode.Call]: function (state: MachineState): void {
    const instr = new ICall(state.bytecode, state.pc);
    const argc = instr.argc();

    const args: Address[] = [];
    for (let i = 0; i < argc; ++i) {
      // Beware that here, we are cloning the arguments! This is in line with
      // how Golang passes arguments i.e. everything is passed by value.
      args.push(clone(state, state.os.pop()));
    }
    args.reverse();

    const fnAddr = state.os.pop();
    const fnKind = NodeView.getDataType(state.heap, fnAddr);
    switch (fnKind) {
      case DataType.Fn:
        const callFrame = CallFrameView.allocate(state);
        callFrame.setPc(state.pc + ICall.size); // pc was already incremented to next instruction above
        callFrame.setEnv(state.env);

        state.rts.push(callFrame.addr);

        const frame = FrameView.allocate(state, argc);
        for (let i = 0; i < argc; ++i) {
          frame.set(i, args[i]);
        }

        const fn = new FnView(state.heap, fnAddr);
        const newEnv = fn.getEnv().extend(state, frame.addr);

        state.env = newEnv;
        state.pc = fn.getPc();

        break;
      case DataType.Builtin:
        // We don't bother with creating a new frame, or extending any environment.
        const builtin = new BuiltinView(state.heap, fnAddr);
        const bifn = builtinFns[builtin.getId()];
        bifn(state, args);

        state.pc += ICall.size;
        break;
      default:
        throw new Error(`Uncallable object ${fnKind}`);
    }
  },
  [Opcode.Return]: function (state: MachineState): void {
    // We don't need to bump the PC here. Since we jump back to wherever we
    // called the function from.
    const addr = state.rts.pop();
    const typ = NodeView.getDataType(state.heap, addr);
    switch (typ) {
      case DataType.CallFrame:
        const frame = new CallFrameView(state.heap, addr);
        state.env = frame.getEnv();
        state.pc = frame.getPc();
        break;
      case DataType.BlockFrame:
        return microcode[Opcode.Return](state);
      default:
        throw new Error("Unexpected data type in runtime stack!"); // @todo: format the error
    }
  },
  [Opcode.Goto]: function (state: MachineState): void {
    const goto = new IGoto(state.bytecode, state.pc);
    state.pc = goto.where();
  },
  [Opcode.LoadFn]: function (state: MachineState): void {
    const instr = new ILoadFn(state.bytecode, state.pc);
    const fn = FnView.allocate(state);

    fn.setEnv(state.env);
    fn.setPc(instr.pc());

    state.os.push(fn.addr);
    state.pc += ILoadFn.size;
  },
  [Opcode.Assign]: function (state: MachineState): void {
    const count = new IAssign(state.bytecode, state.pc).getCount();
    const lhss = [];
    const rhss = [];
    for (let i = 0; i < count; ++i) {
      lhss.push(state.os.pop());
    }
    for (let i = 0; i < count; ++i) {
      rhss.push(state.os.pop());
    }

    // Note that assignment here differs from how CS4215 assignments handled
    // it. We don't always have a frame and offset to assign into (e.g. maybe
    // we are assigning to a field of a struct?) so we assign directly to
    // an address.
    for (let i = 0; i < count; ++i) {
      state.heap.setFloat64(lhss[i], rhss[i]);
    }

    state.pc += IAssign.size;
    state.os.push(state.globals[Global.Nil]); // push a dummy value on
  },
  [Opcode.LoadNameLoc]: function (state: MachineState): void {
    const instr = new ILoadNameLoc(state.bytecode, state.pc);
    const frameAddr = state.env.getFrame(instr.frame());
    const frame = new FrameView(state.heap, frameAddr);
    const nameLoc = frame.getVarLoc(instr.offset());

    state.os.push(nameLoc);
    state.pc += ILoadNameLoc.size;
  },
  [Opcode.LoadName]: function (state: MachineState): void {
    const instr = new ILoadName(state.bytecode, state.pc);
    const frameAddr = state.env.getFrame(instr.frame());
    const frame = new FrameView(state.heap, frameAddr);
    const addr = frame.get(instr.offset());

    state.os.push(addr);
    state.pc += ILoadName.size;
  },
  [Opcode.Jof]: function (state: MachineState): void {
    const instr = new IJof(state.bytecode, state.pc);
    const cond = state.os.peek(); // @todo: pop or peek?
    const glob = new GlobalView(state.heap, cond);
    switch (glob.getKind()) {
      case Global.False:
        state.pc = instr.where(); // we jump
        break;
      case Global.True:
        state.pc += IJof.size;
        break;
      default:
        throw new Error("Unexpected non-boolean value"); // @todo btr msg
    }
  },
  [Opcode.EnterBlock]: function (state: MachineState): void {
    const instr = new IEnterBlock(state.bytecode, state.pc);
    const frame = FrameView.allocate(state, instr.numVars());
    const newEnv = state.env.extend(state, frame.addr);

    const blkFrame = BlockFrameView.allocate(state).setEnv(state.env);
    state.rts.push(blkFrame.addr);

    state.env = newEnv;
    state.pc += IEnterBlock.size;
  },
  [Opcode.ExitBlock]: function (state: MachineState): void {
    // Surely the top of the RTS is a block frame? It can't be a call frame right...
    const blkFrameAddr = state.rts.pop();
    const blkFrame = new BlockFrameView(state.heap, blkFrameAddr);
    state.env = blkFrame.getEnv();
    state.pc += IExitBlock.size;
  },
  [Opcode.Pop]: function (state: MachineState): void {
    state.os.pop();
    state.pc += IPop.size;
  },
  [Opcode.LoadC]: function (state: MachineState): void {
    // @todo: make general, as and when ILoadC is updated - for now we just load numbers...
    const instr = new ILoadC(state.bytecode, state.pc);
    const val = Float64View.allocate(state).setValue(instr.val());

    state.os.push(val.addr);
    state.pc += ILoadC.size;
  },
  [Opcode.LoadStr]: function (state: MachineState): void {
    const instr = new ILoadStr(state.bytecode, state.pc);
    const id = instr.id();
    const nodeAddr = state.strPool.getAddress(id);
    if (nodeAddr === undefined) {
      throw new Error(`String with id ${id} missing from string pool`); // @todo a btr err msg
    }
    state.os.push(nodeAddr);
    state.pc += ILoadStr.size;
  },
  [Opcode.Push]: function (state: MachineState): void {
    const instr = new IPush(state.bytecode, state.pc);
    state.os.push(instr.val());
    state.pc += IPush.size;
  },
  [Opcode.Done]: function (state: MachineState): void {
    throw new Error("Done not implemented.");
  },
};

const execBinaryOp = (state: MachineState, op: BinaryOp): void => {
  const rhsAddr = state.os.pop();
  const lhsAddr = state.os.pop();

  const lhsType = NodeView.getDataType(state.heap, lhsAddr);
  const rhsType = NodeView.getDataType(state.heap, rhsAddr);

  // @todo: should we have this check?
  if (lhsType !== rhsType) {
    throw new Error("Can't perform binary operation on different data types!");
  }

  const f = binaryBuiltins.get(lhsType)?.get(op);
  if (!f) throw new Error("No binary operation defined!"); // @todo: format string

  const res = f(state, lhsAddr, rhsAddr);

  state.os.push(res);
};

type BinaryOpFn = (state: MachineState, lhs: Address, rhs: Address) => Address;

// @todo add more binary builtins
export const binaryBuiltins = new Map<DataType, Map<BinaryOp, BinaryOpFn>>([
  [
    DataType.Float64,
    new Map([
      [
        BinaryOp.Add,
        (state, lhsAddr, rhsAddr) => {
          const lhs = new Float64View(state.heap, lhsAddr);
          const rhs = new Float64View(state.heap, rhsAddr);

          const lhsValue = lhs.getValue();
          const rhsValue = rhs.getValue();
          const resValue = lhsValue + rhsValue;

          const res = Float64View.allocate(state);
          res.setValue(resValue);

          return res.addr;
        },
      ],
      [
        BinaryOp.Sub,
        (state, lhsAddr, rhsAddr) => {
          const lhs = new Float64View(state.heap, lhsAddr);
          const rhs = new Float64View(state.heap, rhsAddr);

          const lhsValue = lhs.getValue();
          const rhsValue = rhs.getValue();
          const resValue = lhsValue - rhsValue;

          const res = Float64View.allocate(state);
          res.setValue(resValue);

          return res.addr;
        },
      ],
      [
        BinaryOp.Neq,
        (state, lhsAddr, rhsAddr) => {
          const lhs = new Float64View(state.heap, lhsAddr);
          const rhs = new Float64View(state.heap, rhsAddr);

          const lhsValue = lhs.getValue();
          const rhsValue = rhs.getValue();
          if (lhsValue < rhsValue) {
            return state.globals[Global.True];
          } else {
            return state.globals[Global.False];
          }
        },
      ],
    ]),
  ],
]);

const execUnaryOp = (state: MachineState, op: UnaryOp): void => {
  const operandAddr = state.os.pop();
  const typ = NodeView.getDataType(state.heap, operandAddr);

  const f = unaryBuiltins.get([typ, op]);
  if (!f) throw new Error("No unary operation defined!"); // @todo: format string

  const res = f(state, operandAddr);

  state.os.push(res);
};

type UnaryOpFn = (state: MachineState, addr: Address) => Address;

// @todo add more unary builtins
const unaryBuiltins = new Map<[DataType, UnaryOp], UnaryOpFn>([
  [
    [DataType.Float64, UnaryOp.Sub],
    (state, addr) => {
      const num = new Float64View(state.heap, addr);
      const val = num.getValue();

      const res = Float64View.allocate(state);
      res.setValue(-val);

      return res.addr;
    },
  ],
]);

type BuiltinEvalFn = (state: MachineState, args: Address[]) => void;

const builtinFns: Record<BuiltinId, BuiltinEvalFn> = {
  [BuiltinId.Debug]: function (state: MachineState, args: Address[]): void {
    const reprs = args.map((arg) => NodeView.of(state.heap, arg, { strPool: state.strPool }).toString()).join(" ");
    const lineno = state.srcMap.get(state.pc);
    if (lineno !== undefined) {
      console.log("line", lineno, ":", reprs);
    } else {
      console.log(reprs);
    }
    state.os.push(0); // push some garbage, since functions must leave one value on the OS for now @todo FIXME
  },
  [BuiltinId.Panic]: function (state: MachineState, args: number[]): void {
    const reprs = args.map((arg) => NodeView.of(state.heap, arg, { strPool: state.strPool }).toString()).join(" ");
    console.log("\x1b[31m", "panic:", reprs, "\x1b[0m");
    const lineno = state.srcMap.get(state.pc);
    if (lineno !== undefined) {
      console.log("\x1b[31m", "  ", "at line", lineno, "\x1b[0m");
    }
    throw new PanicError(); // we should never recover from this
  },
};

class PanicError extends Error {}
