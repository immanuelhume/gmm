// Generated from GoParser.g4 by ANTLR 4.12.0

import { ParseTreeListener } from "antlr4";

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
import { LpointerContext } from "./GoParser";
import { LnameContext } from "./GoParser";
import { LnameListContext } from "./GoParser";
import { FieldContext } from "./GoParser";
import { ForStmtContext } from "./GoParser";
import { ConditionContext } from "./GoParser";
import { ForClauseContext } from "./GoParser";
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
import { MulOpContext } from "./GoParser";
import { AddOpContext } from "./GoParser";
import { ShortVarDeclContext } from "./GoParser";
import { TopLevelDeclContext } from "./GoParser";
import { MethodDeclContext } from "./GoParser";
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
import { PointerTypeContext } from "./GoParser";
import { ChannelTypeContext } from "./GoParser";
import { FuncTypeContext } from "./GoParser";
import { StructTypeContext } from "./GoParser";
import { FieldDeclContext } from "./GoParser";
import { NameContext } from "./GoParser";
import { NameListContext } from "./GoParser";
import { LitContext } from "./GoParser";
import { LitNilContext } from "./GoParser";
import { LitStrContext } from "./GoParser";
import { LitBoolContext } from "./GoParser";
import { LitStructContext } from "./GoParser";
import { KeyedElemsContext } from "./GoParser";
import { KeyedElemContext } from "./GoParser";
import { NumberContext } from "./GoParser";
import { EosContext } from "./GoParser";

/**
 * This interface defines a complete listener for a parse tree produced by
 * `GoParser`.
 */
export default class GoParserListener extends ParseTreeListener {
  /**
   * Enter a parse tree produced by `GoParser.prog`.
   * @param ctx the parse tree
   */
  enterProg?: (ctx: ProgContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.prog`.
   * @param ctx the parse tree
   */
  exitProg?: (ctx: ProgContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.stmt`.
   * @param ctx the parse tree
   */
  enterStmt?: (ctx: StmtContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.stmt`.
   * @param ctx the parse tree
   */
  exitStmt?: (ctx: StmtContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.simpleStmt`.
   * @param ctx the parse tree
   */
  enterSimpleStmt?: (ctx: SimpleStmtContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.simpleStmt`.
   * @param ctx the parse tree
   */
  exitSimpleStmt?: (ctx: SimpleStmtContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.ifStmt`.
   * @param ctx the parse tree
   */
  enterIfStmt?: (ctx: IfStmtContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.ifStmt`.
   * @param ctx the parse tree
   */
  exitIfStmt?: (ctx: IfStmtContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.alt`.
   * @param ctx the parse tree
   */
  enterAlt?: (ctx: AltContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.alt`.
   * @param ctx the parse tree
   */
  exitAlt?: (ctx: AltContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.sendStmt`.
   * @param ctx the parse tree
   */
  enterSendStmt?: (ctx: SendStmtContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.sendStmt`.
   * @param ctx the parse tree
   */
  exitSendStmt?: (ctx: SendStmtContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.breakStmt`.
   * @param ctx the parse tree
   */
  enterBreakStmt?: (ctx: BreakStmtContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.breakStmt`.
   * @param ctx the parse tree
   */
  exitBreakStmt?: (ctx: BreakStmtContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.continueStmt`.
   * @param ctx the parse tree
   */
  enterContinueStmt?: (ctx: ContinueStmtContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.continueStmt`.
   * @param ctx the parse tree
   */
  exitContinueStmt?: (ctx: ContinueStmtContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.goStmt`.
   * @param ctx the parse tree
   */
  enterGoStmt?: (ctx: GoStmtContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.goStmt`.
   * @param ctx the parse tree
   */
  exitGoStmt?: (ctx: GoStmtContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.assignment`.
   * @param ctx the parse tree
   */
  enterAssignment?: (ctx: AssignmentContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.assignment`.
   * @param ctx the parse tree
   */
  exitAssignment?: (ctx: AssignmentContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.lvalueList`.
   * @param ctx the parse tree
   */
  enterLvalueList?: (ctx: LvalueListContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.lvalueList`.
   * @param ctx the parse tree
   */
  exitLvalueList?: (ctx: LvalueListContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.lvalue`.
   * @param ctx the parse tree
   */
  enterLvalue?: (ctx: LvalueContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.lvalue`.
   * @param ctx the parse tree
   */
  exitLvalue?: (ctx: LvalueContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.lpointer`.
   * @param ctx the parse tree
   */
  enterLpointer?: (ctx: LpointerContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.lpointer`.
   * @param ctx the parse tree
   */
  exitLpointer?: (ctx: LpointerContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.lname`.
   * @param ctx the parse tree
   */
  enterLname?: (ctx: LnameContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.lname`.
   * @param ctx the parse tree
   */
  exitLname?: (ctx: LnameContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.lnameList`.
   * @param ctx the parse tree
   */
  enterLnameList?: (ctx: LnameListContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.lnameList`.
   * @param ctx the parse tree
   */
  exitLnameList?: (ctx: LnameListContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.field`.
   * @param ctx the parse tree
   */
  enterField?: (ctx: FieldContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.field`.
   * @param ctx the parse tree
   */
  exitField?: (ctx: FieldContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.forStmt`.
   * @param ctx the parse tree
   */
  enterForStmt?: (ctx: ForStmtContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.forStmt`.
   * @param ctx the parse tree
   */
  exitForStmt?: (ctx: ForStmtContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.condition`.
   * @param ctx the parse tree
   */
  enterCondition?: (ctx: ConditionContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.condition`.
   * @param ctx the parse tree
   */
  exitCondition?: (ctx: ConditionContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.forClause`.
   * @param ctx the parse tree
   */
  enterForClause?: (ctx: ForClauseContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.forClause`.
   * @param ctx the parse tree
   */
  exitForClause?: (ctx: ForClauseContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.exprStmt`.
   * @param ctx the parse tree
   */
  enterExprStmt?: (ctx: ExprStmtContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.exprStmt`.
   * @param ctx the parse tree
   */
  exitExprStmt?: (ctx: ExprStmtContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.returnStmt`.
   * @param ctx the parse tree
   */
  enterReturnStmt?: (ctx: ReturnStmtContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.returnStmt`.
   * @param ctx the parse tree
   */
  exitReturnStmt?: (ctx: ReturnStmtContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.expr`.
   * @param ctx the parse tree
   */
  enterExpr?: (ctx: ExprContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.expr`.
   * @param ctx the parse tree
   */
  exitExpr?: (ctx: ExprContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.exprList`.
   * @param ctx the parse tree
   */
  enterExprList?: (ctx: ExprListContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.exprList`.
   * @param ctx the parse tree
   */
  exitExprList?: (ctx: ExprListContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.primaryExpr`.
   * @param ctx the parse tree
   */
  enterPrimaryExpr?: (ctx: PrimaryExprContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.primaryExpr`.
   * @param ctx the parse tree
   */
  exitPrimaryExpr?: (ctx: PrimaryExprContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.selector`.
   * @param ctx the parse tree
   */
  enterSelector?: (ctx: SelectorContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.selector`.
   * @param ctx the parse tree
   */
  exitSelector?: (ctx: SelectorContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.args`.
   * @param ctx the parse tree
   */
  enterArgs?: (ctx: ArgsContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.args`.
   * @param ctx the parse tree
   */
  exitArgs?: (ctx: ArgsContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.arg`.
   * @param ctx the parse tree
   */
  enterArg?: (ctx: ArgContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.arg`.
   * @param ctx the parse tree
   */
  exitArg?: (ctx: ArgContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.block`.
   * @param ctx the parse tree
   */
  enterBlock?: (ctx: BlockContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.block`.
   * @param ctx the parse tree
   */
  exitBlock?: (ctx: BlockContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.unaryOp`.
   * @param ctx the parse tree
   */
  enterUnaryOp?: (ctx: UnaryOpContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.unaryOp`.
   * @param ctx the parse tree
   */
  exitUnaryOp?: (ctx: UnaryOpContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.logicalOp`.
   * @param ctx the parse tree
   */
  enterLogicalOp?: (ctx: LogicalOpContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.logicalOp`.
   * @param ctx the parse tree
   */
  exitLogicalOp?: (ctx: LogicalOpContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.relOp`.
   * @param ctx the parse tree
   */
  enterRelOp?: (ctx: RelOpContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.relOp`.
   * @param ctx the parse tree
   */
  exitRelOp?: (ctx: RelOpContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.mulOp`.
   * @param ctx the parse tree
   */
  enterMulOp?: (ctx: MulOpContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.mulOp`.
   * @param ctx the parse tree
   */
  exitMulOp?: (ctx: MulOpContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.addOp`.
   * @param ctx the parse tree
   */
  enterAddOp?: (ctx: AddOpContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.addOp`.
   * @param ctx the parse tree
   */
  exitAddOp?: (ctx: AddOpContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.shortVarDecl`.
   * @param ctx the parse tree
   */
  enterShortVarDecl?: (ctx: ShortVarDeclContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.shortVarDecl`.
   * @param ctx the parse tree
   */
  exitShortVarDecl?: (ctx: ShortVarDeclContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.topLevelDecl`.
   * @param ctx the parse tree
   */
  enterTopLevelDecl?: (ctx: TopLevelDeclContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.topLevelDecl`.
   * @param ctx the parse tree
   */
  exitTopLevelDecl?: (ctx: TopLevelDeclContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.methodDecl`.
   * @param ctx the parse tree
   */
  enterMethodDecl?: (ctx: MethodDeclContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.methodDecl`.
   * @param ctx the parse tree
   */
  exitMethodDecl?: (ctx: MethodDeclContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.decl`.
   * @param ctx the parse tree
   */
  enterDecl?: (ctx: DeclContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.decl`.
   * @param ctx the parse tree
   */
  exitDecl?: (ctx: DeclContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.typeDecl`.
   * @param ctx the parse tree
   */
  enterTypeDecl?: (ctx: TypeDeclContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.typeDecl`.
   * @param ctx the parse tree
   */
  exitTypeDecl?: (ctx: TypeDeclContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.varDecl`.
   * @param ctx the parse tree
   */
  enterVarDecl?: (ctx: VarDeclContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.varDecl`.
   * @param ctx the parse tree
   */
  exitVarDecl?: (ctx: VarDeclContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.funcDecl`.
   * @param ctx the parse tree
   */
  enterFuncDecl?: (ctx: FuncDeclContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.funcDecl`.
   * @param ctx the parse tree
   */
  exitFuncDecl?: (ctx: FuncDeclContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.signature`.
   * @param ctx the parse tree
   */
  enterSignature?: (ctx: SignatureContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.signature`.
   * @param ctx the parse tree
   */
  exitSignature?: (ctx: SignatureContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.funcBody`.
   * @param ctx the parse tree
   */
  enterFuncBody?: (ctx: FuncBodyContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.funcBody`.
   * @param ctx the parse tree
   */
  exitFuncBody?: (ctx: FuncBodyContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.funcResult`.
   * @param ctx the parse tree
   */
  enterFuncResult?: (ctx: FuncResultContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.funcResult`.
   * @param ctx the parse tree
   */
  exitFuncResult?: (ctx: FuncResultContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.litFunc`.
   * @param ctx the parse tree
   */
  enterLitFunc?: (ctx: LitFuncContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.litFunc`.
   * @param ctx the parse tree
   */
  exitLitFunc?: (ctx: LitFuncContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.params`.
   * @param ctx the parse tree
   */
  enterParams?: (ctx: ParamsContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.params`.
   * @param ctx the parse tree
   */
  exitParams?: (ctx: ParamsContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.param`.
   * @param ctx the parse tree
   */
  enterParam?: (ctx: ParamContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.param`.
   * @param ctx the parse tree
   */
  exitParam?: (ctx: ParamContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.type`.
   * @param ctx the parse tree
   */
  enterType?: (ctx: TypeContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.type`.
   * @param ctx the parse tree
   */
  exitType?: (ctx: TypeContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.typeName`.
   * @param ctx the parse tree
   */
  enterTypeName?: (ctx: TypeNameContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.typeName`.
   * @param ctx the parse tree
   */
  exitTypeName?: (ctx: TypeNameContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.typeLit`.
   * @param ctx the parse tree
   */
  enterTypeLit?: (ctx: TypeLitContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.typeLit`.
   * @param ctx the parse tree
   */
  exitTypeLit?: (ctx: TypeLitContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.pointerType`.
   * @param ctx the parse tree
   */
  enterPointerType?: (ctx: PointerTypeContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.pointerType`.
   * @param ctx the parse tree
   */
  exitPointerType?: (ctx: PointerTypeContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.channelType`.
   * @param ctx the parse tree
   */
  enterChannelType?: (ctx: ChannelTypeContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.channelType`.
   * @param ctx the parse tree
   */
  exitChannelType?: (ctx: ChannelTypeContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.funcType`.
   * @param ctx the parse tree
   */
  enterFuncType?: (ctx: FuncTypeContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.funcType`.
   * @param ctx the parse tree
   */
  exitFuncType?: (ctx: FuncTypeContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.structType`.
   * @param ctx the parse tree
   */
  enterStructType?: (ctx: StructTypeContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.structType`.
   * @param ctx the parse tree
   */
  exitStructType?: (ctx: StructTypeContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.fieldDecl`.
   * @param ctx the parse tree
   */
  enterFieldDecl?: (ctx: FieldDeclContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.fieldDecl`.
   * @param ctx the parse tree
   */
  exitFieldDecl?: (ctx: FieldDeclContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.name`.
   * @param ctx the parse tree
   */
  enterName?: (ctx: NameContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.name`.
   * @param ctx the parse tree
   */
  exitName?: (ctx: NameContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.nameList`.
   * @param ctx the parse tree
   */
  enterNameList?: (ctx: NameListContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.nameList`.
   * @param ctx the parse tree
   */
  exitNameList?: (ctx: NameListContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.lit`.
   * @param ctx the parse tree
   */
  enterLit?: (ctx: LitContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.lit`.
   * @param ctx the parse tree
   */
  exitLit?: (ctx: LitContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.litNil`.
   * @param ctx the parse tree
   */
  enterLitNil?: (ctx: LitNilContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.litNil`.
   * @param ctx the parse tree
   */
  exitLitNil?: (ctx: LitNilContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.litStr`.
   * @param ctx the parse tree
   */
  enterLitStr?: (ctx: LitStrContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.litStr`.
   * @param ctx the parse tree
   */
  exitLitStr?: (ctx: LitStrContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.litBool`.
   * @param ctx the parse tree
   */
  enterLitBool?: (ctx: LitBoolContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.litBool`.
   * @param ctx the parse tree
   */
  exitLitBool?: (ctx: LitBoolContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.litStruct`.
   * @param ctx the parse tree
   */
  enterLitStruct?: (ctx: LitStructContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.litStruct`.
   * @param ctx the parse tree
   */
  exitLitStruct?: (ctx: LitStructContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.keyedElems`.
   * @param ctx the parse tree
   */
  enterKeyedElems?: (ctx: KeyedElemsContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.keyedElems`.
   * @param ctx the parse tree
   */
  exitKeyedElems?: (ctx: KeyedElemsContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.keyedElem`.
   * @param ctx the parse tree
   */
  enterKeyedElem?: (ctx: KeyedElemContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.keyedElem`.
   * @param ctx the parse tree
   */
  exitKeyedElem?: (ctx: KeyedElemContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.number`.
   * @param ctx the parse tree
   */
  enterNumber?: (ctx: NumberContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.number`.
   * @param ctx the parse tree
   */
  exitNumber?: (ctx: NumberContext) => void;
  /**
   * Enter a parse tree produced by `GoParser.eos`.
   * @param ctx the parse tree
   */
  enterEos?: (ctx: EosContext) => void;
  /**
   * Exit a parse tree produced by `GoParser.eos`.
   * @param ctx the parse tree
   */
  exitEos?: (ctx: EosContext) => void;
}
