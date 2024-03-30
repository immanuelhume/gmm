// Generated from GoParser.g4 by ANTLR 4.13.1

import { ParseTreeVisitor } from "antlr4";

import { ProgContext } from "./GoParser";
import { StmtContext } from "./GoParser";
import { SimpleStmtContext } from "./GoParser";
import { IfStmtContext } from "./GoParser";
import { AltContext } from "./GoParser";
import { SendStmtContext } from "./GoParser";
import { BreakStmtContext } from "./GoParser";
import { ContinueStmtContext } from "./GoParser";
import { GoStmtContext } from "./GoParser";
import { AssignmentContext } from "./GoParser";
import { LvalueListContext } from "./GoParser";
import { LvalueContext } from "./GoParser";
import { LnameContext } from "./GoParser";
import { LnameListContext } from "./GoParser";
import { FieldContext } from "./GoParser";
import { ForStmtContext } from "./GoParser";
import { ConditionContext } from "./GoParser";
import { ForClauseContext } from "./GoParser";
import { RangeClauseContext } from "./GoParser";
import { ExprStmtContext } from "./GoParser";
import { ReturnStmtContext } from "./GoParser";
import { ExprContext } from "./GoParser";
import { ExprListContext } from "./GoParser";
import { PrimaryExprContext } from "./GoParser";
import { SelectorContext } from "./GoParser";
import { ArgsContext } from "./GoParser";
import { ArgContext } from "./GoParser";
import { BlockContext } from "./GoParser";
import { UnaryOpContext } from "./GoParser";
import { LogicalOpContext } from "./GoParser";
import { RelOpContext } from "./GoParser";
import { NumericOpContext } from "./GoParser";
import { ShortVarDeclContext } from "./GoParser";
import { DeclContext } from "./GoParser";
import { TypeDeclContext } from "./GoParser";
import { VarDeclContext } from "./GoParser";
import { FuncDeclContext } from "./GoParser";
import { SignatureContext } from "./GoParser";
import { FuncBodyContext } from "./GoParser";
import { FuncResultContext } from "./GoParser";
import { LitFuncContext } from "./GoParser";
import { ParamsContext } from "./GoParser";
import { ParamContext } from "./GoParser";
import { TypeContext } from "./GoParser";
import { TypeNameContext } from "./GoParser";
import { TypeLitContext } from "./GoParser";
import { ChannelTypeContext } from "./GoParser";
import { ElementTypeContext } from "./GoParser";
import { StructTypeContext } from "./GoParser";
import { FieldDeclContext } from "./GoParser";
import { NameContext } from "./GoParser";
import { NameListContext } from "./GoParser";
import { LitContext } from "./GoParser";
import { LitNilContext } from "./GoParser";
import { LitStrContext } from "./GoParser";
import { LitBoolContext } from "./GoParser";
import { NumberContext } from "./GoParser";
import { EosContext } from "./GoParser";

/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by `GoParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export default class GoParserVisitor<Result> extends ParseTreeVisitor<Result> {
  /**
   * Visit a parse tree produced by `GoParser.prog`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitProg?: (ctx: ProgContext) => Result;
  /**
   * Visit a parse tree produced by `GoParser.stmt`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitStmt?: (ctx: StmtContext) => Result;
  /**
   * Visit a parse tree produced by `GoParser.simpleStmt`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitSimpleStmt?: (ctx: SimpleStmtContext) => Result;
  /**
   * Visit a parse tree produced by `GoParser.ifStmt`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitIfStmt?: (ctx: IfStmtContext) => Result;
  /**
   * Visit a parse tree produced by `GoParser.alt`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitAlt?: (ctx: AltContext) => Result;
  /**
   * Visit a parse tree produced by `GoParser.sendStmt`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitSendStmt?: (ctx: SendStmtContext) => Result;
  /**
   * Visit a parse tree produced by `GoParser.breakStmt`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitBreakStmt?: (ctx: BreakStmtContext) => Result;
  /**
   * Visit a parse tree produced by `GoParser.continueStmt`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitContinueStmt?: (ctx: ContinueStmtContext) => Result;
  /**
   * Visit a parse tree produced by `GoParser.goStmt`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitGoStmt?: (ctx: GoStmtContext) => Result;
  /**
   * Visit a parse tree produced by `GoParser.assignment`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitAssignment?: (ctx: AssignmentContext) => Result;
  /**
   * Visit a parse tree produced by `GoParser.lvalueList`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitLvalueList?: (ctx: LvalueListContext) => Result;
  /**
   * Visit a parse tree produced by `GoParser.lvalue`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitLvalue?: (ctx: LvalueContext) => Result;
  /**
   * Visit a parse tree produced by `GoParser.lname`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitLname?: (ctx: LnameContext) => Result;
  /**
   * Visit a parse tree produced by `GoParser.lnameList`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitLnameList?: (ctx: LnameListContext) => Result;
  /**
   * Visit a parse tree produced by `GoParser.field`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitField?: (ctx: FieldContext) => Result;
  /**
   * Visit a parse tree produced by `GoParser.forStmt`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitForStmt?: (ctx: ForStmtContext) => Result;
  /**
   * Visit a parse tree produced by `GoParser.condition`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitCondition?: (ctx: ConditionContext) => Result;
  /**
   * Visit a parse tree produced by `GoParser.forClause`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitForClause?: (ctx: ForClauseContext) => Result;
  /**
   * Visit a parse tree produced by `GoParser.rangeClause`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitRangeClause?: (ctx: RangeClauseContext) => Result;
  /**
   * Visit a parse tree produced by `GoParser.exprStmt`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitExprStmt?: (ctx: ExprStmtContext) => Result;
  /**
   * Visit a parse tree produced by `GoParser.returnStmt`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitReturnStmt?: (ctx: ReturnStmtContext) => Result;
  /**
   * Visit a parse tree produced by `GoParser.expr`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitExpr?: (ctx: ExprContext) => Result;
  /**
   * Visit a parse tree produced by `GoParser.exprList`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitExprList?: (ctx: ExprListContext) => Result;
  /**
   * Visit a parse tree produced by `GoParser.primaryExpr`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitPrimaryExpr?: (ctx: PrimaryExprContext) => Result;
  /**
   * Visit a parse tree produced by `GoParser.selector`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitSelector?: (ctx: SelectorContext) => Result;
  /**
   * Visit a parse tree produced by `GoParser.args`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitArgs?: (ctx: ArgsContext) => Result;
  /**
   * Visit a parse tree produced by `GoParser.arg`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitArg?: (ctx: ArgContext) => Result;
  /**
   * Visit a parse tree produced by `GoParser.block`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitBlock?: (ctx: BlockContext) => Result;
  /**
   * Visit a parse tree produced by `GoParser.unaryOp`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitUnaryOp?: (ctx: UnaryOpContext) => Result;
  /**
   * Visit a parse tree produced by `GoParser.logicalOp`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitLogicalOp?: (ctx: LogicalOpContext) => Result;
  /**
   * Visit a parse tree produced by `GoParser.relOp`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitRelOp?: (ctx: RelOpContext) => Result;
  /**
   * Visit a parse tree produced by `GoParser.numericOp`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitNumericOp?: (ctx: NumericOpContext) => Result;
  /**
   * Visit a parse tree produced by `GoParser.shortVarDecl`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitShortVarDecl?: (ctx: ShortVarDeclContext) => Result;
  /**
   * Visit a parse tree produced by `GoParser.decl`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitDecl?: (ctx: DeclContext) => Result;
  /**
   * Visit a parse tree produced by `GoParser.typeDecl`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitTypeDecl?: (ctx: TypeDeclContext) => Result;
  /**
   * Visit a parse tree produced by `GoParser.varDecl`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitVarDecl?: (ctx: VarDeclContext) => Result;
  /**
   * Visit a parse tree produced by `GoParser.funcDecl`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitFuncDecl?: (ctx: FuncDeclContext) => Result;
  /**
   * Visit a parse tree produced by `GoParser.signature`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitSignature?: (ctx: SignatureContext) => Result;
  /**
   * Visit a parse tree produced by `GoParser.funcBody`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitFuncBody?: (ctx: FuncBodyContext) => Result;
  /**
   * Visit a parse tree produced by `GoParser.funcResult`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitFuncResult?: (ctx: FuncResultContext) => Result;
  /**
   * Visit a parse tree produced by `GoParser.litFunc`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitLitFunc?: (ctx: LitFuncContext) => Result;
  /**
   * Visit a parse tree produced by `GoParser.params`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitParams?: (ctx: ParamsContext) => Result;
  /**
   * Visit a parse tree produced by `GoParser.param`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitParam?: (ctx: ParamContext) => Result;
  /**
   * Visit a parse tree produced by `GoParser.type`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitType?: (ctx: TypeContext) => Result;
  /**
   * Visit a parse tree produced by `GoParser.typeName`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitTypeName?: (ctx: TypeNameContext) => Result;
  /**
   * Visit a parse tree produced by `GoParser.typeLit`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitTypeLit?: (ctx: TypeLitContext) => Result;
  /**
   * Visit a parse tree produced by `GoParser.channelType`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitChannelType?: (ctx: ChannelTypeContext) => Result;
  /**
   * Visit a parse tree produced by `GoParser.elementType`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitElementType?: (ctx: ElementTypeContext) => Result;
  /**
   * Visit a parse tree produced by `GoParser.structType`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitStructType?: (ctx: StructTypeContext) => Result;
  /**
   * Visit a parse tree produced by `GoParser.fieldDecl`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitFieldDecl?: (ctx: FieldDeclContext) => Result;
  /**
   * Visit a parse tree produced by `GoParser.name`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitName?: (ctx: NameContext) => Result;
  /**
   * Visit a parse tree produced by `GoParser.nameList`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitNameList?: (ctx: NameListContext) => Result;
  /**
   * Visit a parse tree produced by `GoParser.lit`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitLit?: (ctx: LitContext) => Result;
  /**
   * Visit a parse tree produced by `GoParser.litNil`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitLitNil?: (ctx: LitNilContext) => Result;
  /**
   * Visit a parse tree produced by `GoParser.litStr`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitLitStr?: (ctx: LitStrContext) => Result;
  /**
   * Visit a parse tree produced by `GoParser.litBool`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitLitBool?: (ctx: LitBoolContext) => Result;
  /**
   * Visit a parse tree produced by `GoParser.number`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitNumber?: (ctx: NumberContext) => Result;
  /**
   * Visit a parse tree produced by `GoParser.eos`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitEos?: (ctx: EosContext) => Result;
}
