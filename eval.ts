import { Address } from "./util";
import { CallFrameView, DataType, Float64View, FnView, FrameView, MachineState, NodeView } from "./heapviews";
import { IAssign, ILoadFn, Opcode, UnaryOp, BinaryOp, IUnaryOp, ICall, IBinaryOp } from "./instructions";

type EvalFn = (state: MachineState) => void;

const microcode: Record<Opcode, EvalFn> = {
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
    // The confusing thing is that passing arguments in Go works very
    // differently from Source.
    //
    // For example, in this code
    //
    //   x := 1
    //   f(x)
    //
    // We are passing a *copy* of x into f, and f has no way to mutate x. With
    // the Source-like memory model, we would be passing a "reference" to the
    // same variable, and f could potentially assign new values to x.
    //
    // For now we'll stick to the Source way...
    const instr = new ICall(state.bytecode, state.pc);
    const argc = instr.argc();

    state.pc += ICall.size;

    // 1. Pop [argc] addresses off the OS
    const args: Address[] = [];
    for (let i = 0; i < argc; ++i) {
      args.push(state.os.pop());
    }
    args.reverse();

    // 2. Save a call frame on RTS
    const callFrame = CallFrameView.allocate(state);
    callFrame.setPc(state.pc);
    callFrame.setEnv(state.env);

    state.rts.push(callFrame.addr);

    // 3. Obtain fn's env, and extend it
    const fnAddr = state.os.pop();
    const fn = new FnView(state.heap, fnAddr);

    const frame = FrameView.allocate(state, argc);
    for (let i = 0; i < argc; ++i) {
      frame.set(i, args[i]);
    }
    const newEnv = fn.getEnv().extend(state, frame.addr);

    // 4. Done. We jump to the function's starting address.
    state.env = newEnv;
    state.pc = fn.getPc();
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
    throw new Error("Function not implemented.");
  },
  [Opcode.Goto]: function (state: MachineState): void {
    throw new Error("Function not implemented.");
  },
  [Opcode.LoadFn]: function (state: MachineState): void {
    const instr = new ILoadFn(state.bytecode, state.pc);
    const fn = FnView.allocate(state);

    const argframe = FrameView.allocate(state, instr.argc());
    const fnEnv = state.env.extend(state, argframe.addr);

    fn.setEnv(fnEnv);
    fn.setPc(instr.pc());

    state.os.push(fn.addr);
    state.pc += ILoadFn.size;
  },
  [Opcode.Assign]: function (state: MachineState): void {
    const lhsAddr = state.os.pop();
    const rhs = state.os.peek(); // leave RHS on the OS

    // Note that assignment here differs from how CS4215 assignments handled
    // it. We don't always have a frame and offset to assign into (e.g. maybe
    // we are assigning to a field of a struct?) so we assign directly to
    // an address.
    state.heap.setFloat64(lhsAddr, rhs);

    state.pc += IAssign.size;
  },
  [Opcode.IdentLoc]: function (state: MachineState): void {
    throw new Error("Function not implemented.");
  },
  [Opcode.Ident]: function (state: MachineState): void {
    throw new Error("Function not implemented.");
  },
  [Opcode.Jof]: function (state: MachineState): void {
    throw new Error("Function not implemented.");
  },
  [Opcode.EnterBlock]: function (state: MachineState): void {
    throw new Error("Function not implemented.");
  },
  [Opcode.ExitBlock]: function (state: MachineState): void {
    throw new Error("Function not implemented.");
  },
  [Opcode.Pop]: function (state: MachineState): void {
    throw new Error("Function not implemented.");
  },
  [Opcode.LoadC]: function (state: MachineState): void {
    throw new Error("Function not implemented.");
  },
  [Opcode.Done]: function (state: MachineState): void {
    throw new Error("Function not implemented.");
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

  const f = binaryBuiltins.get([lhsType, op]);
  if (!f) throw new Error("No binary operation defined!"); // @todo: format string

  const res = f(state, lhsAddr, rhsAddr);

  state.os.push(res);
};

type BinaryOpFn = (state: MachineState, lhs: Address, rhs: Address) => Address;

export const binaryBuiltins = new Map<[DataType, BinaryOp], BinaryOpFn>([
  [
    [DataType.Float64, BinaryOp.Add],
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
