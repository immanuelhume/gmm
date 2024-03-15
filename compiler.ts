import { AssignmentContext, BlockContext, ExprContext, FuncDeclContext, IdentContext, IfStmtContext, PrimaryExprContext, ReturnStmtContext, TypeDeclContext, VarDeclContext } from './antlr/GoParser'
import GoVisitor from './antlr/GoParserVisitor'

import { Assign, Call, Emitter, EnterBlock, ExitBlock, Goto, IdentLoc, Jof, LoadFn, Opcode, Return } from "./instructions"

class BytecodeWriter implements Emitter {
  private _code: DataView
  private _wc: number

  constructor(codeLen: number = 1028) {
    this._code = new DataView(new ArrayBuffer(codeLen))
    this._wc = 0
  }

  code(): DataView { return this._code }
  wc(): number { return this._wc }

  /* Reserves space in the bytecode for an instruction corresponding to some opcode. */
  reserve(opcode: Opcode, size: number): number {
    const ret = this._wc
    this._code.setUint8(this._wc, opcode)
    this._wc += size
    return ret
  }
}

class CompileTimeEnvironment {
  private env: string[][]

  constructor() {
    this.env = []
  }

  pushFrame(frame: string[]) {
    this.env.unshift(frame)
  }

  popFrame() {
    this.env.shift()
  }

  lookup(ident: string): [number, number] {
    for (let i = 0; i < this.env.length; ++i) {
      const frame = this.env[i]
      const offset = frame.indexOf(ident)
      if (offset !== -1) {
        return [i, offset]
      }
    }
    // @todo: is it ok to throw an Error here?
    throw new Error(`Identifier [${ident}] not found in compile time environment`)
  }
}

export class Assembler extends GoVisitor<void> {
  bytecode: BytecodeWriter
  env: CompileTimeEnvironment

  constructor() {
    super()
    this.bytecode = new BytecodeWriter()
    this.env = new CompileTimeEnvironment()
  }

  visitFuncDecl = (ctx: FuncDeclContext) => {
    const ldf = LoadFn.emit(this.bytecode)
    const goto = Goto.emit(this.bytecode)
    const params = ctx.signature().params().param_list().map(param => {
      return param.ident().getText()
    })

    ldf.setPc(this.bytecode.wc()).setArgc(params.length)

    this.env.pushFrame(params)
    this.visit(ctx.funcBody()) // compile the body
    this.env.popFrame()

    goto.setWhere(this.bytecode.wc())

    // We need to explicitly handle the assignment instruction here, since our function
    // declarations with [func] are not re-written into simple assignment statements.
    //
    // This is a limitation of not working with an AST.
    const fnName = ctx.ident().getText()
    const [frame, offset] = this.env.lookup(fnName)
    IdentLoc.emit(this.bytecode)
      .setFrame(frame)
      .setOffset(offset)
    Assign.emit(this.bytecode)
  }

  visitVarDecl = (ctx: VarDeclContext) => {
    if (ctx.expr()) {
      this.visit(ctx.expr()) // compile RHS
      const ident = ctx.ident().getText()
      const [frame, offset] = this.env.lookup(ident)
      IdentLoc.emit(this.bytecode)
        .setFrame(frame)
        .setOffset(offset)
      Assign.emit(this.bytecode)
    } else {
      // @todo: need to find a way to handle default initialization
      //
      // perhaps we can have a global representing "uninitialized"? and then initialize it when
      // we first access the value?
      console.log(`variable ${ctx.ident().getText()} was default initialized`)
    }
  }

  visitTypeDecl = (ctx: TypeDeclContext) => {
    // @todo: wtf to do for type declarations?
  }

  visitReturnStmt = (ctx: ReturnStmtContext) => {
    this.visit(ctx.expr())
    Return.emit(this.bytecode)
  }

  visitIfStmt = (ctx: IfStmtContext) => {
    this.visit(ctx._cond) // compile the condition
    const jof = Jof.emit(this.bytecode)
    this.visit(ctx._cons) // compile consequent
    const goto = Goto.emit(this.bytecode)
    jof.setWhere(this.bytecode.wc())
    this.visit(ctx.alt())
    goto.setWhere(this.bytecode.wc())
  }

  visitBlock = (ctx: BlockContext) => {
    EnterBlock.emit(this.bytecode)
    this.visitChildren(ctx) // compile each statement
    ExitBlock.emit(this.bytecode)
  }

  visitAssignment = (ctx: AssignmentContext) => {
    this.visit(ctx._rhs)
    this.visit(ctx._lhs)
    Assign.emit(this.bytecode)
  }

  visitExpr = (ctx: ExprContext) => {
    // An expression can be one of three types.
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
      const fn = ctx._fn
      const argc = args.arg_list.length

      this.visit(args) // emit code to evaluate each arg
      this.visit(fn) // emit code to evaluate the callable thing

      const call = Call.emit(this.bytecode)
      call.setArgc(argc)
    } else if (ctx._base) {
      // @todo: figure out this shit
    }
  }

  visitIdent = (ctx: IdentContext) => {
    const ident = ctx.getText()
    const [frame, offset] = this.env.lookup(ident)
    IdentLoc.emit(this.bytecode).setFrame(frame).setOffset(offset)
  }
}
