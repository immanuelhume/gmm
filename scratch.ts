/* A scratchpad to test the parser */

import { CharStream, CommonTokenStream } from 'antlr4'
import GoLexer from './antlr/GoLexer'
import GoParser, { BlockContext, ExprContext, FuncDeclContext, GoStmtContext, LitStrContext, NumberContext, ReturnStmtContext, SendStmtContext, StmtContext, TypeContext, VarDeclContext } from './antlr/GoParser'
import GoVisitor from './antlr/GoParserVisitor'
import { readFileSync } from 'fs'

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
    this.visitChildren(ctx)
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

  visitGoStmt = (ctx : GoStmtContext) => {
    // We'll need to check if the go [expr] is actually a function call
    if (!ctx.primaryExpr().primaryExpr()) {
      console.error(`expected function call at go statement, got ${ctx.primaryExpr().getText()}`)
    }
  }

  visitSendStmt = ( ctx : SendStmtContext ) => {
    const chan = ctx._channel
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
