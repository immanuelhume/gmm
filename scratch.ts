/* A scratchpad to test the parser */

import { CharStream, CommonTokenStream } from 'antlr4'
import GoLexer from './antlr/GoLexer'
import GoParser, { BlockContext, ExprContext, FuncDeclContext, GoStmtContext, IfStmtContext, LitStrContext, NumberContext, ReturnStmtContext, SendStmtContext, StmtContext, VarDeclContext } from './antlr/GoParser'
import GoVisitor from './antlr/GoParserVisitor'
import { readFileSync } from 'fs'


interface Stack<T> {
  push: (t: T) => void
  pop: () => T
  forEach: <S>(f: (t: T) => S) => void
}

type Operator<T> = (lhs: T, rhs: T) => T

/*
Memory model:

- Everything is represented as a "node" on the heap
- Each node consists of >= 1 words
- Each word is 64 bits

- The first word of each node is a metadata block
- Metadata block: [ 8 bit data type | 8 bit size | ... ]
  - The size refers to no. of words in this node (must be >= 1)
*/

type Address = number

class NodeViewer {
  private readonly heap: DataView
  private readonly addr: Address

  constructor(heap: Readonly<DataView>, addr: Address) {
    this.heap = heap
    this.addr = addr
  }

  getAddr(): Address { return this.addr }
  getDataType(): DataType { return this.heap.getUint8(this.addr) }
  getSize(): number { return this.heap.getUint8(this.addr + 1) }

  isNumeric(): boolean {
    const dataType = this.getDataType()
    return dataType in [DataType.Float64, DataType.Int64]
  }

  childByteOffset(i: number): number {
    return this.addr + (i + 1) * 8
  }

  getChild<T>(i: number, f: (addr: Address) => T): T {
    return f.call(this.heap, this.childByteOffset(i))
  }

  setChild<T>(i: number, t: T, f: (addr: Address, t: T) => void): void {
    return f.call(this.heap, this.childByteOffset(i), t)
  }
}

interface MachineState {
  readonly bytecode: DataView,
  pc: number,
  rts: Stack<Address>,
  os: Stack<Address>,
  env: Address
  heap: DataView,
  free: number
}

type EvalFn = (state: MachineState) => void

const enum OpCode {
  Return = 0x00,
  Add,
  Sub,
}

/* These are primitive Go data types. */
const enum DataType {
  Float64 = 0x00,
  Int64,
  Channel,
}

const interpretData: Record<DataType, (byteOffset: number) => number> = {
  [DataType.Float64]: DataView.prototype.getFloat64,
  [DataType.Int64]: DataView.prototype.getFloat64, // ints are implemented as floats...

  [DataType.Channel]: DataView.prototype.getFloat64, // channels are floats too
}

const writeData: Record<DataType, (byteOffset: number, v: number) => void> = {
  [DataType.Float64]: DataView.prototype.setFloat64,
  [DataType.Int64]: DataView.prototype.setFloat64, // ints are implemented as floats...

  [DataType.Channel]: DataView.prototype.setFloat64, // channels are floats too
}

const allocate: Record<DataType, (state: MachineState) => number> = {
  [DataType.Float64]: function(state: MachineState): number {
    const addr = state.free
    const size = 2
    state.free += size
    state.heap.setUint8(addr, DataType.Float64)
    state.heap.setUint8(addr + 1, size)
    return addr
  },
  [DataType.Int64]: function(state: MachineState): number {
    throw new Error('Function not implemented.')
  },
  [DataType.Channel]: function(state: MachineState): number {
    throw new Error('Function not implemented.')
  }
}

const verifyNodes = (nodes: NodeViewer[], ...checks: [(...nodes: NodeViewer[]) => boolean, string][]) => {
  checks.forEach(([check, msg]) => {
    if (!check(...nodes)) {
      throw new Error(msg)
    }
  })
}

const hasSameDataType = (...nodes: NodeViewer[]): boolean => {
  if (nodes.length === 0) return true
  const type = nodes[0].getDataType()
  return nodes.every(node => node.getDataType() === type)
}

const allNumeric = (...nodes: NodeViewer[]): boolean => {
  return nodes.every(node => node.isNumeric())
}


const execNumericBinaryOp = (state: MachineState, f: Operator<number>): void => {
  const lhsAddr = state.os.pop()
  const rhsAddr = state.os.pop()
  const lhs = new NodeViewer(state.heap, lhsAddr)
  const rhs = new NodeViewer(state.heap, rhsAddr)

  verifyNodes([lhs, rhs],
    [hasSameDataType, "Cannot add different data types"],
    [allNumeric, "Cannot add non-numeric types"],
  )

  const typ = lhs.getDataType() // lhs and rhs have same type

  // here, we extract the value by taking the 0th child, which presumes we know something
  // about the data layout. this function should NOT know about it!
  const lhsValue = lhs.getChild(0, interpretData[typ])
  const rhsValue = rhs.getChild(0, interpretData[typ])
  const resValue = f(lhsValue, rhsValue)

  const resAddr = allocate[typ](state)
  const res = new NodeViewer(state.heap, resAddr)
  res.setChild(0, resValue, writeData[typ])

  state.os.push(resAddr)
  state.pc += 1
}

const microcode: Record<OpCode, EvalFn> = {
  [OpCode.Return]: function(state: MachineState): void {
    throw new Error('Function not implemented.')
  },
  [OpCode.Add]: function(state: MachineState): void {
    execNumericBinaryOp(state, (lhs, rhs) => lhs + rhs)
  },
  [OpCode.Sub]: function(state: MachineState): void {
    execNumericBinaryOp(state, (lhs, rhs) => lhs - rhs)
  }
}

class GoCompiler extends GoVisitor<void> {
  bytecode: ArrayBuffer
  wc: number

  constructor() {
    super()

    this.bytecode = new ArrayBuffer(1028)
    this.wc = 0
  }

  visitStmt = (ctx: StmtContext) => {
    this.visitChildren(ctx)
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
      return { name: param.ident().getText() }
    })
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

const compiler = new GoCompiler()
compiler.visit(tree)
