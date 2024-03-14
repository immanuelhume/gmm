/* A scratchpad to test the parser */

import { CharStream, CommonTokenStream } from 'antlr4'
import GoLexer from './antlr/GoLexer'
import GoParser, { BlockContext, ExprContext, FuncDeclContext, GoStmtContext, IdentContext, IfStmtContext, LitStrContext, NumberContext, PrimaryExprContext, ProgContext, ReturnStmtContext, SendStmtContext, StmtContext, VarDeclContext } from './antlr/GoParser'
import GoVisitor from './antlr/GoParserVisitor'
import { readFileSync } from 'fs'
import assert from 'assert'


interface Stack<T> {
  push: (t: T) => void
  pop: () => T
  forEach: <S>(f: (t: T) => S) => void
}

/*
Memory model:

- Everything is represented as a "node" on the heap
- Each node consists of >= 1 words
- Each word is 64 bits

  ┌──────────────────┬─────────────┬───┐
  │data type (8 bits)│size (8 bits)│...│
  └──────────────────┴─────────────┴───┘
- The first word of each node is a metadata block
  - The size refers to no. of words in this node (must be >= 1)
*/

type Address = number

/* [NodeView] encapsulates how we access parts of nodes. */
class NodeView {
  protected readonly heap: DataView
  readonly addr: Address

  protected constructor(heap: DataView, addr: Address) {
    this.heap = heap
    this.addr = addr
  }

  static getDataType(heap: DataView, addr: Address): DataType { return heap.getUint8(addr) }

  dataType(): DataType { return NodeView.getDataType(this.heap, this.addr) }
  size(): number { return this.heap.getUint8(this.addr + 1) }

  protected childByteOffset(i: number): Address {
    return this.addr + (i + 1) * 8
  }

  protected getChild(i: number): number {
    return this.heap.getFloat64(this.childByteOffset(i))
  }

  protected setChild(i: number, value: number): void {
    this.heap.setFloat64(this.childByteOffset(i), value)
  }

  checkType(type: DataType) {
    assert(this.dataType() === type)
  }
}

class Float64View extends NodeView {
  static readonly size: number = 2;

  static allocate(state: MachineState): Float64View {
    const addr = allocate(state, DataType.Float64, 2)
    return new Float64View(state.heap, addr)
  }

  constructor(heap: DataView, addr: Address) {
    super(heap, addr)
    this.checkType(DataType.Float64)
  }

  getValue(): number {
    return this.getChild(0)
  }

  setValue(value: number): void {
    this.setChild(0, value)
  }
}

class Int64View extends NodeView {
  static readonly size: number = 2;

  static allocate(state: MachineState): Int64View {
    const addr = allocate(state, DataType.Int64, 2)
    return new Int64View(state.heap, addr)
  }

  constructor(heap: DataView, addr: Address) {
    super(heap, addr)
    this.checkType(DataType.Int64)
  }

  getValue(): number {
    return this.getChild(0)
  }

  setValue(value: number): void {
    this.setChild(0, value)
  }
}

class FrameView extends NodeView {
  static allocate(state: MachineState, numVars: number): FrameView {
    const addr = allocate(state, DataType.Frame, numVars + 1)
    return new FrameView(state.heap, addr)
  }

  constructor(heap: DataView, addr: Address) {
    super(heap, addr)
    this.checkType(DataType.Frame)
  }

  get(i: number): Address {
    return this.getChild(i)
  }

  set(i: number, addr: Address): void {
    return this.setChild(i, addr)
  }

  numVars(): number {
    return this.size() - 1
  }
}

class EnvView extends NodeView {
  static allocate(state: MachineState, numFrames: number): EnvView {
    const addr = allocate(state, DataType.Frame, numFrames + 1)
    return new EnvView(state.heap, addr)
  }

  constructor(heap: DataView, addr: Address) {
    super(heap, addr)
    this.checkType(DataType.Frame)
  }

  /* Allocates a new environment node which includes the provided frames. */
  extend(state: MachineState, ...newFrames: Address[]): EnvView {
    const totalFrames = this.numFrames() + newFrames.length
    const ret = EnvView.allocate(state, totalFrames)
    for (let i = 0; i < newFrames.length; ++i) {
      ret.setFrame(i, newFrames[i])
    }
    for (let i = 0; i < this.numFrames(); ++i) {
      ret.setFrame(newFrames.length + i, this.getFrame(i))
    }
    return ret
  }

  getFrame(i: number): Address {
    return this.getChild(i)
  }

  setFrame(i: number, addr: Address): void {
    return this.setChild(i, addr)
  }

  numFrames(): number {
    return this.size() - 1
  }
}

class CallFrameView extends NodeView {
  static readonly size: number = 3

  static allocate(state: MachineState): CallFrameView {
    const addr = allocate(state, DataType.CallFrame, CallFrameView.size)
    return new CallFrameView(state.heap, addr)
  }

  constructor(heap: DataView, addr: Address) {
    super(heap, addr)
    this.checkType(DataType.CallFrame)
  }

  getPc(): Address {
    return this.getChild(0)
  }

  setPc(pc: Address): void {
    this.setChild(0, pc)
  }

  getEnv(): EnvView {
    return new EnvView(this.heap, this.getChild(1))
  }

  setEnv(env: EnvView) {
    this.setChild(1, env.addr)
  }
}

class FnView extends NodeView {
  static readonly size: number = 3

  static allocate(state: MachineState): FnView {
    const addr = allocate(state, DataType.Fn, FnView.size)
    return new FnView(state.heap, addr)
  }

  constructor(heap: DataView, addr: Address) {
    super(heap, addr)
    this.checkType(DataType.Fn)
  }

  getPc(): Address {
    return this.getChild(0)
  }

  setPc(pc: Address): void {
    this.setChild(0, pc)
  }

  getEnv(): EnvView {
    return new EnvView(this.heap, this.getChild(1))
  }

  setEnv(env: EnvView) {
    this.setChild(1, env.addr)
  }
}

interface MachineState {
  readonly bytecode: DataView
  pc: number
  rts: Stack<Address>
  os: Stack<Address>
  env: EnvView
  heap: DataView
  free: number
  globals: Record<Global, Address>
}

const enum Opcode {
  BinaryOp = 0x00, // BinaryOp op
  UnaryOp,
  Return, // returns with value at top
  Call, // Call argc
  Goto,
}

/* Size of each instruction by opcode, in bytes */
const instrSize: Record<Opcode, number> = {
  [Opcode.BinaryOp]: 2,
  [Opcode.UnaryOp]: 2,
  [Opcode.Return]: 1,
  [Opcode.Call]: 1 + 1,
  [Opcode.Goto]: 1 + 8,
}

class InstrView {
  protected readonly bytecode: DataView
  protected readonly addr: Address

  constructor(bytecode: DataView, addr: Address) {
    this.bytecode = bytecode
    this.addr = addr
  }
}

class GotoView extends InstrView {
  getWhere(): Address {
    return this.bytecode.getFloat64(this.addr + 1)
  }

  setWhere(where: Address) {
    this.bytecode.setFloat64(this.addr + 1, where)
  }
}

const instrView: Record<Opcode, typeof InstrView | undefined> = {
  [Opcode.BinaryOp]: undefined,
  [Opcode.UnaryOp]: undefined,
  [Opcode.Return]: undefined,
  [Opcode.Call]: undefined,
  [Opcode.Goto]: GotoView,
}

/* These are data types representable in memory. */
const enum DataType {
  Float64 = 0x00,
  Int64,
  Channel,
  String,
  Fn,
  Frame,
  Env,
  CallFrame,
  BlockFrame,
}

const allocate = (state: MachineState, dataType: DataType, size: number): number => {
  const addr = state.free
  state.free += size
  state.heap.setUint8(addr, dataType)
  state.heap.setUint8(addr + 1, size)
  return addr
}

const enum Global {
  True,
  False,
  Nil,
}

const execBinaryOp = (state: MachineState, op: BinaryOp): void => {
  const rhsAddr = state.os.pop()
  const lhsAddr = state.os.pop()

  const lhsType = NodeView.getDataType(state.heap, lhsAddr)
  const rhsType = NodeView.getDataType(state.heap, rhsAddr)

  // @todo: should we have this check?
  if (lhsType !== rhsType) {
    throw new Error("Can't perform binary operation on different data types!")
  }

  const f = binaryBuiltins.get([lhsType, op])
  if (!f) throw new Error("No binary operation defined!") // @todo: format string

  const res = f(state, lhsAddr, rhsAddr)

  state.os.push(res)
}

type BinaryOpFn = (state: MachineState, lhs: Address, rhs: Address) => Address

const binaryBuiltins = new Map<[DataType, BinaryOp], BinaryOpFn>([
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

    const resAddr = allocate[DataType.Float64](state)
    const res = new Float64View(state.heap, resAddr)
    res.setValue(-val)

    return resAddr
  }]
])

const enum UnaryOp {
  Add = 0x00,
  Sub,
}

const enum BinaryOp {
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
  }
}

class BytecodeWriter {
  code: DataView
  wc: Address

  constructor(codeLen: number = 1028) {
    this.code = new DataView(new ArrayBuffer(codeLen))
    this.wc = 0
  }
}

class Assembler extends GoVisitor<void> {
  bytecode: ArrayBuffer
  wc: number

  constructor() {
    super()

    this.bytecode = new ArrayBuffer(1028)
    this.wc = 0
  }

  visitProg = (ctx: ProgContext) => {
    ctx.stmt_list().forEach(stmt => this.visit(stmt))
  }

  visitStmt = (ctx: StmtContext) => {
    this.visitChildren(ctx) // dispatches to each alternative
  }

  visitExpr = (ctx: ExprContext) => {
    console.log(`compiling expression ${ctx.getText()} - my bytecode should leave a value on the OS`)
    if (ctx.binaryOp()) {
      this.visit(ctx._lhs)
      this.visit(ctx._rhs)
      this.visit(ctx.binaryOp())
    } else if (ctx.unaryOp()) {
      this.visit(ctx.expr(0))
      this.visit(ctx.unaryOp())
    } else {
      this.visit(ctx.primaryExpr())
    }
  }

  visitPrimaryExpr = (ctx: PrimaryExprContext) => {
    if (ctx.ident()) {
      this.visit(ctx.ident())
    } else if (ctx.lit()) {
      this.visit(ctx.lit())
    } else if (ctx._fn) {
      const args = ctx.args()
      // @todo: emit code to eval args, fn, and then call 
    } else if (ctx._base) {
      // @todo: figure out this shit
    }
  }

  visitIdent = (ctx: IdentContext) => {
    // @todo: perform lookup in compile time environment
    // the result should be a tuple of (E, F, i) - env, frame, offset in frame
    //
    // these 3 args should be given to the bytecode
  }

  visitVarDecl = (ctx: VarDeclContext) => {
    if (ctx.expr()) {
      console.log(`variable ${ctx.ident().getText()} was initialized to ${ctx.expr().getText()}`)
    } else {
      console.log(`variable ${ctx.ident().getText()} was default initialized`)
    }
  }

  visitReturnStmt = (ctx: ReturnStmtContext) => {
    console.log("in a return statement")
    this.visit(ctx.expr())
  }

  visitNumber = (ctx: NumberContext) => {
    if (ctx.INT()) {
      console.log("got an integer: ", parseInt(ctx.INT().getText()))
    }
  }

  visitFuncDecl = (ctx: FuncDeclContext) => {
    const funcName = ctx.ident().getText()
    const params = ctx.signature().params().param_list().map(param => {
      return param.ident().getText()
    })
    const fnStartAddr = this.wc
    this.visit(ctx.funcBody()) // compile the body
  }

  visitBlock = (ctx: BlockContext) => {
    console.log("compiling block")
    this.visitChildren(ctx) // compile each statement
  }

  visitLitStr = (ctx: LitStrContext) => {
    // The lit str comes as a quoted string, so we need to strip the quotes first
    const raw = ctx.LIT_STR().getText();
    const len = raw.length;
    console.log("got string lit: ", raw.substring(1, len - 1))
  }

  visitGoStmt = (ctx: GoStmtContext) => {
    // We'll need to check if go [expr] is actually a function call
    if (!ctx.primaryExpr().primaryExpr()) {
      console.error(`expected function call at go statement, got ${ctx.primaryExpr().getText()}`)
    }
  }

  visitSendStmt = (ctx: SendStmtContext) => {
    const chan = ctx._channel
  }

  visitIfStmt = (ctx: IfStmtContext) => {
    if (ctx._alt) {
      console.log("alternative block: ", ctx._alt.getText())
      this.visit(ctx._alt)
    } else {
      console.log("if has if-else")
      this.visit(ctx.ifStmt())
    }
  }
}

const input = readFileSync("scratch.go").toString()
const chars = new CharStream(input)
const lexer = new GoLexer(chars)
const tokens = new CommonTokenStream(lexer)
const parser = new GoParser(tokens)

parser.buildParseTrees = true

const tree = parser.prog()
console.log(tree.toStringTree(parser.ruleNames, parser))

const compiler = new Assembler()
compiler.visit(tree)
