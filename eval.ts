import { Address } from "./util"
import { execBinaryOp } from "./execBinaryOp"
import { CallFrameView, DataType, Float64View, FnView, FrameView, MachineState, NodeView } from "./heapviews"
import { Assign, LoadFn, Opcode } from "./instructions"

type EvalFn = (state: MachineState) => void

const microcode: Record<Opcode, EvalFn> = {
  [Opcode.BinaryOp]: function(state: MachineState): void {
    state.pc += 1
    const op = state.bytecode.getUint8(state.pc) as BinaryOp
    execBinaryOp(state, op)
  },
  [Opcode.UnaryOp]: function(state: MachineState): void {
    // We're assuming that [pc] has already been incremented once when
    // the opcode was read. So we increment it again to read the operand.
    state.pc += 1
    const op = state.bytecode.getUint8(state.pc) as UnaryOp
    execUnaryOp(state, op)
  },
  [Opcode.Call]: function(state: MachineState): void {
    state.pc += 1
    const argc = state.bytecode.getUint8(state.pc)

    // 1. Pop [argc] addresses off the OS
    const args: Address[] = []
    for (let i = 0; i < argc; ++i) {
      args.push(state.os.pop())
    }
    args.reverse()

    // 2. Save a call frame on RTS
    const callFrame = CallFrameView.allocate(state)
    callFrame.setPc(state.pc)
    callFrame.setEnv(state.env)

    state.rts.push(callFrame.addr)

    // 3. Obtain fn's env, extend it
    const fnAddr = state.os.pop()
    const fn = new FnView(state.heap, fnAddr)

    const frame = FrameView.allocate(state, argc)
    for (let i = 0; i < argc; ++i) {
      frame.set(i, args[i])
    }
    const newEnv = fn.getEnv().extend(state, frame.addr)

    // 4. Done
    state.env = newEnv
    state.pc = fn.getPc()
  },
  [Opcode.Return]: function(state: MachineState): void {
    const addr = state.rts.pop()
    const typ = NodeView.getDataType(state.heap, addr)
    switch (typ) {
      case DataType.CallFrame:
        const frame = new CallFrameView(state.heap, addr)
        state.env = frame.getEnv()
        state.pc = frame.getPc()
        break
      case DataType.BlockFrame:
        return microcode[Opcode.Return](state)
      default:
        throw new Error("Unexpected data type in runtime stack!") // @todo: format the error
    }
    throw new Error('Function not implemented.')
  },
  [Opcode.Goto]: function(state: MachineState): void {
    throw new Error('Function not implemented.')
  },
  [Opcode.LoadFn]: function(state: MachineState): void {
    const instr = new LoadFn(state.bytecode, state.pc)
    const fn = FnView.allocate(state)

    const argframe = FrameView.allocate(state, instr.getArgc())
    const fnEnv = state.env.extend(state, argframe.addr)

    fn.setEnv(fnEnv)
    fn.setPc(instr.getPc())

    state.os.push(fn.addr)
    state.pc += LoadFn.size // skip to next instruction
  },
  [Opcode.Assign]: function(state: MachineState): void {
    const lhsAddr = state.os.pop()
    const rhs = state.os.pop()
    state.heap.setFloat64(lhsAddr, rhs)

    state.pc += Assign.size
  },
  [Opcode.LookupIdent]: function(state: MachineState): void {
    throw new Error('Function not implemented.')
  },
  [Opcode.Jof]: function(state: MachineState): void {
    throw new Error('Function not implemented.')
  },
  [Opcode.EnterBlock]: function(state: MachineState): void {
    throw new Error('Function not implemented.')
  },
  [Opcode.ExitBlock]: function(state: MachineState): void {
    throw new Error('Function not implemented.')
  }
}


type BinaryOpFn = (state: MachineState, lhs: Address, rhs: Address) => Address

export const binaryBuiltins = new Map<[DataType, BinaryOp], BinaryOpFn>([
  [[DataType.Float64, BinaryOp.Add], (state, lhsAddr, rhsAddr) => {
    const lhs = new Float64View(state.heap, lhsAddr)
    const rhs = new Float64View(state.heap, rhsAddr)

    const lhsValue = lhs.getValue()
    const rhsValue = rhs.getValue()
    const resValue = lhsValue + rhsValue

    const res = Float64View.allocate(state)
    res.setValue(resValue)

    return res.addr
  }],
])

const execUnaryOp = (state: MachineState, op: UnaryOp): void => {
  const operandAddr = state.os.pop()
  const typ = NodeView.getDataType(state.heap, operandAddr)

  const f = unaryBuiltins.get([typ, op])
  if (!f) throw new Error("No unary operation defined!") // @todo: format string

  const res = f(state, operandAddr)

  state.os.push(res)
}

type UnaryOpFn = (state: MachineState, addr: Address) => Address

const unaryBuiltins = new Map<[DataType, UnaryOp], UnaryOpFn>([
  [[DataType.Float64, UnaryOp.Sub], (state, addr) => {
    const num = new Float64View(state.heap, addr)
    const val = num.getValue()

    const res = Float64View.allocate(state)
    res.setValue(-val)

    return res.addr
  }]
])

const enum UnaryOp {
  Add = 0x00,
  Sub,
}

export const enum BinaryOp {
  Add = 0x00,
  Sub,
  Mul,
  Div,
  Eq,
  Neq,
  L,
  Leq,
  G,
  Geq,
}

