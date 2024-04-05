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
  BlockFrameView,
  Global,
  GlobalView,
  TupleView,
  PointerView,
  StructView,
  MethodView,
  Int64View,
  StringView,
  allocate,
} from "./heapviews";
import {
  IAssign,
  ILoadFn,
  Opcode,
  UnaryOp,
  BinaryOp,
  IUnaryOp,
  LogicalOp,
  ILogicalOp,
  ICall,
  IBinaryOp,
  IGoto,
  ILoadNameLoc,
  IPop,
  ILoadC,
  IPush,
  IEnterBlock,
  IExitBlock,
  ILoadName,
  ILoadStr,
  IJof,
  IPackTuple,
  IPackStruct,
  ILoadStructField,
  ILoadStructFieldLoc,
  ILoadMethod,
  IGo,
  ILoadGlobal,
  IPackPtr,
} from "./instructions";
import { MachineState, Thread } from "./machine";
import { ArgContext } from "../antlr/GoParser";

type EvalFn = (state: MachineState, t: Thread, go?: boolean) => void;

export const microcode: Record<Opcode, EvalFn> = {
  [Opcode.BinaryOp]: function (state: MachineState, t: Thread): void {
    const instr = new IBinaryOp(state.bytecode, t.pc);
    execBinaryOp(state, t, instr.op());
    t.pc += IBinaryOp.size;
  },
  [Opcode.UnaryOp]: function (state: MachineState, t: Thread): void {
    const instr = new IUnaryOp(state.bytecode, t.pc);
    execUnaryOp(state, t, instr.op());
    t.pc += IUnaryOp.size;
  },
  [Opcode.LogicalOp]: function (state: MachineState, t: Thread): void {
    const instr = new ILogicalOp(state.bytecode, t.pc);
    execLogicalOp(state, t, instr.op());
    t.pc += ILogicalOp.size;
  },
  [Opcode.Call]: function (state: MachineState, t: Thread, go?: boolean): void {
    const instr = new ICall(state.bytecode, t.pc);
    const argc = instr.argc();

    const args: Address[] = [];
    for (let i = 0; i < argc; ++i) {
      // Beware that here, we are cloning the arguments! This is in line with
      // how Golang passes arguments i.e. everything is passed by value.
      args.push(clone(state, t.os.pop()));
    }
    args.reverse();

    const fnAddr = t.os.pop();
    const fnKind = NodeView.getDataType(state.heap, fnAddr);
    switch (fnKind) {
      case DataType.Fn: {
        const callFrame = CallFrameView.allocate(state);
        callFrame.setPc(t.pc + ICall.size);
        callFrame.setEnv(t.env);

        t.rts.push(callFrame.addr);

        const frame = FrameView.allocate(state, argc);
        for (let i = 0; i < argc; ++i) {
          frame.set(i, args[i]);
        }

        const fn = new FnView(state.heap, fnAddr);
        const newEnv = fn.getEnv().extend(state, frame.addr);

        t.env = newEnv;
        t.pc = fn.getPc();

        if (go) {
          t.lastPc = fn.getLast();
        }

        break;
      }
      case DataType.Builtin:
        // We don't bother with creating a new frame, or extending any environment.
        const builtin = new BuiltinView(state.heap, fnAddr);
        const bifn = builtinFns[builtin.getId()];
        bifn(state, t, args);

        if (go) {
          t.lastPc = t.pc;
        }
        t.pc += ICall.size;

        break;
      case DataType.Method: {
        const mthd = new MethodView(state.heap, fnAddr);

        const frame = FrameView.allocate(state, argc + 1);
        frame.set(0, mthd.receiver()); // also set the receiver in the frame of parameters
        for (let i = 0; i < argc; ++i) {
          frame.set(i + 1, args[i]);
        }

        const methodType = NodeView.getDataType(state.heap, mthd.fn());
        // A method might be builtin, so we'll have to dispatch accordingly.
        switch (methodType) {
          case DataType.Fn:
            const callFrame = CallFrameView.allocate(state);
            callFrame.setPc(t.pc + ICall.size);
            callFrame.setEnv(t.env);

            t.rts.push(callFrame.addr);

            const fn = new FnView(state.heap, mthd.fn());
            const newEnv = fn.getEnv().extend(state, frame.addr);

            t.env = newEnv;
            t.pc = fn.getPc();

            if (go) {
              t.lastPc = fn.getLast();
            }
            break;
          case DataType.Builtin:
            const builtin = new BuiltinView(state.heap, mthd.fn());
            const bifn = builtinFns[builtin.getId()];
            bifn(state, t, args, { mthd });

            if (go) {
              t.lastPc = t.pc;
            }
            t.pc += ICall.size;
            break;
          default:
            throw new Error("unexpected method type");
        }

        break;
      }
      default:
        throw new Error(`Uncallable object ${fnKind}`);
    }
  },
  [Opcode.Go]: function (state: MachineState, t: Thread): void {
    const t2 = state.fork(t);
    t2.pc += IGo.size;
    t.pc += IGo.size + ICall.size;

    // A [Call] always follows immediately after a [Go]. We'll use the info from
    // the [Call] to transfer the Goroutine's operands to our new thread.
    const call = new ICall(state.bytecode, t2.pc);
    const args = [];
    for (let i = 0; i < call.argc(); ++i) {
      args.push(t.os.pop());
    }
    const fn = t.os.pop();

    t2.os.clear();

    t2.os.push(fn);
    args.reverse();
    for (const arg of args) {
      t2.os.push(arg);
    }
  },
  [Opcode.Return]: function (state: MachineState, t: Thread): void {
    // We don't need to bump the PC here. Since we jump back to wherever we
    // called the function from.
    const addr = t.rts.pop();
    const typ = NodeView.getDataType(state.heap, addr);
    switch (typ) {
      case DataType.CallFrame:
        const frame = new CallFrameView(state.heap, addr);
        t.env = frame.getEnv();
        t.pc = frame.getPc();
        break;
      case DataType.BlockFrame:
        return microcode[Opcode.Return](state, t);
      default:
        throw new Error("Unexpected data type in runtime stack!"); // @todo: format the error
    }
  },
  [Opcode.Goto]: function (state: MachineState, t: Thread): void {
    const goto = new IGoto(state.bytecode, t.pc);
    t.pc = goto.where();
  },
  [Opcode.LoadFn]: function (state: MachineState, t: Thread): void {
    const instr = new ILoadFn(state.bytecode, t.pc);
    const fn = FnView.allocate(state).setPc(instr.pc()).setLast(instr.last()).setEnv(t.env);

    t.os.push(fn.addr);
    t.pc += ILoadFn.size;
  },
  [Opcode.LoadMethod]: function (state: MachineState, t: Thread): void {
    const rcv = t.os.pop();
    const fnAddr = t.os.pop(); // this could be an Fn or a Builtin!

    const mthd = MethodView.allocate(state).setReceiver(rcv).setFn(fnAddr);
    t.os.push(mthd.addr);

    t.pc += ILoadMethod.size;
  },
  [Opcode.Assign]: function (state: MachineState, t: Thread): void {
    const count = new IAssign(state.bytecode, t.pc).getCount();

    // Note that assignment here differs from how CS4215 assignments handled
    // it. We don't always have a frame and offset to assign into (e.g. maybe
    // we are assigning to a field of a struct?) so we assign directly to
    // an address.

    if (count == 1) {
      const lhs = t.os.pop();
      const rhs = t.os.pop();
      state.heap.setFloat64(lhs, rhs);
    } else {
      const lhss = [];
      const rhss = [];
      for (let i = 0; i < count; ++i) {
        lhss.push(t.os.pop());
      }
      for (let i = 0; i < count; ++i) {
        rhss.push(t.os.pop());
      }
      for (let i = 0; i < count; ++i) {
        state.heap.setFloat64(lhss[i], rhss[i]);
      }
    }

    t.pc += IAssign.size;
  },
  [Opcode.LoadNameLoc]: function (state: MachineState, t: Thread): void {
    const instr = new ILoadNameLoc(state.bytecode, t.pc);
    const frameAddr = t.env.getFrame(instr.frame());
    const frame = new FrameView(state.heap, frameAddr);
    const nameLoc = frame.getVarLoc(instr.offset());

    t.os.push(nameLoc);
    t.pc += ILoadNameLoc.size;
  },
  [Opcode.LoadName]: function (state: MachineState, t: Thread): void {
    const instr = new ILoadName(state.bytecode, t.pc);
    const frameAddr = t.env.getFrame(instr.frame());
    const frame = new FrameView(state.heap, frameAddr);
    const addr = frame.get(instr.offset());

    t.os.push(addr);
    t.pc += ILoadName.size;
  },
  [Opcode.Jof]: function (state: MachineState, t: Thread): void {
    const instr = new IJof(state.bytecode, t.pc);
    const cond = t.os.pop();
    const glob = new GlobalView(state.heap, cond);
    switch (glob.getKind()) {
      case Global.False:
        t.pc = instr.where(); // we jump
        break;
      case Global.True:
        t.pc += IJof.size;
        break;
      default:
        throw new Error("Unexpected non-boolean value"); // @todo btr msg
    }
  },
  [Opcode.EnterBlock]: function (state: MachineState, t: Thread): void {
    const instr = new IEnterBlock(state.bytecode, t.pc);
    const frame = FrameView.allocate(state, instr.numVars());
    const newEnv = t.env.extend(state, frame.addr);

    const blkFrame = BlockFrameView.allocate(state).setEnv(t.env);
    t.rts.push(blkFrame.addr);

    t.env = newEnv;
    t.pc += IEnterBlock.size;
  },
  [Opcode.ExitBlock]: function (state: MachineState, t: Thread): void {
    // Surely the top of the RTS is a block frame? It can't be a call frame right...
    const blkFrameAddr = t.rts.pop();
    const blkFrame = new BlockFrameView(state.heap, blkFrameAddr);
    t.env = blkFrame.getEnv();
    t.pc += IExitBlock.size;
  },
  [Opcode.Pop]: function (state: MachineState, t: Thread): void {
    t.os.pop();
    t.pc += IPop.size;
  },
  [Opcode.LoadC]: function (state: MachineState, t: Thread): void {
    // @todo: this shouldn't always be loading floats...
    const instr = new ILoadC(state.bytecode, t.pc);
    const val = Float64View.allocate(state).setValue(instr.val());

    t.os.push(val.addr);
    t.pc += ILoadC.size;
  },
  [Opcode.LoadGlobal]: function (state: MachineState, t: Thread): void {
    const instr = new ILoadGlobal(state.bytecode, t.pc);
    const addr = state.globals[instr.global()];

    t.os.push(addr);
    t.pc += ILoadGlobal.size;
  },
  [Opcode.LoadStr]: function (state: MachineState, t: Thread): void {
    const instr = new ILoadStr(state.bytecode, t.pc);
    const id = instr.id();
    const nodeAddr = state.strPool.getAddress(id);
    if (nodeAddr === undefined) {
      throw new Error(`String with id ${id} missing from string pool`); // @todo a btr err msg
    }
    t.os.push(nodeAddr);
    t.pc += ILoadStr.size;
  },
  [Opcode.Push]: function (state: MachineState, t: Thread): void {
    const instr = new IPush(state.bytecode, t.pc);
    t.os.push(instr.val());
    t.pc += IPush.size;
  },
  [Opcode.Alloc]: function (state: MachineState, t: Thread): void {
    throw "Unimplemented";
  },
  [Opcode.PackPtr]: function (state: MachineState, t: Thread): void {
    const ptr = PointerView.allocate(state).setValue(t.os.pop());
    t.os.push(ptr.addr);
    t.pc += IPackPtr.size;
  },
  [Opcode.Deref]: function (state: MachineState, t: Thread): void {
    const ptr = new PointerView(state.heap, t.os.pop());
    t.os.push(ptr.getValue());
    t.pc += IPackPtr.size;
  },
  [Opcode.PackTuple]: function (state: MachineState, t: Thread): void {
    const instr = new IPackTuple(state.bytecode, t.pc);
    const tuple = TupleView.allocate(state, instr.len());
    for (let i = 0; i < instr.len(); ++i) {
      tuple.set(i, t.os.pop());
    }

    t.os.push(tuple.addr);
    t.pc += IPackTuple.size;
  },
  [Opcode.PackStruct]: function (state: MachineState, t: Thread): void {
    const instr = new IPackStruct(state.bytecode, t.pc);
    const struct = StructView.allocate(state, instr.fieldc());
    for (let i = 0; i < instr.fieldc(); ++i) {
      struct.setField(i, t.os.pop());
    }

    t.os.push(struct.addr);
    t.pc += IPackStruct.size;
  },
  [Opcode.LoadStructField]: function (state: MachineState, t: Thread): void {
    const instr = new ILoadStructField(state.bytecode, t.pc);
    const struct = new StructView(state.heap, t.os.pop());
    const fieldAddr = struct.getField(instr.offset());

    t.os.push(fieldAddr);
    t.pc += ILoadStructField.size;
  },
  [Opcode.LoadStructFieldLoc]: function (state: MachineState, t: Thread): void {
    const instr = new ILoadStructFieldLoc(state.bytecode, t.pc);
    const struct = new StructView(state.heap, t.os.pop());
    const fieldLoc = struct.getFieldLoc(instr.offset());

    t.os.push(fieldLoc);
    t.pc += ILoadStructField.size;
  },
  [Opcode.Done]: function (state: MachineState, t: Thread): void {
    throw new Error("Done not implemented.");
  },
};

const execBinaryOp = (state: MachineState, t: Thread, op: BinaryOp): void => {
  const rhsAddr = t.os.pop();
  const lhsAddr = t.os.pop();

  const lhsType = NodeView.getDataType(state.heap, lhsAddr);
  const rhsType = NodeView.getDataType(state.heap, rhsAddr);

  // @todo: should we have this check?
  if (lhsType !== rhsType) {
    throw new Error("Can't perform binary operation on different data types!");
  }

  const f = binaryBuiltins.get(lhsType)?.get(op);
  if (!f) throw new Error("No binary operation defined!"); // @todo: format string

  const res = f(state, lhsAddr, rhsAddr);

  t.os.push(res);
};

type BinaryOpFn = (state: MachineState, lhs: Address, rhs: Address) => Address;

// @todo add more binary builtins, and reduce the duplication
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

          if (lhsValue !== rhsValue) {
            return state.globals[Global.True];
          } else {
            return state.globals[Global.False];
          }
        },
      ],
      [
        BinaryOp.Eq,
        (state, lhsAddr, rhsAddr) => {
          const lhs = new Float64View(state.heap, lhsAddr);
          const rhs = new Float64View(state.heap, rhsAddr);

          const lhsValue = lhs.getValue();
          const rhsValue = rhs.getValue();
          if (lhsValue === rhsValue) {
            return state.globals[Global.True];
          } else {
            return state.globals[Global.False];
          }
        },
      ],
      [
        BinaryOp.Mul,
        (state, lhsAddr, rhsAddr) => {
          const lhs = new Float64View(state.heap, lhsAddr);
          const rhs = new Float64View(state.heap, rhsAddr);

          const lhsValue = lhs.getValue();
          const rhsValue = rhs.getValue();

          const resValue = lhsValue * rhsValue;

          const res = Float64View.allocate(state);
          res.setValue(resValue);

          return res.addr;
        },
      ],
      [
        BinaryOp.Div,
        (state, lhsAddr, rhsAddr) => {
          const lhs = new Float64View(state.heap, lhsAddr);
          const rhs = new Float64View(state.heap, rhsAddr);

          const lhsValue = lhs.getValue();
          const rhsValue = rhs.getValue();

          const resValue = lhsValue / rhsValue;

          const res = Float64View.allocate(state);
          res.setValue(resValue);

          return res.addr;
        },
      ],
      [
        BinaryOp.Leq,
        (state, lhsAddr, rhsAddr) => {
          const lhs = new Float64View(state.heap, lhsAddr);
          const rhs = new Float64View(state.heap, rhsAddr);

          const lhsValue = lhs.getValue();
          const rhsValue = rhs.getValue();

          if (lhsValue <= rhsValue) {
            return state.globals[Global.True];
          } else {
            return state.globals[Global.False];
          }
        },
      ],
      [
        BinaryOp.Geq,
        (state, lhsAddr, rhsAddr) => {
          const lhs = new Float64View(state.heap, lhsAddr);
          const rhs = new Float64View(state.heap, rhsAddr);

          const lhsValue = lhs.getValue();
          const rhsValue = rhs.getValue();

          if (lhsValue >= rhsValue) {
            return state.globals[Global.True];
          } else {
            return state.globals[Global.False];
          }
        },
      ],
      [
        BinaryOp.L,
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
      [
        BinaryOp.G,
        (state, lhsAddr, rhsAddr) => {
          const lhs = new Float64View(state.heap, lhsAddr);
          const rhs = new Float64View(state.heap, rhsAddr);

          const lhsValue = lhs.getValue();
          const rhsValue = rhs.getValue();

          if (lhsValue > rhsValue) {
            return state.globals[Global.True];
          } else {
            return state.globals[Global.False];
          }
        },
      ],
    ]),
  ],
  [
    DataType.Global,
    new Map([
      [
        BinaryOp.Eq,
        (state, lhsAddr, rhsAddr) => {
          if (lhsAddr === rhsAddr) {
            return state.globals[Global.True];
          } else {
            return state.globals[Global.False];
          }
        },
      ],
      [
        BinaryOp.Neq,
        (state, lhsAddr, rhsAddr) => {
          if (lhsAddr !== rhsAddr) {
            return state.globals[Global.True];
          } else {
            return state.globals[Global.False];
          }
        },
      ],
    ]),
  ],
]);

const execLogicalOp = (state: MachineState, t: Thread, op: LogicalOp): void => {
  const lhsAddr = t.os.pop();
  const rhsAddr = t.os.pop();

  const _lhs = new GlobalView(state.heap, lhsAddr);
  const _rhs = new GlobalView(state.heap, rhsAddr);

  if (!_lhs.isBoolean() || !_rhs.isBoolean()) {
    throw new Error("Can't perform logical operation on non-boolean types");
  }

  const lhs = _lhs.getKind();
  const rhs = _rhs.getKind();

  switch (op) {
    case LogicalOp.And:
      if (lhs === Global.True && rhs === Global.True) {
        t.os.push(state.globals[Global.True]);
      } else {
        t.os.push(state.globals[Global.False]);
      }
      break;
    case LogicalOp.Or:
      if (lhs === Global.True || rhs === Global.True) {
        t.os.push(state.globals[Global.True]);
      } else {
        t.os.push(state.globals[Global.False]);
      }
      break;
    default:
      throw "Unimplemented";
  }
};

const execUnaryOp = (state: MachineState, t: Thread, op: UnaryOp): void => {
  const operandAddr = t.os.pop();
  const typ = NodeView.getDataType(state.heap, operandAddr);

  const f = unaryBuiltins.get(typ)?.get(op);
  if (!f) throw new Error("No unary operation defined!"); // @todo: format string

  const res = f(state, operandAddr);

  t.os.push(res);
};

type UnaryOpFn = (state: MachineState, addr: Address) => Address;

// @todo add more unary builtins
const unaryBuiltins = new Map<DataType, Map<UnaryOp, UnaryOpFn>>([
  [
    DataType.Float64,
    new Map([
      [
        UnaryOp.Sub,
        (state, addr) => {
          const num = new Float64View(state.heap, addr);
          const val = num.getValue();

          const res = Float64View.allocate(state);
          res.setValue(-val);

          return res.addr;
        },
      ],
      [UnaryOp.Add, (state, addr) => addr],
    ]),
  ],
]);

interface BuiltinEvalContext {
  // Address of the method, if the builtin is a method.
  mthd?: MethodView;
}

type BuiltinEvalFn = (state: MachineState, t: Thread, args: Address[], ctx?: BuiltinEvalContext) => void;

const builtinFns: Record<BuiltinId, BuiltinEvalFn> = {
  [BuiltinId["dbg"]]: function (state: MachineState, t: Thread, args: Address[]): void {
    const reprs = args.map((arg) => NodeView.of(state.heap, arg, { strPool: state.strPool }).toString()).join(" ");
    const lineno = state.srcMap.get(t.pc);
    if (lineno !== undefined) {
      console.log("line", lineno, ":", reprs);
    } else {
      console.log(reprs);
    }
  },
  [BuiltinId["panic"]]: function (state: MachineState, t: Thread, args: number[]): void {
    const reprs = args.map((arg) => NodeView.of(state.heap, arg, { strPool: state.strPool }).toString()).join(" ");
    console.log("\x1b[31m", "panic:", reprs, "\x1b[0m");
    const lineno = state.srcMap.get(t.pc);
    if (lineno !== undefined) {
      console.log("\x1b[31m", "  ", "at line", lineno, "\x1b[0m");
    }
    throw new PanicError(reprs); // we should never recover from this
  },
  [BuiltinId["new"]]: function (state: MachineState, t: Thread, args: number[]): void {
    const typ = args[0];
    const nvals = args[1];
    const nrefs = args[2];
    const ptr = PointerView.allocate(state);

    const addr = allocate(state, typ, nvals, nrefs);
    ptr.setValue(addr);
    t.os.push(ptr.addr);
  },
  [BuiltinId["Mutex::Lock"]]: function (
    state: MachineState,
    t: Thread,
    _args: number[],
    ctx?: BuiltinEvalContext,
  ): void {
    if (ctx?.mthd === undefined) {
      throw new Error("could not access method for Mutex::Lock");
    }
    const mu = new StructView(state.heap, ctx.mthd.receiver() /* address of the mutex */);

    // Layout of the Mutex struct is defined in compiler.ts
    const locked = new GlobalView(state.heap, mu.getField(0));
    // @todo: Float64View should be Int64View
    const id = new Float64View(state.heap, mu.getField(1));

    switch (locked.getKind()) {
      case Global.True:
        // The mutex is locked by someone else. We'll put this thread to sleep,
        // and subscribe to when it gets unlocked.
        //
        // @todo: what should the subscription function do? maybe we need to adjust
        // the program counter? since we need to try unlocking again when it wakes
        t.isLive = false;
        state.sub("mutex-unlock", id.getValue(), t.id, (t) => (t.isLive = true));
        break;
      case Global.False:
        mu.setField(0, state.globals[Global.True]);
        break;
      case Global.Nil:
        throw new Error("expected boolean but got nil");
    }
  },
  [BuiltinId["Mutex::Unlock"]]: function (
    state: MachineState,
    _t: Thread,
    _args: number[],
    ctx?: BuiltinEvalContext,
  ): void {
    if (ctx?.mthd === undefined) {
      throw new Error("could not access method for Mutex::Lock");
    }
    const mu = new StructView(state.heap, ctx.mthd.receiver() /* address of the mutex */);

    const locked = new GlobalView(state.heap, mu.getField(0));
    // @todo: Float64View should be Int64View
    const id = new Float64View(state.heap, mu.getField(1));

    switch (locked.getKind()) {
      case Global.True:
        mu.setField(0, state.globals[Global.False]);
        state.pub("mutex-unlock", id.getValue());
        break;
      case Global.False:
        break;
      case Global.Nil:
        throw new Error("expected boolean but got nil");
    }
  },
};

class PanicError extends Error {}
