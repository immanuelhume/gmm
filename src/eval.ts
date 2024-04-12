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
  TupleView,
  PointerView,
  StructView,
  MethodView,
  Int64View,
  BoolView,
  LvalueView,
  LvalueKind,
  copy,
  StringView,
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
  ILoadPtrSlot,
  ConstantKind,
  IChanWrite,
} from "./instructions";
import { MachineState, Thread } from "./machine";
import { Channel } from "./compiler";
import { stat } from "fs";

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
  [Opcode.Call]: function (state: MachineState, t: Thread): void {
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

        if (instr.go()) {
          t.lastPc = fn.getLast();
        }

        break;
      }
      case DataType.Builtin:
        // We don't bother with creating a new frame, or extending any environment.
        const builtin = new BuiltinView(state.heap, fnAddr);
        const bifn = builtinFns[builtin.getId()];
        const { restore } = bifn(state, t, args);

        if (instr.go()) {
          t.lastPc = t.pc;
        }

        if (restore) {
          // What is there to restore? The args...
          t.os.push(fnAddr);
          for (const arg of args) {
            t.os.push(arg);
          }
        } else {
          t.pc += ICall.size;
        }

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

            if (instr.go()) {
              t.lastPc = fn.getLast();
            }
            break;
          case DataType.Builtin:
            const builtin = new BuiltinView(state.heap, mthd.fn());
            const bifn = builtinFns[builtin.getId()];
            const { restore } = bifn(state, t, args, { mthd });

            if (instr.go()) {
              t.lastPc = t.pc;
            }

            if (restore) {
              // What is there to restore? The args...
              t.os.push(fnAddr);
              for (const arg of args) {
                t.os.push(arg);
              }
            } else {
              t.pc += ICall.size;
            }
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
        break; // don't do anything - we'll re-execute this instruction
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

    const lhss = [];
    const rhss = [];

    for (let i = 0; i < count; ++i) {
      lhss.push(t.os.pop());
    }
    for (let i = 0; i < count; ++i) {
      rhss.push(t.os.pop());
    }
    for (let i = 0; i < count; ++i) {
      const lvalue = new LvalueView(state.heap, lhss[i]);
      switch (lvalue.getKind()) {
        case LvalueKind.Variable:
          state.heap.setFloat64(lvalue.getLoc(), rhss[i]);
          break;
        case LvalueKind.Deref:
          copy(state, rhss[i], lvalue.getLoc());
          break;
        default:
          throw "Unreachable";
      }
    }

    t.pc += IAssign.size;
  },
  [Opcode.LoadNameLoc]: function (state: MachineState, t: Thread): void {
    const instr = new ILoadNameLoc(state.bytecode, t.pc);
    const frameAddr = t.env.getFrame(instr.frame());
    const frame = new FrameView(state.heap, frameAddr);
    const nameLoc = frame.getVarLoc(instr.offset());

    const lvalue = LvalueView.allocate(state).setKind(LvalueKind.Variable).setLoc(nameLoc);
    t.os.push(lvalue.addr);

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
    const bool = new BoolView(state.heap, cond).get();
    if (bool) {
      t.pc += IJof.size;
    } else {
      t.pc = instr.where(); // we jump
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
    const instr = new ILoadC(state.bytecode, t.pc);
    const typ = instr.getKind();
    const val = instr.getVal();
    switch (typ) {
      case ConstantKind.Int64:
        const f = Int64View.allocate(state).setValue(val);
        t.os.push(f.addr);
        break;
      case ConstantKind.Float64:
        const i = Float64View.allocate(state).setValue(val);
        t.os.push(i.addr);
        break;
      default:
        throw new Error("LoadC: unknown datatype");
    }
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
  [Opcode.PackPtr]: function (state: MachineState, t: Thread): void {
    const ptr = PointerView.allocate(state).setValue(t.os.pop());
    t.os.push(ptr.addr);
    t.pc += IPackPtr.size;
  },
  [Opcode.Deref]: function (state: MachineState, t: Thread): void {
    // @todo: check if we are trying to deref a nullptr
    const ptr = new PointerView(state.heap, t.os.pop());
    t.os.push(ptr.getValue());
    t.pc += IPackPtr.size;
  },
  [Opcode.LoadPtrSlot]: function (state: MachineState, t: Thread): void {
    const ptr = new PointerView(state.heap, t.os.pop());
    const lvalue = LvalueView.allocate(state).setKind(LvalueKind.Deref).setLoc(ptr.getValue());
    t.os.push(lvalue.addr);
    t.pc += ILoadPtrSlot.size;
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

    const lvalue = LvalueView.allocate(state).setKind(LvalueKind.Variable).setLoc(fieldLoc);
    t.os.push(lvalue.addr);

    t.pc += ILoadStructField.size;
  },
  [Opcode.ChanRead]: function (state: MachineState, t: Thread): void {
    const chanAddr = t.os.pop();
    const { id, status, data } = Channel.view(state.heap, chanAddr);

    // Init channel ID on first use.
    if (id.getValue() === 0) {
      id.setValue(state.getLockId());
    }

    switch (status.getValue()) {
      case 1: // The channel has a pending value. Read and move on.
        status.setValue(0);
        state.pub("chan-read", id.getValue(), t.id);
        t.os.push(data.addr);
        t.pc += IChanWrite.size;
        break;
      case 0: // Nothin' going on. Wait for someone to write.
        status.setValue(-1);
        t.isLive = false;
        state.sub("chan-send", id.getValue(), t.id, (t, src) => {
          t.isLive = true;
        });
        t.os.push(chanAddr); // push back to try again
        break;
      case -1: // Someone else is waiting to read. We'll sleep and wait as well.
        t.isLive = false;
        state.sub("chan-send", id.getValue(), t.id, (t, src) => {
          t.isLive = true;
        });
        t.os.push(chanAddr); // push back to try again
        break;
      default:
        throw new Error(`unexpected channel status ${status.getValue()}`);
    }
  },
  [Opcode.ChanWrite]: function (state: MachineState, t: Thread): void {
    const chanAddr = t.os.pop();
    const { id, status, data } = Channel.view(state.heap, chanAddr);
    const towrite = t.os.pop();

    // Init channel ID on first use.
    if (id.getValue() === 0) {
      id.setValue(state.getLockId());
    }

    switch (status.getValue()) {
      case 1: // The channel has a pending value. Go to sleep.
        t.isLive = false;
        state.sub("chan-read", id.getValue(), t.id, (t, src) => {
          t.isLive = true;
        });
        // Push stuff back to OS for later use.
        t.os.push(towrite);
        t.os.push(chanAddr);
        break;
      case 0: // Nothing goin on. Wait for someone to read.
        copy(state, towrite, data.addr);
        status.setValue(1);
        t.isLive = false;
        state.sub("chan-read", id.getValue(), t.id, (t, src) => {
          t.isLive = true;
        });
        t.pc += IChanWrite.size;
      case -1: // Someone is waiting to read.
        copy(state, towrite, data.addr);
        status.setValue(1);
        state.pub("chan-send", id.getValue(), t.id);
        t.pc += IChanWrite.size;
        break;
      default:
        throw new Error(`unexpected channel status ${status.getValue()}`);
    }
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
    throw new Error(
      `Can't perform binary operation on different data types! (${DataType[lhsType]}, ${DataType[rhsType]})`,
    );
  }

  const f = binaryBuiltins.get(lhsType)?.get(op);
  if (!f) throw new Error("No binary operation defined!"); // @todo: format string

  const res = f(state, lhsAddr, rhsAddr);

  t.os.push(res);
};

type BinaryOpFn = (state: MachineState, lhs: Address, rhs: Address) => Address;

const extractFloat64s = (heap: DataView, ...addrs: Address[]): number[] => {
  return addrs.map((addr) => new Float64View(heap, addr).getValue());
};
const extractInt64s = (heap: DataView, ...addrs: Address[]): number[] => {
  return addrs.map((addr) => new Int64View(heap, addr).getValue());
};

// @todo add more binary builtins, and reduce the duplication
export const binaryBuiltins = new Map<DataType, Map<BinaryOp, BinaryOpFn>>([
  [
    DataType.Float64,
    new Map([
      [
        BinaryOp.Add,
        (state, lhsAddr, rhsAddr) => {
          const [lhs, rhs] = extractFloat64s(state.heap, lhsAddr, rhsAddr);

          const res = lhs + rhs;
          const ret = Float64View.allocate(state).setValue(res);
          return ret.addr;
        },
      ],
      [
        BinaryOp.Sub,
        (state, lhsAddr, rhsAddr) => {
          const [lhs, rhs] = extractFloat64s(state.heap, lhsAddr, rhsAddr);

          const res = lhs - rhs;
          const ret = Float64View.allocate(state).setValue(res);
          return ret.addr;
        },
      ],
      [
        BinaryOp.Neq,
        (state, lhsAddr, rhsAddr) => {
          const [lhs, rhs] = extractFloat64s(state.heap, lhsAddr, rhsAddr);

          if (lhs !== rhs) {
            return state.globals[Global["true"]];
          } else {
            return state.globals[Global["false"]];
          }
        },
      ],
      [
        BinaryOp.Eq,
        (state, lhsAddr, rhsAddr) => {
          const [lhs, rhs] = extractFloat64s(state.heap, lhsAddr, rhsAddr);

          if (lhs === rhs) {
            return state.globals[Global["true"]];
          } else {
            return state.globals[Global["false"]];
          }
        },
      ],
      [
        BinaryOp.Mul,
        (state, lhsAddr, rhsAddr) => {
          const [lhs, rhs] = extractFloat64s(state.heap, lhsAddr, rhsAddr);

          const res = lhs * rhs;
          const ret = Float64View.allocate(state).setValue(res);
          return ret.addr;
        },
      ],
      [
        BinaryOp.Div,
        (state, lhsAddr, rhsAddr) => {
          const [lhs, rhs] = extractFloat64s(state.heap, lhsAddr, rhsAddr);

          const res = lhs / rhs;
          const ret = Float64View.allocate(state).setValue(res);
          return ret.addr;
        },
      ],
      [
        BinaryOp.Leq,
        (state, lhsAddr, rhsAddr) => {
          const [lhs, rhs] = extractFloat64s(state.heap, lhsAddr, rhsAddr);

          if (lhs <= rhs) {
            return state.globals[Global["true"]];
          } else {
            return state.globals[Global["false"]];
          }
        },
      ],
      [
        BinaryOp.Geq,
        (state, lhsAddr, rhsAddr) => {
          const [lhs, rhs] = extractFloat64s(state.heap, lhsAddr, rhsAddr);

          if (lhs >= rhs) {
            return state.globals[Global["true"]];
          } else {
            return state.globals[Global["false"]];
          }
        },
      ],
      [
        BinaryOp.L,
        (state, lhsAddr, rhsAddr) => {
          const [lhs, rhs] = extractFloat64s(state.heap, lhsAddr, rhsAddr);
          if (lhs < rhs) {
            return state.globals[Global["true"]];
          } else {
            return state.globals[Global["false"]];
          }
        },
      ],
      [
        BinaryOp.G,
        (state, lhsAddr, rhsAddr) => {
          const [lhs, rhs] = extractFloat64s(state.heap, lhsAddr, rhsAddr);

          if (lhs > rhs) {
            return state.globals[Global["true"]];
          } else {
            return state.globals[Global["false"]];
          }
        },
      ],
    ]),
  ],
  [
    DataType.Int64,
    new Map([
      [
        BinaryOp.Add,
        (state, lhsAddr, rhsAddr) => {
          const [lhs, rhs] = extractInt64s(state.heap, lhsAddr, rhsAddr);

          const res = lhs + rhs;
          const ret = Int64View.allocate(state).setValue(res);
          return ret.addr;
        },
      ],
      [
        BinaryOp.Sub,
        (state, lhsAddr, rhsAddr) => {
          const [lhs, rhs] = extractInt64s(state.heap, lhsAddr, rhsAddr);

          const res = lhs - rhs;
          const ret = Int64View.allocate(state).setValue(res);
          return ret.addr;
        },
      ],
      [
        BinaryOp.Neq,
        (state, lhsAddr, rhsAddr) => {
          const [lhs, rhs] = extractInt64s(state.heap, lhsAddr, rhsAddr);

          if (lhs !== rhs) {
            return state.globals[Global["true"]];
          } else {
            return state.globals[Global["false"]];
          }
        },
      ],
      [
        BinaryOp.Eq,
        (state, lhsAddr, rhsAddr) => {
          const [lhs, rhs] = extractInt64s(state.heap, lhsAddr, rhsAddr);

          if (lhs === rhs) {
            return state.globals[Global["true"]];
          } else {
            return state.globals[Global["false"]];
          }
        },
      ],
      [
        BinaryOp.Mul,
        (state, lhsAddr, rhsAddr) => {
          const [lhs, rhs] = extractInt64s(state.heap, lhsAddr, rhsAddr);

          const res = lhs * rhs;
          const ret = Int64View.allocate(state).setValue(res);
          return ret.addr;
        },
      ],
      [
        BinaryOp.Div,
        (state, lhsAddr, rhsAddr) => {
          const [lhs, rhs] = extractInt64s(state.heap, lhsAddr, rhsAddr);

          const res = Math.floor(lhs / rhs);
          const ret = Int64View.allocate(state).setValue(res);
          return ret.addr;
        },
      ],
      [
        BinaryOp.Leq,
        (state, lhsAddr, rhsAddr) => {
          const [lhs, rhs] = extractInt64s(state.heap, lhsAddr, rhsAddr);

          if (lhs <= rhs) {
            return state.globals[Global["true"]];
          } else {
            return state.globals[Global["false"]];
          }
        },
      ],
      [
        BinaryOp.Geq,
        (state, lhsAddr, rhsAddr) => {
          const [lhs, rhs] = extractInt64s(state.heap, lhsAddr, rhsAddr);

          if (lhs >= rhs) {
            return state.globals[Global["true"]];
          } else {
            return state.globals[Global["false"]];
          }
        },
      ],
      [
        BinaryOp.L,
        (state, lhsAddr, rhsAddr) => {
          const [lhs, rhs] = extractInt64s(state.heap, lhsAddr, rhsAddr);
          if (lhs < rhs) {
            return state.globals[Global["true"]];
          } else {
            return state.globals[Global["false"]];
          }
        },
      ],
      [
        BinaryOp.G,
        (state, lhsAddr, rhsAddr) => {
          const [lhs, rhs] = extractInt64s(state.heap, lhsAddr, rhsAddr);

          if (lhs > rhs) {
            return state.globals[Global["true"]];
          } else {
            return state.globals[Global["false"]];
          }
        },
      ],
    ]),
  ],
  [
    DataType.Bool,
    new Map([
      [
        BinaryOp.Eq,
        (state, lhsAddr, rhsAddr) => {
          /**
           * Booleans are globals, so we can directly compare addresses.
           */
          if (lhsAddr === rhsAddr) {
            return state.globals[Global["true"]];
          } else {
            return state.globals[Global["false"]];
          }
        },
      ],
      [
        BinaryOp.Neq,
        (state, lhsAddr, rhsAddr) => {
          if (lhsAddr !== rhsAddr) {
            return state.globals[Global["true"]];
          } else {
            return state.globals[Global["false"]];
          }
        },
      ],
    ]),
  ],
  [
    DataType.Pointer,
    new Map([
      [
        BinaryOp.Eq,
        (state, lhsAddr, rhsAddr) => {
          const lhs = new PointerView(state.heap, lhsAddr).getValue();
          const rhs = new PointerView(state.heap, rhsAddr).getValue();
          if (lhs === rhs) {
            return state.globals[Global["true"]];
          } else {
            return state.globals[Global["false"]];
          }
        },
      ],
      [
        BinaryOp.Neq,
        (state, lhsAddr, rhsAddr) => {
          const lhs = new PointerView(state.heap, lhsAddr).getValue();
          const rhs = new PointerView(state.heap, rhsAddr).getValue();
          if (lhs !== rhs) {
            return state.globals[Global["true"]];
          } else {
            return state.globals[Global["false"]];
          }
        },
      ],
    ]),
  ],
  [
    // @todo: add string concat (+) and string eq (==)
    DataType.String,
    new Map([
      [
        BinaryOp.Eq,
        (state, lhsAddr, rhsAddr) => {
          const lhs = new StringView(state.heap, lhsAddr, state).getId();
          const rhs = new StringView(state.heap, rhsAddr, state).getId();
          if (lhs === rhs) {
            return state.globals[Global["true"]];
          } else {
            return state.globals[Global["false"]];
          }
        },
      ],
      [
        BinaryOp.Neq,
        (state, lhsAddr, rhsAddr) => {
          const lhs = new StringView(state.heap, lhsAddr, state).getId();
          const rhs = new StringView(state.heap, rhsAddr, state).getId();
          if (lhs !== rhs) {
            return state.globals[Global["true"]];
          } else {
            return state.globals[Global["false"]];
          }
        },
      ],
      [
        BinaryOp.Add,
        (state, lhsAddr, rhsAddr) => {
          const lhs = new StringView(state.heap, lhsAddr, state).toString();
          const rhs = new StringView(state.heap, rhsAddr, state).toString();

          const res = lhs + rhs;
          const id = state.strPool.add(res);
          const strView = StringView.allocate(state);
          const ret = new StringView(state.heap, strView.addr, state).setId(id);
          return ret.addr;
        },
      ],
    ]),
  ],
]);

const execLogicalOp = (state: MachineState, t: Thread, op: LogicalOp): void => {
  const lhsAddr = t.os.pop();
  const rhsAddr = t.os.pop();

  const _lhs = new BoolView(state.heap, lhsAddr);
  const _rhs = new BoolView(state.heap, rhsAddr);

  const lhs = _lhs.get();
  const rhs = _rhs.get();

  switch (op) {
    case LogicalOp.And:
      if (lhs && rhs) {
        t.os.push(state.globals[Global["true"]]);
      } else {
        t.os.push(state.globals[Global["false"]]);
      }
      break;
    case LogicalOp.Or:
      if (lhs || rhs) {
        t.os.push(state.globals[Global["true"]]);
      } else {
        t.os.push(state.globals[Global["false"]]);
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
          const val = new Float64View(state.heap, addr).getValue();

          const res = Float64View.allocate(state);
          res.setValue(-val);

          return res.addr;
        },
      ],
      [UnaryOp.Add, (_state, addr) => addr],
    ]),
  ],
  [
    DataType.Int64,
    new Map([
      [
        UnaryOp.Sub,
        (state, addr) => {
          const val = new Int64View(state.heap, addr).getValue();

          const res = Int64View.allocate(state);
          res.setValue(-val);

          return res.addr;
        },
      ],
      [UnaryOp.Add, (_state, addr) => addr],
    ]),
  ],
  [
    DataType.Bool,
    new Map([
      [
        UnaryOp.Not,
        (state, addr) => {
          const val = new BoolView(state.heap, addr).get();
          if (val) {
            return state.globals[Global.false];
          } else {
            return state.globals[Global.true];
          }
        },
      ],
      [UnaryOp.Add, (_state, addr) => addr],
    ]),
  ],
]);

interface BuiltinEvalContext {
  /**
   * Address of the method, if the builtin is a method.
   */
  mthd?: MethodView;
}
interface BuiltinEvalResult {
  /**
   * Whether to restore the thread's state.
   */
  restore?: boolean;
}

type BuiltinEvalFn = (state: MachineState, t: Thread, args: Address[], ctx?: BuiltinEvalContext) => BuiltinEvalResult;

const builtinFns: Record<BuiltinId, BuiltinEvalFn> = {
  [BuiltinId["dbg"]]: function (state: MachineState, t: Thread, args: Address[]) {
    const reprs = args.map((arg) => NodeView.of(state.heap, arg, { strPool: state.strPool }).toString()).join(" ");
    const lineno = state.srcMap.get(t.pc);
    if (lineno !== undefined) {
      console.log("line", lineno, ":", reprs);
    } else {
      console.log(reprs);
    }
    return {};
  },
  [BuiltinId["panic"]]: function (state: MachineState, t: Thread, args: number[]) {
    const reprs = args.map((arg) => NodeView.of(state.heap, arg, { strPool: state.strPool }).toString()).join(" ");
    console.log("panic:", reprs);
    const lineno = state.srcMap.get(t.pc);
    if (lineno !== undefined) {
      console.log("at line", lineno);
    }
    throw new PanicError(reprs); // we should never recover from this
  },
  [BuiltinId["Mutex::Lock"]]: function (state: MachineState, t: Thread, _args: number[], ctx?: BuiltinEvalContext) {
    if (ctx?.mthd === undefined) {
      throw new Error("could not access method for Mutex::Lock");
    }

    const _mu = new PointerView(state.heap, ctx.mthd.receiver() /* pointer to the mutex */);
    const mu = new StructView(state.heap, _mu.getValue());

    // Layout of the Mutex struct is defined in compiler.ts
    const locked = new BoolView(state.heap, mu.getField(0));
    const id = new Int64View(state.heap, mu.getField(1));

    if (locked.get()) {
      // The mutex is locked by someone else. We'll put this thread to sleep,
      // and subscribe to when it gets unlocked.
      t.isLive = false;
      state.sub("mutex-unlock", id.getValue(), t.id, (t, _src) => {
        t.isLive = true;
      });
      // @todo: check if this sub here works. The intent is to put the thread
      // back to sleep, if someone else got to lock the mutex before it while
      // it was waiting.
      state.sub("mutex-lock", id.getValue(), t.id, (t, src) => {
        if (src === t.id) return;
        t.isLive = false;
      });
      return { restore: true };
    } else {
      mu.setField(0, state.globals[Global["true"]]);
      if (id.getValue() === 0) {
        // An ID of zero means the mutex has not been access before. We
        // initialize it now by getting a unique lock ID.
        id.setValue(state.getLockId());
      }
      return {};
    }
  },
  [BuiltinId["Mutex::Unlock"]]: function (state: MachineState, t: Thread, _args: number[], ctx?: BuiltinEvalContext) {
    if (ctx?.mthd === undefined) {
      throw new Error("could not access method for Mutex::Lock");
    }
    const _mu = new PointerView(state.heap, ctx.mthd.receiver() /* address of pointer to the mutex */);
    const mu = new StructView(state.heap, _mu.getValue());

    // Layout of the Mutex struct is defined in compiler.ts
    const locked = new BoolView(state.heap, mu.getField(0));
    const id = new Int64View(state.heap, mu.getField(1));

    if (locked.get()) {
      mu.setField(0, state.globals[Global["false"]]);
      state.pub("mutex-unlock", id.getValue(), t.id);
    }

    return {};
  },
};

class PanicError extends Error {}
