// Generated from GoParser.g4 by ANTLR 4.12.0
// noinspection ES6UnusedImports,JSUnusedGlobalSymbols,JSUnusedLocalSymbols

import {
  ATN,
  ATNDeserializer,
  DecisionState,
  DFA,
  FailedPredicateException,
  RecognitionException,
  NoViableAltException,
  BailErrorStrategy,
  Parser,
  ParserATNSimulator,
  RuleContext,
  ParserRuleContext,
  PredictionMode,
  PredictionContextCache,
  TerminalNode,
  RuleNode,
  Token,
  TokenStream,
  Interval,
  IntervalSet,
} from "antlr4";
import GoParserListener from "./GoParserListener.js";
import GoParserVisitor from "./GoParserVisitor.js";

// for running tests with parameters, TODO: discuss strategy for typed parameters in CI
// eslint-disable-next-line no-unused-vars
type int = number;

export default class GoParser extends Parser {
  public static readonly INT = 1;
  public static readonly FLOAT = 2;
  public static readonly LIT_STR = 3;
  public static readonly TRUE = 4;
  public static readonly FALSE = 5;
  public static readonly VAR = 6;
  public static readonly RETURN = 7;
  public static readonly FUNC = 8;
  public static readonly TYPE = 9;
  public static readonly STRUCT = 10;
  public static readonly FOR = 11;
  public static readonly CHAN = 12;
  public static readonly NIL = 13;
  public static readonly GO = 14;
  public static readonly BREAK = 15;
  public static readonly CONTINUE = 16;
  public static readonly IF = 17;
  public static readonly ELSE = 18;
  public static readonly RANGE = 19;
  public static readonly PERIOD = 20;
  public static readonly COLON = 21;
  public static readonly L_BRACE = 22;
  public static readonly R_BRACE = 23;
  public static readonly L_PAREN = 24;
  public static readonly R_PAREN = 25;
  public static readonly COMMA = 26;
  public static readonly SEMI = 27;
  public static readonly ASSIGN = 28;
  public static readonly WALRUS = 29;
  public static readonly MINUS = 30;
  public static readonly PLUS = 31;
  public static readonly DIV = 32;
  public static readonly RCV = 33;
  public static readonly LOGICAL_OR = 34;
  public static readonly LOGICAL_AND = 35;
  public static readonly EQ = 36;
  public static readonly NEQ = 37;
  public static readonly LESS = 38;
  public static readonly LEQ = 39;
  public static readonly GREATER = 40;
  public static readonly GEQ = 41;
  public static readonly STAR = 42;
  public static readonly WORD = 43;
  public static readonly WS = 44;
  public static readonly NLSEMI_WS = 45;
  public static readonly EOS = 46;
  public static readonly OTHER = 47;
  public static readonly EOF = Token.EOF;
  public static readonly RULE_prog = 0;
  public static readonly RULE_stmt = 1;
  public static readonly RULE_simpleStmt = 2;
  public static readonly RULE_ifStmt = 3;
  public static readonly RULE_alt = 4;
  public static readonly RULE_sendStmt = 5;
  public static readonly RULE_breakStmt = 6;
  public static readonly RULE_continueStmt = 7;
  public static readonly RULE_goStmt = 8;
  public static readonly RULE_assignment = 9;
  public static readonly RULE_lvalueList = 10;
  public static readonly RULE_lvalue = 11;
  public static readonly RULE_lname = 12;
  public static readonly RULE_lnameList = 13;
  public static readonly RULE_field = 14;
  public static readonly RULE_forStmt = 15;
  public static readonly RULE_condition = 16;
  public static readonly RULE_forClause = 17;
  public static readonly RULE_rangeClause = 18;
  public static readonly RULE_exprStmt = 19;
  public static readonly RULE_returnStmt = 20;
  public static readonly RULE_expr = 21;
  public static readonly RULE_exprList = 22;
  public static readonly RULE_primaryExpr = 23;
  public static readonly RULE_selector = 24;
  public static readonly RULE_args = 25;
  public static readonly RULE_arg = 26;
  public static readonly RULE_block = 27;
  public static readonly RULE_unaryOp = 28;
  public static readonly RULE_logicalOp = 29;
  public static readonly RULE_relOp = 30;
  public static readonly RULE_mulOp = 31;
  public static readonly RULE_addOp = 32;
  public static readonly RULE_shortVarDecl = 33;
  public static readonly RULE_topLevelDecl = 34;
  public static readonly RULE_methodDecl = 35;
  public static readonly RULE_decl = 36;
  public static readonly RULE_typeDecl = 37;
  public static readonly RULE_varDecl = 38;
  public static readonly RULE_funcDecl = 39;
  public static readonly RULE_signature = 40;
  public static readonly RULE_funcBody = 41;
  public static readonly RULE_funcResult = 42;
  public static readonly RULE_litFunc = 43;
  public static readonly RULE_params = 44;
  public static readonly RULE_param = 45;
  public static readonly RULE_type = 46;
  public static readonly RULE_typeName = 47;
  public static readonly RULE_typeLit = 48;
  public static readonly RULE_channelType = 49;
  public static readonly RULE_elementType = 50;
  public static readonly RULE_structType = 51;
  public static readonly RULE_fieldDecl = 52;
  public static readonly RULE_name = 53;
  public static readonly RULE_nameList = 54;
  public static readonly RULE_lit = 55;
  public static readonly RULE_litNil = 56;
  public static readonly RULE_litStr = 57;
  public static readonly RULE_litBool = 58;
  public static readonly RULE_litStruct = 59;
  public static readonly RULE_keyedElems = 60;
  public static readonly RULE_keyedElem = 61;
  public static readonly RULE_number = 62;
  public static readonly RULE_eos = 63;
  public static readonly literalNames: (string | null)[] = [
    null,
    null,
    null,
    null,
    "'true'",
    "'false'",
    "'var'",
    "'return'",
    "'func'",
    "'type'",
    "'struct'",
    "'for'",
    "'chan'",
    "'nil'",
    "'go'",
    "'break'",
    "'continue'",
    "'if'",
    "'else'",
    "'range'",
    "'.'",
    "':'",
    "'{'",
    "'}'",
    "'('",
    "')'",
    "','",
    "';'",
    "'='",
    "':='",
    "'-'",
    "'+'",
    "'/'",
    "'<-'",
    "'||'",
    "'&&'",
    "'=='",
    "'!='",
    "'<'",
    "'<='",
    "'>'",
    "'>='",
    "'*'",
  ];
  public static readonly symbolicNames: (string | null)[] = [
    null,
    "INT",
    "FLOAT",
    "LIT_STR",
    "TRUE",
    "FALSE",
    "VAR",
    "RETURN",
    "FUNC",
    "TYPE",
    "STRUCT",
    "FOR",
    "CHAN",
    "NIL",
    "GO",
    "BREAK",
    "CONTINUE",
    "IF",
    "ELSE",
    "RANGE",
    "PERIOD",
    "COLON",
    "L_BRACE",
    "R_BRACE",
    "L_PAREN",
    "R_PAREN",
    "COMMA",
    "SEMI",
    "ASSIGN",
    "WALRUS",
    "MINUS",
    "PLUS",
    "DIV",
    "RCV",
    "LOGICAL_OR",
    "LOGICAL_AND",
    "EQ",
    "NEQ",
    "LESS",
    "LEQ",
    "GREATER",
    "GEQ",
    "STAR",
    "WORD",
    "WS",
    "NLSEMI_WS",
    "EOS",
    "OTHER",
  ];
  // tslint:disable:no-trailing-whitespace
  public static readonly ruleNames: string[] = [
    "prog",
    "stmt",
    "simpleStmt",
    "ifStmt",
    "alt",
    "sendStmt",
    "breakStmt",
    "continueStmt",
    "goStmt",
    "assignment",
    "lvalueList",
    "lvalue",
    "lname",
    "lnameList",
    "field",
    "forStmt",
    "condition",
    "forClause",
    "rangeClause",
    "exprStmt",
    "returnStmt",
    "expr",
    "exprList",
    "primaryExpr",
    "selector",
    "args",
    "arg",
    "block",
    "unaryOp",
    "logicalOp",
    "relOp",
    "mulOp",
    "addOp",
    "shortVarDecl",
    "topLevelDecl",
    "methodDecl",
    "decl",
    "typeDecl",
    "varDecl",
    "funcDecl",
    "signature",
    "funcBody",
    "funcResult",
    "litFunc",
    "params",
    "param",
    "type",
    "typeName",
    "typeLit",
    "channelType",
    "elementType",
    "structType",
    "fieldDecl",
    "name",
    "nameList",
    "lit",
    "litNil",
    "litStr",
    "litBool",
    "litStruct",
    "keyedElems",
    "keyedElem",
    "number",
    "eos",
  ];
  public get grammarFileName(): string {
    return "GoParser.g4";
  }
  public get literalNames(): (string | null)[] {
    return GoParser.literalNames;
  }
  public get symbolicNames(): (string | null)[] {
    return GoParser.symbolicNames;
  }
  public get ruleNames(): string[] {
    return GoParser.ruleNames;
  }
  public get serializedATN(): number[] {
    return GoParser._serializedATN;
  }

  protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException {
    return new FailedPredicateException(this, predicate, message);
  }

  constructor(input: TokenStream) {
    super(input);
    this._interp = new ParserATNSimulator(this, GoParser._ATN, GoParser.DecisionsToDFA, new PredictionContextCache());
  }
  // @RuleVersion(0)
  public prog(): ProgContext {
    let localctx: ProgContext = new ProgContext(this, this._ctx, this.state);
    this.enterRule(localctx, 0, GoParser.RULE_prog);
    let _la: number;
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 133;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        while ((_la & ~0x1f) === 0 && ((1 << _la) & 832) !== 0) {
          {
            {
              this.state = 128;
              this.topLevelDecl();
              this.state = 129;
              this.eos();
            }
          }
          this.state = 135;
          this._errHandler.sync(this);
          _la = this._input.LA(1);
        }
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public stmt(): StmtContext {
    let localctx: StmtContext = new StmtContext(this, this._ctx, this.state);
    this.enterRule(localctx, 2, GoParser.RULE_stmt);
    try {
      this.state = 146;
      this._errHandler.sync(this);
      switch (this._interp.adaptivePredict(this._input, 1, this._ctx)) {
        case 1:
          this.enterOuterAlt(localctx, 1);
          {
            this.state = 136;
            this.decl();
          }
          break;
        case 2:
          this.enterOuterAlt(localctx, 2);
          {
            this.state = 137;
            this.returnStmt();
          }
          break;
        case 3:
          this.enterOuterAlt(localctx, 3);
          {
            this.state = 138;
            this.forStmt();
          }
          break;
        case 4:
          this.enterOuterAlt(localctx, 4);
          {
            this.state = 139;
            this.breakStmt();
          }
          break;
        case 5:
          this.enterOuterAlt(localctx, 5);
          {
            this.state = 140;
            this.continueStmt();
          }
          break;
        case 6:
          this.enterOuterAlt(localctx, 6);
          {
            this.state = 141;
            this.ifStmt();
          }
          break;
        case 7:
          this.enterOuterAlt(localctx, 7);
          {
            this.state = 142;
            this.goStmt();
          }
          break;
        case 8:
          this.enterOuterAlt(localctx, 8);
          {
            this.state = 143;
            this.sendStmt();
          }
          break;
        case 9:
          this.enterOuterAlt(localctx, 9);
          {
            this.state = 144;
            this.block();
          }
          break;
        case 10:
          this.enterOuterAlt(localctx, 10);
          {
            this.state = 145;
            this.simpleStmt();
          }
          break;
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public simpleStmt(): SimpleStmtContext {
    let localctx: SimpleStmtContext = new SimpleStmtContext(this, this._ctx, this.state);
    this.enterRule(localctx, 4, GoParser.RULE_simpleStmt);
    try {
      this.state = 151;
      this._errHandler.sync(this);
      switch (this._interp.adaptivePredict(this._input, 2, this._ctx)) {
        case 1:
          this.enterOuterAlt(localctx, 1);
          {
            this.state = 148;
            this.assignment();
          }
          break;
        case 2:
          this.enterOuterAlt(localctx, 2);
          {
            this.state = 149;
            this.shortVarDecl();
          }
          break;
        case 3:
          this.enterOuterAlt(localctx, 3);
          {
            this.state = 150;
            this.exprStmt();
          }
          break;
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public ifStmt(): IfStmtContext {
    let localctx: IfStmtContext = new IfStmtContext(this, this._ctx, this.state);
    this.enterRule(localctx, 6, GoParser.RULE_ifStmt);
    let _la: number;
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 153;
        this.match(GoParser.IF);
        this.state = 154;
        localctx._cond = this.expr(0);
        this.state = 155;
        localctx._cons = this.block();
        this.state = 158;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if (_la === 18) {
          {
            this.state = 156;
            this.match(GoParser.ELSE);
            this.state = 157;
            this.alt();
          }
        }
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public alt(): AltContext {
    let localctx: AltContext = new AltContext(this, this._ctx, this.state);
    this.enterRule(localctx, 8, GoParser.RULE_alt);
    try {
      this.state = 162;
      this._errHandler.sync(this);
      switch (this._input.LA(1)) {
        case 17:
          this.enterOuterAlt(localctx, 1);
          {
            this.state = 160;
            this.ifStmt();
          }
          break;
        case 22:
          this.enterOuterAlt(localctx, 2);
          {
            this.state = 161;
            this.block();
          }
          break;
        default:
          throw new NoViableAltException(this);
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public sendStmt(): SendStmtContext {
    let localctx: SendStmtContext = new SendStmtContext(this, this._ctx, this.state);
    this.enterRule(localctx, 10, GoParser.RULE_sendStmt);
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 164;
        localctx._channel = this.expr(0);
        this.state = 165;
        this.match(GoParser.RCV);
        this.state = 166;
        localctx._rhs = this.expr(0);
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public breakStmt(): BreakStmtContext {
    let localctx: BreakStmtContext = new BreakStmtContext(this, this._ctx, this.state);
    this.enterRule(localctx, 12, GoParser.RULE_breakStmt);
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 168;
        this.match(GoParser.BREAK);
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public continueStmt(): ContinueStmtContext {
    let localctx: ContinueStmtContext = new ContinueStmtContext(this, this._ctx, this.state);
    this.enterRule(localctx, 14, GoParser.RULE_continueStmt);
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 170;
        this.match(GoParser.CONTINUE);
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public goStmt(): GoStmtContext {
    let localctx: GoStmtContext = new GoStmtContext(this, this._ctx, this.state);
    this.enterRule(localctx, 16, GoParser.RULE_goStmt);
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 172;
        this.match(GoParser.GO);
        this.state = 173;
        this.primaryExpr(0);
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public assignment(): AssignmentContext {
    let localctx: AssignmentContext = new AssignmentContext(this, this._ctx, this.state);
    this.enterRule(localctx, 18, GoParser.RULE_assignment);
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 175;
        localctx._lhs = this.lvalueList();
        this.state = 176;
        this.match(GoParser.ASSIGN);
        this.state = 177;
        localctx._rhs = this.exprList();
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public lvalueList(): LvalueListContext {
    let localctx: LvalueListContext = new LvalueListContext(this, this._ctx, this.state);
    this.enterRule(localctx, 20, GoParser.RULE_lvalueList);
    let _la: number;
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 179;
        this.lvalue();
        this.state = 184;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        while (_la === 26) {
          {
            {
              this.state = 180;
              this.match(GoParser.COMMA);
              this.state = 181;
              this.lvalue();
            }
          }
          this.state = 186;
          this._errHandler.sync(this);
          _la = this._input.LA(1);
        }
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public lvalue(): LvalueContext {
    let localctx: LvalueContext = new LvalueContext(this, this._ctx, this.state);
    this.enterRule(localctx, 22, GoParser.RULE_lvalue);
    try {
      this.state = 189;
      this._errHandler.sync(this);
      switch (this._interp.adaptivePredict(this._input, 6, this._ctx)) {
        case 1:
          this.enterOuterAlt(localctx, 1);
          {
            this.state = 187;
            this.lname();
          }
          break;
        case 2:
          this.enterOuterAlt(localctx, 2);
          {
            this.state = 188;
            this.field();
          }
          break;
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public lname(): LnameContext {
    let localctx: LnameContext = new LnameContext(this, this._ctx, this.state);
    this.enterRule(localctx, 24, GoParser.RULE_lname);
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 191;
        this.match(GoParser.WORD);
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public lnameList(): LnameListContext {
    let localctx: LnameListContext = new LnameListContext(this, this._ctx, this.state);
    this.enterRule(localctx, 26, GoParser.RULE_lnameList);
    let _la: number;
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 193;
        this.lname();
        this.state = 198;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        while (_la === 26) {
          {
            {
              this.state = 194;
              this.match(GoParser.COMMA);
              this.state = 195;
              this.lname();
            }
          }
          this.state = 200;
          this._errHandler.sync(this);
          _la = this._input.LA(1);
        }
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public field(): FieldContext {
    let localctx: FieldContext = new FieldContext(this, this._ctx, this.state);
    this.enterRule(localctx, 28, GoParser.RULE_field);
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 201;
        localctx._base = this.primaryExpr(0);
        this.state = 202;
        this.match(GoParser.PERIOD);
        this.state = 203;
        localctx._last = this.match(GoParser.WORD);
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public forStmt(): ForStmtContext {
    let localctx: ForStmtContext = new ForStmtContext(this, this._ctx, this.state);
    this.enterRule(localctx, 30, GoParser.RULE_forStmt);
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 205;
        this.match(GoParser.FOR);
        this.state = 209;
        this._errHandler.sync(this);
        switch (this._interp.adaptivePredict(this._input, 8, this._ctx)) {
          case 1:
            {
              this.state = 206;
              this.condition();
            }
            break;
          case 2:
            {
              this.state = 207;
              this.forClause();
            }
            break;
          case 3:
            {
              this.state = 208;
              this.rangeClause();
            }
            break;
        }
        this.state = 211;
        this.block();
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public condition(): ConditionContext {
    let localctx: ConditionContext = new ConditionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 32, GoParser.RULE_condition);
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 213;
        this.expr(0);
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public forClause(): ForClauseContext {
    let localctx: ForClauseContext = new ForClauseContext(this, this._ctx, this.state);
    this.enterRule(localctx, 34, GoParser.RULE_forClause);
    let _la: number;
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 216;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if (((_la & ~0x1f) === 0 && ((1 << _la) & 3221235006) !== 0) || _la === 33 || _la === 43) {
          {
            this.state = 215;
            localctx._init = this.simpleStmt();
          }
        }

        this.state = 218;
        this.match(GoParser.SEMI);
        this.state = 220;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if (((_la & ~0x1f) === 0 && ((1 << _la) & 3221235006) !== 0) || _la === 33 || _la === 43) {
          {
            this.state = 219;
            localctx._cond = this.condition();
          }
        }

        this.state = 222;
        this.match(GoParser.SEMI);
        this.state = 224;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if (((_la & ~0x1f) === 0 && ((1 << _la) & 3221235006) !== 0) || _la === 33 || _la === 43) {
          {
            this.state = 223;
            localctx._post = this.simpleStmt();
          }
        }
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public rangeClause(): RangeClauseContext {
    let localctx: RangeClauseContext = new RangeClauseContext(this, this._ctx, this.state);
    this.enterRule(localctx, 36, GoParser.RULE_rangeClause);
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 232;
        this._errHandler.sync(this);
        switch (this._interp.adaptivePredict(this._input, 12, this._ctx)) {
          case 1:
            {
              this.state = 226;
              this.lvalueList();
              this.state = 227;
              this.match(GoParser.ASSIGN);
            }
            break;
          case 2:
            {
              this.state = 229;
              this.lnameList();
              this.state = 230;
              this.match(GoParser.WALRUS);
            }
            break;
        }
        this.state = 234;
        this.match(GoParser.RANGE);
        this.state = 235;
        this.expr(0);
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public exprStmt(): ExprStmtContext {
    let localctx: ExprStmtContext = new ExprStmtContext(this, this._ctx, this.state);
    this.enterRule(localctx, 38, GoParser.RULE_exprStmt);
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 237;
        this.expr(0);
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public returnStmt(): ReturnStmtContext {
    let localctx: ReturnStmtContext = new ReturnStmtContext(this, this._ctx, this.state);
    this.enterRule(localctx, 40, GoParser.RULE_returnStmt);
    let _la: number;
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 239;
        this.match(GoParser.RETURN);
        this.state = 241;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if (((_la & ~0x1f) === 0 && ((1 << _la) & 3221235006) !== 0) || _la === 33 || _la === 43) {
          {
            this.state = 240;
            this.exprList();
          }
        }
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }

  public expr(): ExprContext;
  public expr(_p: number): ExprContext;
  // @RuleVersion(0)
  public expr(_p?: number): ExprContext {
    if (_p === undefined) {
      _p = 0;
    }

    let _parentctx: ParserRuleContext = this._ctx;
    let _parentState: number = this.state;
    let localctx: ExprContext = new ExprContext(this, this._ctx, _parentState);
    let _prevctx: ExprContext = localctx;
    let _startState: number = 42;
    this.enterRecursionRule(localctx, 42, GoParser.RULE_expr, _p);
    try {
      let _alt: number;
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 248;
        this._errHandler.sync(this);
        switch (this._input.LA(1)) {
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
          case 8:
          case 10:
          case 13:
          case 43:
            {
              this.state = 244;
              this.primaryExpr(0);
            }
            break;
          case 30:
          case 31:
          case 33:
            {
              this.state = 245;
              this.unaryOp();
              this.state = 246;
              this.expr(5);
            }
            break;
          default:
            throw new NoViableAltException(this);
        }
        this._ctx.stop = this._input.LT(-1);
        this.state = 268;
        this._errHandler.sync(this);
        _alt = this._interp.adaptivePredict(this._input, 16, this._ctx);
        while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
          if (_alt === 1) {
            if (this._parseListeners != null) {
              this.triggerExitRuleEvent();
            }
            _prevctx = localctx;
            {
              this.state = 266;
              this._errHandler.sync(this);
              switch (this._interp.adaptivePredict(this._input, 15, this._ctx)) {
                case 1:
                  {
                    localctx = new ExprContext(this, _parentctx, _parentState);
                    localctx._lhs = _prevctx;
                    this.pushNewRecursionContext(localctx, _startState, GoParser.RULE_expr);
                    this.state = 250;
                    if (!this.precpred(this._ctx, 4)) {
                      throw this.createFailedPredicateException("this.precpred(this._ctx, 4)");
                    }
                    this.state = 251;
                    this.mulOp();
                    this.state = 252;
                    localctx._rhs = this.expr(5);
                  }
                  break;
                case 2:
                  {
                    localctx = new ExprContext(this, _parentctx, _parentState);
                    localctx._lhs = _prevctx;
                    this.pushNewRecursionContext(localctx, _startState, GoParser.RULE_expr);
                    this.state = 254;
                    if (!this.precpred(this._ctx, 3)) {
                      throw this.createFailedPredicateException("this.precpred(this._ctx, 3)");
                    }
                    this.state = 255;
                    this.addOp();
                    this.state = 256;
                    localctx._rhs = this.expr(4);
                  }
                  break;
                case 3:
                  {
                    localctx = new ExprContext(this, _parentctx, _parentState);
                    localctx._lhs = _prevctx;
                    this.pushNewRecursionContext(localctx, _startState, GoParser.RULE_expr);
                    this.state = 258;
                    if (!this.precpred(this._ctx, 2)) {
                      throw this.createFailedPredicateException("this.precpred(this._ctx, 2)");
                    }
                    this.state = 259;
                    this.relOp();
                    this.state = 260;
                    localctx._rhs = this.expr(3);
                  }
                  break;
                case 4:
                  {
                    localctx = new ExprContext(this, _parentctx, _parentState);
                    localctx._lhs = _prevctx;
                    this.pushNewRecursionContext(localctx, _startState, GoParser.RULE_expr);
                    this.state = 262;
                    if (!this.precpred(this._ctx, 1)) {
                      throw this.createFailedPredicateException("this.precpred(this._ctx, 1)");
                    }
                    this.state = 263;
                    this.logicalOp();
                    this.state = 264;
                    localctx._rhs = this.expr(2);
                  }
                  break;
              }
            }
          }
          this.state = 270;
          this._errHandler.sync(this);
          _alt = this._interp.adaptivePredict(this._input, 16, this._ctx);
        }
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.unrollRecursionContexts(_parentctx);
    }
    return localctx;
  }
  // @RuleVersion(0)
  public exprList(): ExprListContext {
    let localctx: ExprListContext = new ExprListContext(this, this._ctx, this.state);
    this.enterRule(localctx, 44, GoParser.RULE_exprList);
    let _la: number;
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 271;
        this.expr(0);
        this.state = 276;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        while (_la === 26) {
          {
            {
              this.state = 272;
              this.match(GoParser.COMMA);
              this.state = 273;
              this.expr(0);
            }
          }
          this.state = 278;
          this._errHandler.sync(this);
          _la = this._input.LA(1);
        }
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }

  public primaryExpr(): PrimaryExprContext;
  public primaryExpr(_p: number): PrimaryExprContext;
  // @RuleVersion(0)
  public primaryExpr(_p?: number): PrimaryExprContext {
    if (_p === undefined) {
      _p = 0;
    }

    let _parentctx: ParserRuleContext = this._ctx;
    let _parentState: number = this.state;
    let localctx: PrimaryExprContext = new PrimaryExprContext(this, this._ctx, _parentState);
    let _prevctx: PrimaryExprContext = localctx;
    let _startState: number = 46;
    this.enterRecursionRule(localctx, 46, GoParser.RULE_primaryExpr, _p);
    try {
      let _alt: number;
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 282;
        this._errHandler.sync(this);
        switch (this._interp.adaptivePredict(this._input, 18, this._ctx)) {
          case 1:
            {
              this.state = 280;
              this.lit();
            }
            break;
          case 2:
            {
              this.state = 281;
              this.name();
            }
            break;
        }
        this._ctx.stop = this._input.LT(-1);
        this.state = 290;
        this._errHandler.sync(this);
        _alt = this._interp.adaptivePredict(this._input, 20, this._ctx);
        while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
          if (_alt === 1) {
            if (this._parseListeners != null) {
              this.triggerExitRuleEvent();
            }
            _prevctx = localctx;
            {
              this.state = 288;
              this._errHandler.sync(this);
              switch (this._interp.adaptivePredict(this._input, 19, this._ctx)) {
                case 1:
                  {
                    localctx = new PrimaryExprContext(this, _parentctx, _parentState);
                    localctx._fn = _prevctx;
                    this.pushNewRecursionContext(localctx, _startState, GoParser.RULE_primaryExpr);
                    this.state = 284;
                    if (!this.precpred(this._ctx, 2)) {
                      throw this.createFailedPredicateException("this.precpred(this._ctx, 2)");
                    }
                    this.state = 285;
                    this.args();
                  }
                  break;
                case 2:
                  {
                    localctx = new PrimaryExprContext(this, _parentctx, _parentState);
                    localctx._base = _prevctx;
                    this.pushNewRecursionContext(localctx, _startState, GoParser.RULE_primaryExpr);
                    this.state = 286;
                    if (!this.precpred(this._ctx, 1)) {
                      throw this.createFailedPredicateException("this.precpred(this._ctx, 1)");
                    }
                    this.state = 287;
                    this.selector();
                  }
                  break;
              }
            }
          }
          this.state = 292;
          this._errHandler.sync(this);
          _alt = this._interp.adaptivePredict(this._input, 20, this._ctx);
        }
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.unrollRecursionContexts(_parentctx);
    }
    return localctx;
  }
  // @RuleVersion(0)
  public selector(): SelectorContext {
    let localctx: SelectorContext = new SelectorContext(this, this._ctx, this.state);
    this.enterRule(localctx, 48, GoParser.RULE_selector);
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 293;
        this.match(GoParser.PERIOD);
        this.state = 294;
        this.name();
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public args(): ArgsContext {
    let localctx: ArgsContext = new ArgsContext(this, this._ctx, this.state);
    this.enterRule(localctx, 50, GoParser.RULE_args);
    let _la: number;
    try {
      let _alt: number;
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 296;
        this.match(GoParser.L_PAREN);
        this.state = 308;
        this._errHandler.sync(this);
        switch (this._interp.adaptivePredict(this._input, 23, this._ctx)) {
          case 1:
            {
              this.state = 297;
              this.arg();
              this.state = 302;
              this._errHandler.sync(this);
              _alt = this._interp.adaptivePredict(this._input, 21, this._ctx);
              while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
                if (_alt === 1) {
                  {
                    {
                      this.state = 298;
                      this.match(GoParser.COMMA);
                      this.state = 299;
                      this.arg();
                    }
                  }
                }
                this.state = 304;
                this._errHandler.sync(this);
                _alt = this._interp.adaptivePredict(this._input, 21, this._ctx);
              }
            }
            break;
          case 2:
            {
              this.state = 306;
              this._errHandler.sync(this);
              _la = this._input.LA(1);
              if (((_la & ~0x1f) === 0 && ((1 << _la) & 3221239102) !== 0) || _la === 33 || _la === 43) {
                {
                  this.state = 305;
                  this.arg();
                }
              }
            }
            break;
        }
        this.state = 311;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if (_la === 26) {
          {
            this.state = 310;
            this.match(GoParser.COMMA);
          }
        }

        this.state = 313;
        this.match(GoParser.R_PAREN);
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public arg(): ArgContext {
    let localctx: ArgContext = new ArgContext(this, this._ctx, this.state);
    this.enterRule(localctx, 52, GoParser.RULE_arg);
    try {
      this.state = 317;
      this._errHandler.sync(this);
      switch (this._interp.adaptivePredict(this._input, 25, this._ctx)) {
        case 1:
          this.enterOuterAlt(localctx, 1);
          {
            this.state = 315;
            this.expr(0);
          }
          break;
        case 2:
          this.enterOuterAlt(localctx, 2);
          {
            this.state = 316;
            this.type_();
          }
          break;
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public block(): BlockContext {
    let localctx: BlockContext = new BlockContext(this, this._ctx, this.state);
    this.enterRule(localctx, 54, GoParser.RULE_block);
    let _la: number;
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 319;
        this.match(GoParser.L_BRACE);
        this.state = 325;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        while (((_la & ~0x1f) === 0 && ((1 << _la) & 3225677822) !== 0) || _la === 33 || _la === 43) {
          {
            {
              this.state = 320;
              this.stmt();
              this.state = 321;
              this.eos();
            }
          }
          this.state = 327;
          this._errHandler.sync(this);
          _la = this._input.LA(1);
        }
        this.state = 328;
        this.match(GoParser.R_BRACE);
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public unaryOp(): UnaryOpContext {
    let localctx: UnaryOpContext = new UnaryOpContext(this, this._ctx, this.state);
    this.enterRule(localctx, 56, GoParser.RULE_unaryOp);
    let _la: number;
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 330;
        _la = this._input.LA(1);
        if (!(((_la - 30) & ~0x1f) === 0 && ((1 << (_la - 30)) & 11) !== 0)) {
          this._errHandler.recoverInline(this);
        } else {
          this._errHandler.reportMatch(this);
          this.consume();
        }
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public logicalOp(): LogicalOpContext {
    let localctx: LogicalOpContext = new LogicalOpContext(this, this._ctx, this.state);
    this.enterRule(localctx, 58, GoParser.RULE_logicalOp);
    let _la: number;
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 332;
        _la = this._input.LA(1);
        if (!(_la === 34 || _la === 35)) {
          this._errHandler.recoverInline(this);
        } else {
          this._errHandler.reportMatch(this);
          this.consume();
        }
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public relOp(): RelOpContext {
    let localctx: RelOpContext = new RelOpContext(this, this._ctx, this.state);
    this.enterRule(localctx, 60, GoParser.RULE_relOp);
    let _la: number;
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 334;
        _la = this._input.LA(1);
        if (!(((_la - 36) & ~0x1f) === 0 && ((1 << (_la - 36)) & 63) !== 0)) {
          this._errHandler.recoverInline(this);
        } else {
          this._errHandler.reportMatch(this);
          this.consume();
        }
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public mulOp(): MulOpContext {
    let localctx: MulOpContext = new MulOpContext(this, this._ctx, this.state);
    this.enterRule(localctx, 62, GoParser.RULE_mulOp);
    let _la: number;
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 336;
        _la = this._input.LA(1);
        if (!(_la === 32 || _la === 42)) {
          this._errHandler.recoverInline(this);
        } else {
          this._errHandler.reportMatch(this);
          this.consume();
        }
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public addOp(): AddOpContext {
    let localctx: AddOpContext = new AddOpContext(this, this._ctx, this.state);
    this.enterRule(localctx, 64, GoParser.RULE_addOp);
    let _la: number;
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 338;
        _la = this._input.LA(1);
        if (!(_la === 30 || _la === 31)) {
          this._errHandler.recoverInline(this);
        } else {
          this._errHandler.reportMatch(this);
          this.consume();
        }
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public shortVarDecl(): ShortVarDeclContext {
    let localctx: ShortVarDeclContext = new ShortVarDeclContext(this, this._ctx, this.state);
    this.enterRule(localctx, 66, GoParser.RULE_shortVarDecl);
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 340;
        localctx._lhs = this.lnameList();
        this.state = 341;
        this.match(GoParser.WALRUS);
        this.state = 342;
        localctx._rhs = this.exprList();
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public topLevelDecl(): TopLevelDeclContext {
    let localctx: TopLevelDeclContext = new TopLevelDeclContext(this, this._ctx, this.state);
    this.enterRule(localctx, 68, GoParser.RULE_topLevelDecl);
    try {
      this.state = 347;
      this._errHandler.sync(this);
      switch (this._interp.adaptivePredict(this._input, 27, this._ctx)) {
        case 1:
          this.enterOuterAlt(localctx, 1);
          {
            this.state = 344;
            this.decl();
          }
          break;
        case 2:
          this.enterOuterAlt(localctx, 2);
          {
            this.state = 345;
            this.funcDecl();
          }
          break;
        case 3:
          this.enterOuterAlt(localctx, 3);
          {
            this.state = 346;
            this.methodDecl();
          }
          break;
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public methodDecl(): MethodDeclContext {
    let localctx: MethodDeclContext = new MethodDeclContext(this, this._ctx, this.state);
    this.enterRule(localctx, 70, GoParser.RULE_methodDecl);
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 349;
        this.match(GoParser.FUNC);
        this.state = 350;
        this.match(GoParser.L_PAREN);
        this.state = 351;
        localctx._receiver = this.param();
        this.state = 352;
        this.match(GoParser.R_PAREN);
        this.state = 353;
        this.name();
        this.state = 354;
        this.signature();
        this.state = 355;
        this.funcBody();
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public decl(): DeclContext {
    let localctx: DeclContext = new DeclContext(this, this._ctx, this.state);
    this.enterRule(localctx, 72, GoParser.RULE_decl);
    try {
      this.state = 359;
      this._errHandler.sync(this);
      switch (this._input.LA(1)) {
        case 6:
          this.enterOuterAlt(localctx, 1);
          {
            this.state = 357;
            this.varDecl();
          }
          break;
        case 9:
          this.enterOuterAlt(localctx, 2);
          {
            this.state = 358;
            this.typeDecl();
          }
          break;
        default:
          throw new NoViableAltException(this);
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public typeDecl(): TypeDeclContext {
    let localctx: TypeDeclContext = new TypeDeclContext(this, this._ctx, this.state);
    this.enterRule(localctx, 74, GoParser.RULE_typeDecl);
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 361;
        this.match(GoParser.TYPE);
        this.state = 362;
        this.name();
        this.state = 363;
        this.type_();
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public varDecl(): VarDeclContext {
    let localctx: VarDeclContext = new VarDeclContext(this, this._ctx, this.state);
    this.enterRule(localctx, 76, GoParser.RULE_varDecl);
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 365;
        this.match(GoParser.VAR);
        this.state = 366;
        this.name();
        this.state = 367;
        this.type_();
        this.state = 368;
        this.match(GoParser.ASSIGN);
        this.state = 369;
        this.expr(0);
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public funcDecl(): FuncDeclContext {
    let localctx: FuncDeclContext = new FuncDeclContext(this, this._ctx, this.state);
    this.enterRule(localctx, 78, GoParser.RULE_funcDecl);
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 371;
        this.match(GoParser.FUNC);
        this.state = 372;
        this.name();
        this.state = 373;
        this.signature();
        this.state = 374;
        this.funcBody();
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public signature(): SignatureContext {
    let localctx: SignatureContext = new SignatureContext(this, this._ctx, this.state);
    this.enterRule(localctx, 80, GoParser.RULE_signature);
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 376;
        this.match(GoParser.L_PAREN);
        this.state = 377;
        this.params();
        this.state = 378;
        this.match(GoParser.R_PAREN);
        this.state = 379;
        this.funcResult();
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public funcBody(): FuncBodyContext {
    let localctx: FuncBodyContext = new FuncBodyContext(this, this._ctx, this.state);
    this.enterRule(localctx, 82, GoParser.RULE_funcBody);
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 381;
        this.block();
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public funcResult(): FuncResultContext {
    let localctx: FuncResultContext = new FuncResultContext(this, this._ctx, this.state);
    this.enterRule(localctx, 84, GoParser.RULE_funcResult);
    let _la: number;
    try {
      this.state = 402;
      this._errHandler.sync(this);
      switch (this._interp.adaptivePredict(this._input, 32, this._ctx)) {
        case 1:
          this.enterOuterAlt(localctx, 1);
          {
            this.state = 384;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
            if (_la === 10 || _la === 12 || _la === 43) {
              {
                this.state = 383;
                this.type_();
              }
            }
          }
          break;
        case 2:
          this.enterOuterAlt(localctx, 2);
          {
            this.state = 386;
            this.match(GoParser.L_PAREN);
            this.state = 388;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
            if (_la === 10 || _la === 12 || _la === 43) {
              {
                this.state = 387;
                this.type_();
              }
            }

            this.state = 390;
            this.match(GoParser.R_PAREN);
          }
          break;
        case 3:
          this.enterOuterAlt(localctx, 3);
          {
            this.state = 391;
            this.match(GoParser.L_PAREN);
            this.state = 392;
            this.type_();
            this.state = 397;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
            while (_la === 26) {
              {
                {
                  this.state = 393;
                  this.match(GoParser.COMMA);
                  this.state = 394;
                  this.type_();
                }
              }
              this.state = 399;
              this._errHandler.sync(this);
              _la = this._input.LA(1);
            }
            this.state = 400;
            this.match(GoParser.R_PAREN);
          }
          break;
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public litFunc(): LitFuncContext {
    let localctx: LitFuncContext = new LitFuncContext(this, this._ctx, this.state);
    this.enterRule(localctx, 86, GoParser.RULE_litFunc);
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 404;
        this.match(GoParser.FUNC);
        this.state = 405;
        this.signature();
        this.state = 406;
        this.funcBody();
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public params(): ParamsContext {
    let localctx: ParamsContext = new ParamsContext(this, this._ctx, this.state);
    this.enterRule(localctx, 88, GoParser.RULE_params);
    let _la: number;
    try {
      let _alt: number;
      this.state = 422;
      this._errHandler.sync(this);
      switch (this._interp.adaptivePredict(this._input, 36, this._ctx)) {
        case 1:
          this.enterOuterAlt(localctx, 1);
          {
            this.state = 408;
            this.param();
            this.state = 413;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input, 33, this._ctx);
            while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
              if (_alt === 1) {
                {
                  {
                    this.state = 409;
                    this.match(GoParser.COMMA);
                    this.state = 410;
                    this.param();
                  }
                }
              }
              this.state = 415;
              this._errHandler.sync(this);
              _alt = this._interp.adaptivePredict(this._input, 33, this._ctx);
            }
            this.state = 417;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
            if (_la === 26) {
              {
                this.state = 416;
                this.match(GoParser.COMMA);
              }
            }
          }
          break;
        case 2:
          this.enterOuterAlt(localctx, 2);
          {
            this.state = 420;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
            if (_la === 43) {
              {
                this.state = 419;
                this.param();
              }
            }
          }
          break;
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public param(): ParamContext {
    let localctx: ParamContext = new ParamContext(this, this._ctx, this.state);
    this.enterRule(localctx, 90, GoParser.RULE_param);
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 424;
        this.name();
        this.state = 425;
        this.typeName();
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public type_(): TypeContext {
    let localctx: TypeContext = new TypeContext(this, this._ctx, this.state);
    this.enterRule(localctx, 92, GoParser.RULE_type);
    try {
      this.state = 429;
      this._errHandler.sync(this);
      switch (this._input.LA(1)) {
        case 43:
          this.enterOuterAlt(localctx, 1);
          {
            this.state = 427;
            this.typeName();
          }
          break;
        case 10:
        case 12:
          this.enterOuterAlt(localctx, 2);
          {
            this.state = 428;
            this.typeLit();
          }
          break;
        default:
          throw new NoViableAltException(this);
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public typeName(): TypeNameContext {
    let localctx: TypeNameContext = new TypeNameContext(this, this._ctx, this.state);
    this.enterRule(localctx, 94, GoParser.RULE_typeName);
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 431;
        this.match(GoParser.WORD);
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public typeLit(): TypeLitContext {
    let localctx: TypeLitContext = new TypeLitContext(this, this._ctx, this.state);
    this.enterRule(localctx, 96, GoParser.RULE_typeLit);
    try {
      this.state = 435;
      this._errHandler.sync(this);
      switch (this._input.LA(1)) {
        case 10:
          this.enterOuterAlt(localctx, 1);
          {
            this.state = 433;
            this.structType();
          }
          break;
        case 12:
          this.enterOuterAlt(localctx, 2);
          {
            this.state = 434;
            this.channelType();
          }
          break;
        default:
          throw new NoViableAltException(this);
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public channelType(): ChannelTypeContext {
    let localctx: ChannelTypeContext = new ChannelTypeContext(this, this._ctx, this.state);
    this.enterRule(localctx, 98, GoParser.RULE_channelType);
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 437;
        this.match(GoParser.CHAN);
        this.state = 438;
        this.elementType();
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public elementType(): ElementTypeContext {
    let localctx: ElementTypeContext = new ElementTypeContext(this, this._ctx, this.state);
    this.enterRule(localctx, 100, GoParser.RULE_elementType);
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 440;
        this.type_();
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public structType(): StructTypeContext {
    let localctx: StructTypeContext = new StructTypeContext(this, this._ctx, this.state);
    this.enterRule(localctx, 102, GoParser.RULE_structType);
    let _la: number;
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 442;
        this.match(GoParser.STRUCT);
        this.state = 443;
        this.match(GoParser.L_BRACE);
        this.state = 449;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        while (_la === 43) {
          {
            {
              this.state = 444;
              this.fieldDecl();
              this.state = 445;
              this.eos();
            }
          }
          this.state = 451;
          this._errHandler.sync(this);
          _la = this._input.LA(1);
        }
        this.state = 452;
        this.match(GoParser.R_BRACE);
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public fieldDecl(): FieldDeclContext {
    let localctx: FieldDeclContext = new FieldDeclContext(this, this._ctx, this.state);
    this.enterRule(localctx, 104, GoParser.RULE_fieldDecl);
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 454;
        this.name();
        this.state = 455;
        this.type_();
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public name(): NameContext {
    let localctx: NameContext = new NameContext(this, this._ctx, this.state);
    this.enterRule(localctx, 106, GoParser.RULE_name);
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 457;
        this.match(GoParser.WORD);
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public nameList(): NameListContext {
    let localctx: NameListContext = new NameListContext(this, this._ctx, this.state);
    this.enterRule(localctx, 108, GoParser.RULE_nameList);
    let _la: number;
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 459;
        this.name();
        this.state = 464;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        while (_la === 26) {
          {
            {
              this.state = 460;
              this.match(GoParser.COMMA);
              this.state = 461;
              this.name();
            }
          }
          this.state = 466;
          this._errHandler.sync(this);
          _la = this._input.LA(1);
        }
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public lit(): LitContext {
    let localctx: LitContext = new LitContext(this, this._ctx, this.state);
    this.enterRule(localctx, 110, GoParser.RULE_lit);
    try {
      this.state = 473;
      this._errHandler.sync(this);
      switch (this._input.LA(1)) {
        case 1:
        case 2:
          this.enterOuterAlt(localctx, 1);
          {
            this.state = 467;
            this.number_();
          }
          break;
        case 3:
          this.enterOuterAlt(localctx, 2);
          {
            this.state = 468;
            this.litStr();
          }
          break;
        case 13:
          this.enterOuterAlt(localctx, 3);
          {
            this.state = 469;
            this.litNil();
          }
          break;
        case 4:
        case 5:
          this.enterOuterAlt(localctx, 4);
          {
            this.state = 470;
            this.litBool();
          }
          break;
        case 8:
          this.enterOuterAlt(localctx, 5);
          {
            this.state = 471;
            this.litFunc();
          }
          break;
        case 10:
        case 43:
          this.enterOuterAlt(localctx, 6);
          {
            this.state = 472;
            this.litStruct();
          }
          break;
        default:
          throw new NoViableAltException(this);
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public litNil(): LitNilContext {
    let localctx: LitNilContext = new LitNilContext(this, this._ctx, this.state);
    this.enterRule(localctx, 112, GoParser.RULE_litNil);
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 475;
        this.match(GoParser.NIL);
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public litStr(): LitStrContext {
    let localctx: LitStrContext = new LitStrContext(this, this._ctx, this.state);
    this.enterRule(localctx, 114, GoParser.RULE_litStr);
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 477;
        this.match(GoParser.LIT_STR);
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public litBool(): LitBoolContext {
    let localctx: LitBoolContext = new LitBoolContext(this, this._ctx, this.state);
    this.enterRule(localctx, 116, GoParser.RULE_litBool);
    let _la: number;
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 479;
        _la = this._input.LA(1);
        if (!(_la === 4 || _la === 5)) {
          this._errHandler.recoverInline(this);
        } else {
          this._errHandler.reportMatch(this);
          this.consume();
        }
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public litStruct(): LitStructContext {
    let localctx: LitStructContext = new LitStructContext(this, this._ctx, this.state);
    this.enterRule(localctx, 118, GoParser.RULE_litStruct);
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 483;
        this._errHandler.sync(this);
        switch (this._input.LA(1)) {
          case 10:
            {
              this.state = 481;
              this.structType();
            }
            break;
          case 43:
            {
              this.state = 482;
              this.typeName();
            }
            break;
          default:
            throw new NoViableAltException(this);
        }
        this.state = 485;
        this.match(GoParser.L_BRACE);
        this.state = 486;
        this.keyedElems();
        this.state = 487;
        this.match(GoParser.R_BRACE);
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public keyedElems(): KeyedElemsContext {
    let localctx: KeyedElemsContext = new KeyedElemsContext(this, this._ctx, this.state);
    this.enterRule(localctx, 120, GoParser.RULE_keyedElems);
    let _la: number;
    try {
      let _alt: number;
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 489;
        this.keyedElem();
        this.state = 494;
        this._errHandler.sync(this);
        _alt = this._interp.adaptivePredict(this._input, 43, this._ctx);
        while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
          if (_alt === 1) {
            {
              {
                this.state = 490;
                this.match(GoParser.COMMA);
                this.state = 491;
                this.keyedElem();
              }
            }
          }
          this.state = 496;
          this._errHandler.sync(this);
          _alt = this._interp.adaptivePredict(this._input, 43, this._ctx);
        }
        this.state = 498;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if (_la === 26) {
          {
            this.state = 497;
            this.match(GoParser.COMMA);
          }
        }
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public keyedElem(): KeyedElemContext {
    let localctx: KeyedElemContext = new KeyedElemContext(this, this._ctx, this.state);
    this.enterRule(localctx, 122, GoParser.RULE_keyedElem);
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 500;
        this.lname();
        this.state = 501;
        this.match(GoParser.COLON);
        this.state = 502;
        this.expr(0);
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public number_(): NumberContext {
    let localctx: NumberContext = new NumberContext(this, this._ctx, this.state);
    this.enterRule(localctx, 124, GoParser.RULE_number);
    let _la: number;
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 504;
        _la = this._input.LA(1);
        if (!(_la === 1 || _la === 2)) {
          this._errHandler.recoverInline(this);
        } else {
          this._errHandler.reportMatch(this);
          this.consume();
        }
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  // @RuleVersion(0)
  public eos(): EosContext {
    let localctx: EosContext = new EosContext(this, this._ctx, this.state);
    this.enterRule(localctx, 126, GoParser.RULE_eos);
    let _la: number;
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 506;
        _la = this._input.LA(1);
        if (!(_la === -1 || _la === 46)) {
          this._errHandler.recoverInline(this);
        } else {
          this._errHandler.reportMatch(this);
          this.consume();
        }
      }
    } catch (re) {
      if (re instanceof RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }

  public sempred(localctx: RuleContext, ruleIndex: number, predIndex: number): boolean {
    switch (ruleIndex) {
      case 21:
        return this.expr_sempred(localctx as ExprContext, predIndex);
      case 23:
        return this.primaryExpr_sempred(localctx as PrimaryExprContext, predIndex);
    }
    return true;
  }
  private expr_sempred(localctx: ExprContext, predIndex: number): boolean {
    switch (predIndex) {
      case 0:
        return this.precpred(this._ctx, 4);
      case 1:
        return this.precpred(this._ctx, 3);
      case 2:
        return this.precpred(this._ctx, 2);
      case 3:
        return this.precpred(this._ctx, 1);
    }
    return true;
  }
  private primaryExpr_sempred(localctx: PrimaryExprContext, predIndex: number): boolean {
    switch (predIndex) {
      case 4:
        return this.precpred(this._ctx, 2);
      case 5:
        return this.precpred(this._ctx, 1);
    }
    return true;
  }

  public static readonly _serializedATN: number[] = [
    4, 1, 47, 509, 2, 0, 7, 0, 2, 1, 7, 1, 2, 2, 7, 2, 2, 3, 7, 3, 2, 4, 7, 4, 2, 5, 7, 5, 2, 6, 7, 6, 2, 7, 7, 7, 2, 8,
    7, 8, 2, 9, 7, 9, 2, 10, 7, 10, 2, 11, 7, 11, 2, 12, 7, 12, 2, 13, 7, 13, 2, 14, 7, 14, 2, 15, 7, 15, 2, 16, 7, 16,
    2, 17, 7, 17, 2, 18, 7, 18, 2, 19, 7, 19, 2, 20, 7, 20, 2, 21, 7, 21, 2, 22, 7, 22, 2, 23, 7, 23, 2, 24, 7, 24, 2,
    25, 7, 25, 2, 26, 7, 26, 2, 27, 7, 27, 2, 28, 7, 28, 2, 29, 7, 29, 2, 30, 7, 30, 2, 31, 7, 31, 2, 32, 7, 32, 2, 33,
    7, 33, 2, 34, 7, 34, 2, 35, 7, 35, 2, 36, 7, 36, 2, 37, 7, 37, 2, 38, 7, 38, 2, 39, 7, 39, 2, 40, 7, 40, 2, 41, 7,
    41, 2, 42, 7, 42, 2, 43, 7, 43, 2, 44, 7, 44, 2, 45, 7, 45, 2, 46, 7, 46, 2, 47, 7, 47, 2, 48, 7, 48, 2, 49, 7, 49,
    2, 50, 7, 50, 2, 51, 7, 51, 2, 52, 7, 52, 2, 53, 7, 53, 2, 54, 7, 54, 2, 55, 7, 55, 2, 56, 7, 56, 2, 57, 7, 57, 2,
    58, 7, 58, 2, 59, 7, 59, 2, 60, 7, 60, 2, 61, 7, 61, 2, 62, 7, 62, 2, 63, 7, 63, 1, 0, 1, 0, 1, 0, 5, 0, 132, 8, 0,
    10, 0, 12, 0, 135, 9, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 147, 8, 1, 1, 2, 1, 2, 1,
    2, 3, 2, 152, 8, 2, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 3, 3, 159, 8, 3, 1, 4, 1, 4, 3, 4, 163, 8, 4, 1, 5, 1, 5, 1, 5, 1,
    5, 1, 6, 1, 6, 1, 7, 1, 7, 1, 8, 1, 8, 1, 8, 1, 9, 1, 9, 1, 9, 1, 9, 1, 10, 1, 10, 1, 10, 5, 10, 183, 8, 10, 10, 10,
    12, 10, 186, 9, 10, 1, 11, 1, 11, 3, 11, 190, 8, 11, 1, 12, 1, 12, 1, 13, 1, 13, 1, 13, 5, 13, 197, 8, 13, 10, 13,
    12, 13, 200, 9, 13, 1, 14, 1, 14, 1, 14, 1, 14, 1, 15, 1, 15, 1, 15, 1, 15, 3, 15, 210, 8, 15, 1, 15, 1, 15, 1, 16,
    1, 16, 1, 17, 3, 17, 217, 8, 17, 1, 17, 1, 17, 3, 17, 221, 8, 17, 1, 17, 1, 17, 3, 17, 225, 8, 17, 1, 18, 1, 18, 1,
    18, 1, 18, 1, 18, 1, 18, 3, 18, 233, 8, 18, 1, 18, 1, 18, 1, 18, 1, 19, 1, 19, 1, 20, 1, 20, 3, 20, 242, 8, 20, 1,
    21, 1, 21, 1, 21, 1, 21, 1, 21, 3, 21, 249, 8, 21, 1, 21, 1, 21, 1, 21, 1, 21, 1, 21, 1, 21, 1, 21, 1, 21, 1, 21, 1,
    21, 1, 21, 1, 21, 1, 21, 1, 21, 1, 21, 1, 21, 5, 21, 267, 8, 21, 10, 21, 12, 21, 270, 9, 21, 1, 22, 1, 22, 1, 22, 5,
    22, 275, 8, 22, 10, 22, 12, 22, 278, 9, 22, 1, 23, 1, 23, 1, 23, 3, 23, 283, 8, 23, 1, 23, 1, 23, 1, 23, 1, 23, 5,
    23, 289, 8, 23, 10, 23, 12, 23, 292, 9, 23, 1, 24, 1, 24, 1, 24, 1, 25, 1, 25, 1, 25, 1, 25, 5, 25, 301, 8, 25, 10,
    25, 12, 25, 304, 9, 25, 1, 25, 3, 25, 307, 8, 25, 3, 25, 309, 8, 25, 1, 25, 3, 25, 312, 8, 25, 1, 25, 1, 25, 1, 26,
    1, 26, 3, 26, 318, 8, 26, 1, 27, 1, 27, 1, 27, 1, 27, 5, 27, 324, 8, 27, 10, 27, 12, 27, 327, 9, 27, 1, 27, 1, 27,
    1, 28, 1, 28, 1, 29, 1, 29, 1, 30, 1, 30, 1, 31, 1, 31, 1, 32, 1, 32, 1, 33, 1, 33, 1, 33, 1, 33, 1, 34, 1, 34, 1,
    34, 3, 34, 348, 8, 34, 1, 35, 1, 35, 1, 35, 1, 35, 1, 35, 1, 35, 1, 35, 1, 35, 1, 36, 1, 36, 3, 36, 360, 8, 36, 1,
    37, 1, 37, 1, 37, 1, 37, 1, 38, 1, 38, 1, 38, 1, 38, 1, 38, 1, 38, 1, 39, 1, 39, 1, 39, 1, 39, 1, 39, 1, 40, 1, 40,
    1, 40, 1, 40, 1, 40, 1, 41, 1, 41, 1, 42, 3, 42, 385, 8, 42, 1, 42, 1, 42, 3, 42, 389, 8, 42, 1, 42, 1, 42, 1, 42,
    1, 42, 1, 42, 5, 42, 396, 8, 42, 10, 42, 12, 42, 399, 9, 42, 1, 42, 1, 42, 3, 42, 403, 8, 42, 1, 43, 1, 43, 1, 43,
    1, 43, 1, 44, 1, 44, 1, 44, 5, 44, 412, 8, 44, 10, 44, 12, 44, 415, 9, 44, 1, 44, 3, 44, 418, 8, 44, 1, 44, 3, 44,
    421, 8, 44, 3, 44, 423, 8, 44, 1, 45, 1, 45, 1, 45, 1, 46, 1, 46, 3, 46, 430, 8, 46, 1, 47, 1, 47, 1, 48, 1, 48, 3,
    48, 436, 8, 48, 1, 49, 1, 49, 1, 49, 1, 50, 1, 50, 1, 51, 1, 51, 1, 51, 1, 51, 1, 51, 5, 51, 448, 8, 51, 10, 51, 12,
    51, 451, 9, 51, 1, 51, 1, 51, 1, 52, 1, 52, 1, 52, 1, 53, 1, 53, 1, 54, 1, 54, 1, 54, 5, 54, 463, 8, 54, 10, 54, 12,
    54, 466, 9, 54, 1, 55, 1, 55, 1, 55, 1, 55, 1, 55, 1, 55, 3, 55, 474, 8, 55, 1, 56, 1, 56, 1, 57, 1, 57, 1, 58, 1,
    58, 1, 59, 1, 59, 3, 59, 484, 8, 59, 1, 59, 1, 59, 1, 59, 1, 59, 1, 60, 1, 60, 1, 60, 5, 60, 493, 8, 60, 10, 60, 12,
    60, 496, 9, 60, 1, 60, 3, 60, 499, 8, 60, 1, 61, 1, 61, 1, 61, 1, 61, 1, 62, 1, 62, 1, 63, 1, 63, 1, 63, 0, 2, 42,
    46, 64, 0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54,
    56, 58, 60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80, 82, 84, 86, 88, 90, 92, 94, 96, 98, 100, 102, 104, 106, 108,
    110, 112, 114, 116, 118, 120, 122, 124, 126, 0, 8, 2, 0, 30, 31, 33, 33, 1, 0, 34, 35, 1, 0, 36, 41, 2, 0, 32, 32,
    42, 42, 1, 0, 30, 31, 1, 0, 4, 5, 1, 0, 1, 2, 1, 1, 46, 46, 507, 0, 133, 1, 0, 0, 0, 2, 146, 1, 0, 0, 0, 4, 151, 1,
    0, 0, 0, 6, 153, 1, 0, 0, 0, 8, 162, 1, 0, 0, 0, 10, 164, 1, 0, 0, 0, 12, 168, 1, 0, 0, 0, 14, 170, 1, 0, 0, 0, 16,
    172, 1, 0, 0, 0, 18, 175, 1, 0, 0, 0, 20, 179, 1, 0, 0, 0, 22, 189, 1, 0, 0, 0, 24, 191, 1, 0, 0, 0, 26, 193, 1, 0,
    0, 0, 28, 201, 1, 0, 0, 0, 30, 205, 1, 0, 0, 0, 32, 213, 1, 0, 0, 0, 34, 216, 1, 0, 0, 0, 36, 232, 1, 0, 0, 0, 38,
    237, 1, 0, 0, 0, 40, 239, 1, 0, 0, 0, 42, 248, 1, 0, 0, 0, 44, 271, 1, 0, 0, 0, 46, 282, 1, 0, 0, 0, 48, 293, 1, 0,
    0, 0, 50, 296, 1, 0, 0, 0, 52, 317, 1, 0, 0, 0, 54, 319, 1, 0, 0, 0, 56, 330, 1, 0, 0, 0, 58, 332, 1, 0, 0, 0, 60,
    334, 1, 0, 0, 0, 62, 336, 1, 0, 0, 0, 64, 338, 1, 0, 0, 0, 66, 340, 1, 0, 0, 0, 68, 347, 1, 0, 0, 0, 70, 349, 1, 0,
    0, 0, 72, 359, 1, 0, 0, 0, 74, 361, 1, 0, 0, 0, 76, 365, 1, 0, 0, 0, 78, 371, 1, 0, 0, 0, 80, 376, 1, 0, 0, 0, 82,
    381, 1, 0, 0, 0, 84, 402, 1, 0, 0, 0, 86, 404, 1, 0, 0, 0, 88, 422, 1, 0, 0, 0, 90, 424, 1, 0, 0, 0, 92, 429, 1, 0,
    0, 0, 94, 431, 1, 0, 0, 0, 96, 435, 1, 0, 0, 0, 98, 437, 1, 0, 0, 0, 100, 440, 1, 0, 0, 0, 102, 442, 1, 0, 0, 0,
    104, 454, 1, 0, 0, 0, 106, 457, 1, 0, 0, 0, 108, 459, 1, 0, 0, 0, 110, 473, 1, 0, 0, 0, 112, 475, 1, 0, 0, 0, 114,
    477, 1, 0, 0, 0, 116, 479, 1, 0, 0, 0, 118, 483, 1, 0, 0, 0, 120, 489, 1, 0, 0, 0, 122, 500, 1, 0, 0, 0, 124, 504,
    1, 0, 0, 0, 126, 506, 1, 0, 0, 0, 128, 129, 3, 68, 34, 0, 129, 130, 3, 126, 63, 0, 130, 132, 1, 0, 0, 0, 131, 128,
    1, 0, 0, 0, 132, 135, 1, 0, 0, 0, 133, 131, 1, 0, 0, 0, 133, 134, 1, 0, 0, 0, 134, 1, 1, 0, 0, 0, 135, 133, 1, 0, 0,
    0, 136, 147, 3, 72, 36, 0, 137, 147, 3, 40, 20, 0, 138, 147, 3, 30, 15, 0, 139, 147, 3, 12, 6, 0, 140, 147, 3, 14,
    7, 0, 141, 147, 3, 6, 3, 0, 142, 147, 3, 16, 8, 0, 143, 147, 3, 10, 5, 0, 144, 147, 3, 54, 27, 0, 145, 147, 3, 4, 2,
    0, 146, 136, 1, 0, 0, 0, 146, 137, 1, 0, 0, 0, 146, 138, 1, 0, 0, 0, 146, 139, 1, 0, 0, 0, 146, 140, 1, 0, 0, 0,
    146, 141, 1, 0, 0, 0, 146, 142, 1, 0, 0, 0, 146, 143, 1, 0, 0, 0, 146, 144, 1, 0, 0, 0, 146, 145, 1, 0, 0, 0, 147,
    3, 1, 0, 0, 0, 148, 152, 3, 18, 9, 0, 149, 152, 3, 66, 33, 0, 150, 152, 3, 38, 19, 0, 151, 148, 1, 0, 0, 0, 151,
    149, 1, 0, 0, 0, 151, 150, 1, 0, 0, 0, 152, 5, 1, 0, 0, 0, 153, 154, 5, 17, 0, 0, 154, 155, 3, 42, 21, 0, 155, 158,
    3, 54, 27, 0, 156, 157, 5, 18, 0, 0, 157, 159, 3, 8, 4, 0, 158, 156, 1, 0, 0, 0, 158, 159, 1, 0, 0, 0, 159, 7, 1, 0,
    0, 0, 160, 163, 3, 6, 3, 0, 161, 163, 3, 54, 27, 0, 162, 160, 1, 0, 0, 0, 162, 161, 1, 0, 0, 0, 163, 9, 1, 0, 0, 0,
    164, 165, 3, 42, 21, 0, 165, 166, 5, 33, 0, 0, 166, 167, 3, 42, 21, 0, 167, 11, 1, 0, 0, 0, 168, 169, 5, 15, 0, 0,
    169, 13, 1, 0, 0, 0, 170, 171, 5, 16, 0, 0, 171, 15, 1, 0, 0, 0, 172, 173, 5, 14, 0, 0, 173, 174, 3, 46, 23, 0, 174,
    17, 1, 0, 0, 0, 175, 176, 3, 20, 10, 0, 176, 177, 5, 28, 0, 0, 177, 178, 3, 44, 22, 0, 178, 19, 1, 0, 0, 0, 179,
    184, 3, 22, 11, 0, 180, 181, 5, 26, 0, 0, 181, 183, 3, 22, 11, 0, 182, 180, 1, 0, 0, 0, 183, 186, 1, 0, 0, 0, 184,
    182, 1, 0, 0, 0, 184, 185, 1, 0, 0, 0, 185, 21, 1, 0, 0, 0, 186, 184, 1, 0, 0, 0, 187, 190, 3, 24, 12, 0, 188, 190,
    3, 28, 14, 0, 189, 187, 1, 0, 0, 0, 189, 188, 1, 0, 0, 0, 190, 23, 1, 0, 0, 0, 191, 192, 5, 43, 0, 0, 192, 25, 1, 0,
    0, 0, 193, 198, 3, 24, 12, 0, 194, 195, 5, 26, 0, 0, 195, 197, 3, 24, 12, 0, 196, 194, 1, 0, 0, 0, 197, 200, 1, 0,
    0, 0, 198, 196, 1, 0, 0, 0, 198, 199, 1, 0, 0, 0, 199, 27, 1, 0, 0, 0, 200, 198, 1, 0, 0, 0, 201, 202, 3, 46, 23, 0,
    202, 203, 5, 20, 0, 0, 203, 204, 5, 43, 0, 0, 204, 29, 1, 0, 0, 0, 205, 209, 5, 11, 0, 0, 206, 210, 3, 32, 16, 0,
    207, 210, 3, 34, 17, 0, 208, 210, 3, 36, 18, 0, 209, 206, 1, 0, 0, 0, 209, 207, 1, 0, 0, 0, 209, 208, 1, 0, 0, 0,
    210, 211, 1, 0, 0, 0, 211, 212, 3, 54, 27, 0, 212, 31, 1, 0, 0, 0, 213, 214, 3, 42, 21, 0, 214, 33, 1, 0, 0, 0, 215,
    217, 3, 4, 2, 0, 216, 215, 1, 0, 0, 0, 216, 217, 1, 0, 0, 0, 217, 218, 1, 0, 0, 0, 218, 220, 5, 27, 0, 0, 219, 221,
    3, 32, 16, 0, 220, 219, 1, 0, 0, 0, 220, 221, 1, 0, 0, 0, 221, 222, 1, 0, 0, 0, 222, 224, 5, 27, 0, 0, 223, 225, 3,
    4, 2, 0, 224, 223, 1, 0, 0, 0, 224, 225, 1, 0, 0, 0, 225, 35, 1, 0, 0, 0, 226, 227, 3, 20, 10, 0, 227, 228, 5, 28,
    0, 0, 228, 233, 1, 0, 0, 0, 229, 230, 3, 26, 13, 0, 230, 231, 5, 29, 0, 0, 231, 233, 1, 0, 0, 0, 232, 226, 1, 0, 0,
    0, 232, 229, 1, 0, 0, 0, 233, 234, 1, 0, 0, 0, 234, 235, 5, 19, 0, 0, 235, 236, 3, 42, 21, 0, 236, 37, 1, 0, 0, 0,
    237, 238, 3, 42, 21, 0, 238, 39, 1, 0, 0, 0, 239, 241, 5, 7, 0, 0, 240, 242, 3, 44, 22, 0, 241, 240, 1, 0, 0, 0,
    241, 242, 1, 0, 0, 0, 242, 41, 1, 0, 0, 0, 243, 244, 6, 21, -1, 0, 244, 249, 3, 46, 23, 0, 245, 246, 3, 56, 28, 0,
    246, 247, 3, 42, 21, 5, 247, 249, 1, 0, 0, 0, 248, 243, 1, 0, 0, 0, 248, 245, 1, 0, 0, 0, 249, 268, 1, 0, 0, 0, 250,
    251, 10, 4, 0, 0, 251, 252, 3, 62, 31, 0, 252, 253, 3, 42, 21, 5, 253, 267, 1, 0, 0, 0, 254, 255, 10, 3, 0, 0, 255,
    256, 3, 64, 32, 0, 256, 257, 3, 42, 21, 4, 257, 267, 1, 0, 0, 0, 258, 259, 10, 2, 0, 0, 259, 260, 3, 60, 30, 0, 260,
    261, 3, 42, 21, 3, 261, 267, 1, 0, 0, 0, 262, 263, 10, 1, 0, 0, 263, 264, 3, 58, 29, 0, 264, 265, 3, 42, 21, 2, 265,
    267, 1, 0, 0, 0, 266, 250, 1, 0, 0, 0, 266, 254, 1, 0, 0, 0, 266, 258, 1, 0, 0, 0, 266, 262, 1, 0, 0, 0, 267, 270,
    1, 0, 0, 0, 268, 266, 1, 0, 0, 0, 268, 269, 1, 0, 0, 0, 269, 43, 1, 0, 0, 0, 270, 268, 1, 0, 0, 0, 271, 276, 3, 42,
    21, 0, 272, 273, 5, 26, 0, 0, 273, 275, 3, 42, 21, 0, 274, 272, 1, 0, 0, 0, 275, 278, 1, 0, 0, 0, 276, 274, 1, 0, 0,
    0, 276, 277, 1, 0, 0, 0, 277, 45, 1, 0, 0, 0, 278, 276, 1, 0, 0, 0, 279, 280, 6, 23, -1, 0, 280, 283, 3, 110, 55, 0,
    281, 283, 3, 106, 53, 0, 282, 279, 1, 0, 0, 0, 282, 281, 1, 0, 0, 0, 283, 290, 1, 0, 0, 0, 284, 285, 10, 2, 0, 0,
    285, 289, 3, 50, 25, 0, 286, 287, 10, 1, 0, 0, 287, 289, 3, 48, 24, 0, 288, 284, 1, 0, 0, 0, 288, 286, 1, 0, 0, 0,
    289, 292, 1, 0, 0, 0, 290, 288, 1, 0, 0, 0, 290, 291, 1, 0, 0, 0, 291, 47, 1, 0, 0, 0, 292, 290, 1, 0, 0, 0, 293,
    294, 5, 20, 0, 0, 294, 295, 3, 106, 53, 0, 295, 49, 1, 0, 0, 0, 296, 308, 5, 24, 0, 0, 297, 302, 3, 52, 26, 0, 298,
    299, 5, 26, 0, 0, 299, 301, 3, 52, 26, 0, 300, 298, 1, 0, 0, 0, 301, 304, 1, 0, 0, 0, 302, 300, 1, 0, 0, 0, 302,
    303, 1, 0, 0, 0, 303, 309, 1, 0, 0, 0, 304, 302, 1, 0, 0, 0, 305, 307, 3, 52, 26, 0, 306, 305, 1, 0, 0, 0, 306, 307,
    1, 0, 0, 0, 307, 309, 1, 0, 0, 0, 308, 297, 1, 0, 0, 0, 308, 306, 1, 0, 0, 0, 309, 311, 1, 0, 0, 0, 310, 312, 5, 26,
    0, 0, 311, 310, 1, 0, 0, 0, 311, 312, 1, 0, 0, 0, 312, 313, 1, 0, 0, 0, 313, 314, 5, 25, 0, 0, 314, 51, 1, 0, 0, 0,
    315, 318, 3, 42, 21, 0, 316, 318, 3, 92, 46, 0, 317, 315, 1, 0, 0, 0, 317, 316, 1, 0, 0, 0, 318, 53, 1, 0, 0, 0,
    319, 325, 5, 22, 0, 0, 320, 321, 3, 2, 1, 0, 321, 322, 3, 126, 63, 0, 322, 324, 1, 0, 0, 0, 323, 320, 1, 0, 0, 0,
    324, 327, 1, 0, 0, 0, 325, 323, 1, 0, 0, 0, 325, 326, 1, 0, 0, 0, 326, 328, 1, 0, 0, 0, 327, 325, 1, 0, 0, 0, 328,
    329, 5, 23, 0, 0, 329, 55, 1, 0, 0, 0, 330, 331, 7, 0, 0, 0, 331, 57, 1, 0, 0, 0, 332, 333, 7, 1, 0, 0, 333, 59, 1,
    0, 0, 0, 334, 335, 7, 2, 0, 0, 335, 61, 1, 0, 0, 0, 336, 337, 7, 3, 0, 0, 337, 63, 1, 0, 0, 0, 338, 339, 7, 4, 0, 0,
    339, 65, 1, 0, 0, 0, 340, 341, 3, 26, 13, 0, 341, 342, 5, 29, 0, 0, 342, 343, 3, 44, 22, 0, 343, 67, 1, 0, 0, 0,
    344, 348, 3, 72, 36, 0, 345, 348, 3, 78, 39, 0, 346, 348, 3, 70, 35, 0, 347, 344, 1, 0, 0, 0, 347, 345, 1, 0, 0, 0,
    347, 346, 1, 0, 0, 0, 348, 69, 1, 0, 0, 0, 349, 350, 5, 8, 0, 0, 350, 351, 5, 24, 0, 0, 351, 352, 3, 90, 45, 0, 352,
    353, 5, 25, 0, 0, 353, 354, 3, 106, 53, 0, 354, 355, 3, 80, 40, 0, 355, 356, 3, 82, 41, 0, 356, 71, 1, 0, 0, 0, 357,
    360, 3, 76, 38, 0, 358, 360, 3, 74, 37, 0, 359, 357, 1, 0, 0, 0, 359, 358, 1, 0, 0, 0, 360, 73, 1, 0, 0, 0, 361,
    362, 5, 9, 0, 0, 362, 363, 3, 106, 53, 0, 363, 364, 3, 92, 46, 0, 364, 75, 1, 0, 0, 0, 365, 366, 5, 6, 0, 0, 366,
    367, 3, 106, 53, 0, 367, 368, 3, 92, 46, 0, 368, 369, 5, 28, 0, 0, 369, 370, 3, 42, 21, 0, 370, 77, 1, 0, 0, 0, 371,
    372, 5, 8, 0, 0, 372, 373, 3, 106, 53, 0, 373, 374, 3, 80, 40, 0, 374, 375, 3, 82, 41, 0, 375, 79, 1, 0, 0, 0, 376,
    377, 5, 24, 0, 0, 377, 378, 3, 88, 44, 0, 378, 379, 5, 25, 0, 0, 379, 380, 3, 84, 42, 0, 380, 81, 1, 0, 0, 0, 381,
    382, 3, 54, 27, 0, 382, 83, 1, 0, 0, 0, 383, 385, 3, 92, 46, 0, 384, 383, 1, 0, 0, 0, 384, 385, 1, 0, 0, 0, 385,
    403, 1, 0, 0, 0, 386, 388, 5, 24, 0, 0, 387, 389, 3, 92, 46, 0, 388, 387, 1, 0, 0, 0, 388, 389, 1, 0, 0, 0, 389,
    390, 1, 0, 0, 0, 390, 403, 5, 25, 0, 0, 391, 392, 5, 24, 0, 0, 392, 397, 3, 92, 46, 0, 393, 394, 5, 26, 0, 0, 394,
    396, 3, 92, 46, 0, 395, 393, 1, 0, 0, 0, 396, 399, 1, 0, 0, 0, 397, 395, 1, 0, 0, 0, 397, 398, 1, 0, 0, 0, 398, 400,
    1, 0, 0, 0, 399, 397, 1, 0, 0, 0, 400, 401, 5, 25, 0, 0, 401, 403, 1, 0, 0, 0, 402, 384, 1, 0, 0, 0, 402, 386, 1, 0,
    0, 0, 402, 391, 1, 0, 0, 0, 403, 85, 1, 0, 0, 0, 404, 405, 5, 8, 0, 0, 405, 406, 3, 80, 40, 0, 406, 407, 3, 82, 41,
    0, 407, 87, 1, 0, 0, 0, 408, 413, 3, 90, 45, 0, 409, 410, 5, 26, 0, 0, 410, 412, 3, 90, 45, 0, 411, 409, 1, 0, 0, 0,
    412, 415, 1, 0, 0, 0, 413, 411, 1, 0, 0, 0, 413, 414, 1, 0, 0, 0, 414, 417, 1, 0, 0, 0, 415, 413, 1, 0, 0, 0, 416,
    418, 5, 26, 0, 0, 417, 416, 1, 0, 0, 0, 417, 418, 1, 0, 0, 0, 418, 423, 1, 0, 0, 0, 419, 421, 3, 90, 45, 0, 420,
    419, 1, 0, 0, 0, 420, 421, 1, 0, 0, 0, 421, 423, 1, 0, 0, 0, 422, 408, 1, 0, 0, 0, 422, 420, 1, 0, 0, 0, 423, 89, 1,
    0, 0, 0, 424, 425, 3, 106, 53, 0, 425, 426, 3, 94, 47, 0, 426, 91, 1, 0, 0, 0, 427, 430, 3, 94, 47, 0, 428, 430, 3,
    96, 48, 0, 429, 427, 1, 0, 0, 0, 429, 428, 1, 0, 0, 0, 430, 93, 1, 0, 0, 0, 431, 432, 5, 43, 0, 0, 432, 95, 1, 0, 0,
    0, 433, 436, 3, 102, 51, 0, 434, 436, 3, 98, 49, 0, 435, 433, 1, 0, 0, 0, 435, 434, 1, 0, 0, 0, 436, 97, 1, 0, 0, 0,
    437, 438, 5, 12, 0, 0, 438, 439, 3, 100, 50, 0, 439, 99, 1, 0, 0, 0, 440, 441, 3, 92, 46, 0, 441, 101, 1, 0, 0, 0,
    442, 443, 5, 10, 0, 0, 443, 449, 5, 22, 0, 0, 444, 445, 3, 104, 52, 0, 445, 446, 3, 126, 63, 0, 446, 448, 1, 0, 0,
    0, 447, 444, 1, 0, 0, 0, 448, 451, 1, 0, 0, 0, 449, 447, 1, 0, 0, 0, 449, 450, 1, 0, 0, 0, 450, 452, 1, 0, 0, 0,
    451, 449, 1, 0, 0, 0, 452, 453, 5, 23, 0, 0, 453, 103, 1, 0, 0, 0, 454, 455, 3, 106, 53, 0, 455, 456, 3, 92, 46, 0,
    456, 105, 1, 0, 0, 0, 457, 458, 5, 43, 0, 0, 458, 107, 1, 0, 0, 0, 459, 464, 3, 106, 53, 0, 460, 461, 5, 26, 0, 0,
    461, 463, 3, 106, 53, 0, 462, 460, 1, 0, 0, 0, 463, 466, 1, 0, 0, 0, 464, 462, 1, 0, 0, 0, 464, 465, 1, 0, 0, 0,
    465, 109, 1, 0, 0, 0, 466, 464, 1, 0, 0, 0, 467, 474, 3, 124, 62, 0, 468, 474, 3, 114, 57, 0, 469, 474, 3, 112, 56,
    0, 470, 474, 3, 116, 58, 0, 471, 474, 3, 86, 43, 0, 472, 474, 3, 118, 59, 0, 473, 467, 1, 0, 0, 0, 473, 468, 1, 0,
    0, 0, 473, 469, 1, 0, 0, 0, 473, 470, 1, 0, 0, 0, 473, 471, 1, 0, 0, 0, 473, 472, 1, 0, 0, 0, 474, 111, 1, 0, 0, 0,
    475, 476, 5, 13, 0, 0, 476, 113, 1, 0, 0, 0, 477, 478, 5, 3, 0, 0, 478, 115, 1, 0, 0, 0, 479, 480, 7, 5, 0, 0, 480,
    117, 1, 0, 0, 0, 481, 484, 3, 102, 51, 0, 482, 484, 3, 94, 47, 0, 483, 481, 1, 0, 0, 0, 483, 482, 1, 0, 0, 0, 484,
    485, 1, 0, 0, 0, 485, 486, 5, 22, 0, 0, 486, 487, 3, 120, 60, 0, 487, 488, 5, 23, 0, 0, 488, 119, 1, 0, 0, 0, 489,
    494, 3, 122, 61, 0, 490, 491, 5, 26, 0, 0, 491, 493, 3, 122, 61, 0, 492, 490, 1, 0, 0, 0, 493, 496, 1, 0, 0, 0, 494,
    492, 1, 0, 0, 0, 494, 495, 1, 0, 0, 0, 495, 498, 1, 0, 0, 0, 496, 494, 1, 0, 0, 0, 497, 499, 5, 26, 0, 0, 498, 497,
    1, 0, 0, 0, 498, 499, 1, 0, 0, 0, 499, 121, 1, 0, 0, 0, 500, 501, 3, 24, 12, 0, 501, 502, 5, 21, 0, 0, 502, 503, 3,
    42, 21, 0, 503, 123, 1, 0, 0, 0, 504, 505, 7, 6, 0, 0, 505, 125, 1, 0, 0, 0, 506, 507, 7, 7, 0, 0, 507, 127, 1, 0,
    0, 0, 45, 133, 146, 151, 158, 162, 184, 189, 198, 209, 216, 220, 224, 232, 241, 248, 266, 268, 276, 282, 288, 290,
    302, 306, 308, 311, 317, 325, 347, 359, 384, 388, 397, 402, 413, 417, 420, 422, 429, 435, 449, 464, 473, 483, 494,
    498,
  ];

  private static __ATN: ATN;
  public static get _ATN(): ATN {
    if (!GoParser.__ATN) {
      GoParser.__ATN = new ATNDeserializer().deserialize(GoParser._serializedATN);
    }

    return GoParser.__ATN;
  }

  static DecisionsToDFA = GoParser._ATN.decisionToState.map((ds: DecisionState, index: number) => new DFA(ds, index));
}

export class ProgContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public topLevelDecl_list(): TopLevelDeclContext[] {
    return this.getTypedRuleContexts(TopLevelDeclContext) as TopLevelDeclContext[];
  }
  public topLevelDecl(i: number): TopLevelDeclContext {
    return this.getTypedRuleContext(TopLevelDeclContext, i) as TopLevelDeclContext;
  }
  public eos_list(): EosContext[] {
    return this.getTypedRuleContexts(EosContext) as EosContext[];
  }
  public eos(i: number): EosContext {
    return this.getTypedRuleContext(EosContext, i) as EosContext;
  }
  public get ruleIndex(): number {
    return GoParser.RULE_prog;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterProg) {
      listener.enterProg(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitProg) {
      listener.exitProg(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitProg) {
      return visitor.visitProg(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class StmtContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public decl(): DeclContext {
    return this.getTypedRuleContext(DeclContext, 0) as DeclContext;
  }
  public returnStmt(): ReturnStmtContext {
    return this.getTypedRuleContext(ReturnStmtContext, 0) as ReturnStmtContext;
  }
  public forStmt(): ForStmtContext {
    return this.getTypedRuleContext(ForStmtContext, 0) as ForStmtContext;
  }
  public breakStmt(): BreakStmtContext {
    return this.getTypedRuleContext(BreakStmtContext, 0) as BreakStmtContext;
  }
  public continueStmt(): ContinueStmtContext {
    return this.getTypedRuleContext(ContinueStmtContext, 0) as ContinueStmtContext;
  }
  public ifStmt(): IfStmtContext {
    return this.getTypedRuleContext(IfStmtContext, 0) as IfStmtContext;
  }
  public goStmt(): GoStmtContext {
    return this.getTypedRuleContext(GoStmtContext, 0) as GoStmtContext;
  }
  public sendStmt(): SendStmtContext {
    return this.getTypedRuleContext(SendStmtContext, 0) as SendStmtContext;
  }
  public block(): BlockContext {
    return this.getTypedRuleContext(BlockContext, 0) as BlockContext;
  }
  public simpleStmt(): SimpleStmtContext {
    return this.getTypedRuleContext(SimpleStmtContext, 0) as SimpleStmtContext;
  }
  public get ruleIndex(): number {
    return GoParser.RULE_stmt;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterStmt) {
      listener.enterStmt(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitStmt) {
      listener.exitStmt(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitStmt) {
      return visitor.visitStmt(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class SimpleStmtContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public assignment(): AssignmentContext {
    return this.getTypedRuleContext(AssignmentContext, 0) as AssignmentContext;
  }
  public shortVarDecl(): ShortVarDeclContext {
    return this.getTypedRuleContext(ShortVarDeclContext, 0) as ShortVarDeclContext;
  }
  public exprStmt(): ExprStmtContext {
    return this.getTypedRuleContext(ExprStmtContext, 0) as ExprStmtContext;
  }
  public get ruleIndex(): number {
    return GoParser.RULE_simpleStmt;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterSimpleStmt) {
      listener.enterSimpleStmt(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitSimpleStmt) {
      listener.exitSimpleStmt(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitSimpleStmt) {
      return visitor.visitSimpleStmt(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class IfStmtContext extends ParserRuleContext {
  public _cond!: ExprContext;
  public _cons!: BlockContext;
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public IF(): TerminalNode {
    return this.getToken(GoParser.IF, 0);
  }
  public expr(): ExprContext {
    return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
  }
  public block(): BlockContext {
    return this.getTypedRuleContext(BlockContext, 0) as BlockContext;
  }
  public ELSE(): TerminalNode {
    return this.getToken(GoParser.ELSE, 0);
  }
  public alt(): AltContext {
    return this.getTypedRuleContext(AltContext, 0) as AltContext;
  }
  public get ruleIndex(): number {
    return GoParser.RULE_ifStmt;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterIfStmt) {
      listener.enterIfStmt(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitIfStmt) {
      listener.exitIfStmt(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitIfStmt) {
      return visitor.visitIfStmt(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class AltContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public ifStmt(): IfStmtContext {
    return this.getTypedRuleContext(IfStmtContext, 0) as IfStmtContext;
  }
  public block(): BlockContext {
    return this.getTypedRuleContext(BlockContext, 0) as BlockContext;
  }
  public get ruleIndex(): number {
    return GoParser.RULE_alt;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterAlt) {
      listener.enterAlt(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitAlt) {
      listener.exitAlt(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitAlt) {
      return visitor.visitAlt(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class SendStmtContext extends ParserRuleContext {
  public _channel!: ExprContext;
  public _rhs!: ExprContext;
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public RCV(): TerminalNode {
    return this.getToken(GoParser.RCV, 0);
  }
  public expr_list(): ExprContext[] {
    return this.getTypedRuleContexts(ExprContext) as ExprContext[];
  }
  public expr(i: number): ExprContext {
    return this.getTypedRuleContext(ExprContext, i) as ExprContext;
  }
  public get ruleIndex(): number {
    return GoParser.RULE_sendStmt;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterSendStmt) {
      listener.enterSendStmt(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitSendStmt) {
      listener.exitSendStmt(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitSendStmt) {
      return visitor.visitSendStmt(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class BreakStmtContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public BREAK(): TerminalNode {
    return this.getToken(GoParser.BREAK, 0);
  }
  public get ruleIndex(): number {
    return GoParser.RULE_breakStmt;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterBreakStmt) {
      listener.enterBreakStmt(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitBreakStmt) {
      listener.exitBreakStmt(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitBreakStmt) {
      return visitor.visitBreakStmt(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class ContinueStmtContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public CONTINUE(): TerminalNode {
    return this.getToken(GoParser.CONTINUE, 0);
  }
  public get ruleIndex(): number {
    return GoParser.RULE_continueStmt;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterContinueStmt) {
      listener.enterContinueStmt(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitContinueStmt) {
      listener.exitContinueStmt(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitContinueStmt) {
      return visitor.visitContinueStmt(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class GoStmtContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public GO(): TerminalNode {
    return this.getToken(GoParser.GO, 0);
  }
  public primaryExpr(): PrimaryExprContext {
    return this.getTypedRuleContext(PrimaryExprContext, 0) as PrimaryExprContext;
  }
  public get ruleIndex(): number {
    return GoParser.RULE_goStmt;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterGoStmt) {
      listener.enterGoStmt(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitGoStmt) {
      listener.exitGoStmt(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitGoStmt) {
      return visitor.visitGoStmt(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class AssignmentContext extends ParserRuleContext {
  public _lhs!: LvalueListContext;
  public _rhs!: ExprListContext;
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public ASSIGN(): TerminalNode {
    return this.getToken(GoParser.ASSIGN, 0);
  }
  public lvalueList(): LvalueListContext {
    return this.getTypedRuleContext(LvalueListContext, 0) as LvalueListContext;
  }
  public exprList(): ExprListContext {
    return this.getTypedRuleContext(ExprListContext, 0) as ExprListContext;
  }
  public get ruleIndex(): number {
    return GoParser.RULE_assignment;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterAssignment) {
      listener.enterAssignment(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitAssignment) {
      listener.exitAssignment(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitAssignment) {
      return visitor.visitAssignment(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class LvalueListContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public lvalue_list(): LvalueContext[] {
    return this.getTypedRuleContexts(LvalueContext) as LvalueContext[];
  }
  public lvalue(i: number): LvalueContext {
    return this.getTypedRuleContext(LvalueContext, i) as LvalueContext;
  }
  public COMMA_list(): TerminalNode[] {
    return this.getTokens(GoParser.COMMA);
  }
  public COMMA(i: number): TerminalNode {
    return this.getToken(GoParser.COMMA, i);
  }
  public get ruleIndex(): number {
    return GoParser.RULE_lvalueList;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterLvalueList) {
      listener.enterLvalueList(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitLvalueList) {
      listener.exitLvalueList(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitLvalueList) {
      return visitor.visitLvalueList(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class LvalueContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public lname(): LnameContext {
    return this.getTypedRuleContext(LnameContext, 0) as LnameContext;
  }
  public field(): FieldContext {
    return this.getTypedRuleContext(FieldContext, 0) as FieldContext;
  }
  public get ruleIndex(): number {
    return GoParser.RULE_lvalue;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterLvalue) {
      listener.enterLvalue(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitLvalue) {
      listener.exitLvalue(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitLvalue) {
      return visitor.visitLvalue(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class LnameContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public WORD(): TerminalNode {
    return this.getToken(GoParser.WORD, 0);
  }
  public get ruleIndex(): number {
    return GoParser.RULE_lname;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterLname) {
      listener.enterLname(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitLname) {
      listener.exitLname(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitLname) {
      return visitor.visitLname(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class LnameListContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public lname_list(): LnameContext[] {
    return this.getTypedRuleContexts(LnameContext) as LnameContext[];
  }
  public lname(i: number): LnameContext {
    return this.getTypedRuleContext(LnameContext, i) as LnameContext;
  }
  public COMMA_list(): TerminalNode[] {
    return this.getTokens(GoParser.COMMA);
  }
  public COMMA(i: number): TerminalNode {
    return this.getToken(GoParser.COMMA, i);
  }
  public get ruleIndex(): number {
    return GoParser.RULE_lnameList;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterLnameList) {
      listener.enterLnameList(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitLnameList) {
      listener.exitLnameList(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitLnameList) {
      return visitor.visitLnameList(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class FieldContext extends ParserRuleContext {
  public _base!: PrimaryExprContext;
  public _last!: Token;
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public PERIOD(): TerminalNode {
    return this.getToken(GoParser.PERIOD, 0);
  }
  public primaryExpr(): PrimaryExprContext {
    return this.getTypedRuleContext(PrimaryExprContext, 0) as PrimaryExprContext;
  }
  public WORD(): TerminalNode {
    return this.getToken(GoParser.WORD, 0);
  }
  public get ruleIndex(): number {
    return GoParser.RULE_field;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterField) {
      listener.enterField(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitField) {
      listener.exitField(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitField) {
      return visitor.visitField(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class ForStmtContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public FOR(): TerminalNode {
    return this.getToken(GoParser.FOR, 0);
  }
  public block(): BlockContext {
    return this.getTypedRuleContext(BlockContext, 0) as BlockContext;
  }
  public condition(): ConditionContext {
    return this.getTypedRuleContext(ConditionContext, 0) as ConditionContext;
  }
  public forClause(): ForClauseContext {
    return this.getTypedRuleContext(ForClauseContext, 0) as ForClauseContext;
  }
  public rangeClause(): RangeClauseContext {
    return this.getTypedRuleContext(RangeClauseContext, 0) as RangeClauseContext;
  }
  public get ruleIndex(): number {
    return GoParser.RULE_forStmt;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterForStmt) {
      listener.enterForStmt(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitForStmt) {
      listener.exitForStmt(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitForStmt) {
      return visitor.visitForStmt(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class ConditionContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public expr(): ExprContext {
    return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
  }
  public get ruleIndex(): number {
    return GoParser.RULE_condition;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterCondition) {
      listener.enterCondition(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitCondition) {
      listener.exitCondition(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitCondition) {
      return visitor.visitCondition(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class ForClauseContext extends ParserRuleContext {
  public _init!: SimpleStmtContext;
  public _cond!: ConditionContext;
  public _post!: SimpleStmtContext;
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public SEMI_list(): TerminalNode[] {
    return this.getTokens(GoParser.SEMI);
  }
  public SEMI(i: number): TerminalNode {
    return this.getToken(GoParser.SEMI, i);
  }
  public simpleStmt_list(): SimpleStmtContext[] {
    return this.getTypedRuleContexts(SimpleStmtContext) as SimpleStmtContext[];
  }
  public simpleStmt(i: number): SimpleStmtContext {
    return this.getTypedRuleContext(SimpleStmtContext, i) as SimpleStmtContext;
  }
  public condition(): ConditionContext {
    return this.getTypedRuleContext(ConditionContext, 0) as ConditionContext;
  }
  public get ruleIndex(): number {
    return GoParser.RULE_forClause;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterForClause) {
      listener.enterForClause(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitForClause) {
      listener.exitForClause(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitForClause) {
      return visitor.visitForClause(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class RangeClauseContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public RANGE(): TerminalNode {
    return this.getToken(GoParser.RANGE, 0);
  }
  public expr(): ExprContext {
    return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
  }
  public lvalueList(): LvalueListContext {
    return this.getTypedRuleContext(LvalueListContext, 0) as LvalueListContext;
  }
  public ASSIGN(): TerminalNode {
    return this.getToken(GoParser.ASSIGN, 0);
  }
  public lnameList(): LnameListContext {
    return this.getTypedRuleContext(LnameListContext, 0) as LnameListContext;
  }
  public WALRUS(): TerminalNode {
    return this.getToken(GoParser.WALRUS, 0);
  }
  public get ruleIndex(): number {
    return GoParser.RULE_rangeClause;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterRangeClause) {
      listener.enterRangeClause(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitRangeClause) {
      listener.exitRangeClause(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitRangeClause) {
      return visitor.visitRangeClause(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class ExprStmtContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public expr(): ExprContext {
    return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
  }
  public get ruleIndex(): number {
    return GoParser.RULE_exprStmt;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterExprStmt) {
      listener.enterExprStmt(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitExprStmt) {
      listener.exitExprStmt(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitExprStmt) {
      return visitor.visitExprStmt(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class ReturnStmtContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public RETURN(): TerminalNode {
    return this.getToken(GoParser.RETURN, 0);
  }
  public exprList(): ExprListContext {
    return this.getTypedRuleContext(ExprListContext, 0) as ExprListContext;
  }
  public get ruleIndex(): number {
    return GoParser.RULE_returnStmt;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterReturnStmt) {
      listener.enterReturnStmt(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitReturnStmt) {
      listener.exitReturnStmt(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitReturnStmt) {
      return visitor.visitReturnStmt(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class ExprContext extends ParserRuleContext {
  public _lhs!: ExprContext;
  public _rhs!: ExprContext;
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public primaryExpr(): PrimaryExprContext {
    return this.getTypedRuleContext(PrimaryExprContext, 0) as PrimaryExprContext;
  }
  public unaryOp(): UnaryOpContext {
    return this.getTypedRuleContext(UnaryOpContext, 0) as UnaryOpContext;
  }
  public expr_list(): ExprContext[] {
    return this.getTypedRuleContexts(ExprContext) as ExprContext[];
  }
  public expr(i: number): ExprContext {
    return this.getTypedRuleContext(ExprContext, i) as ExprContext;
  }
  public mulOp(): MulOpContext {
    return this.getTypedRuleContext(MulOpContext, 0) as MulOpContext;
  }
  public addOp(): AddOpContext {
    return this.getTypedRuleContext(AddOpContext, 0) as AddOpContext;
  }
  public relOp(): RelOpContext {
    return this.getTypedRuleContext(RelOpContext, 0) as RelOpContext;
  }
  public logicalOp(): LogicalOpContext {
    return this.getTypedRuleContext(LogicalOpContext, 0) as LogicalOpContext;
  }
  public get ruleIndex(): number {
    return GoParser.RULE_expr;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterExpr) {
      listener.enterExpr(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitExpr) {
      listener.exitExpr(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitExpr) {
      return visitor.visitExpr(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class ExprListContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public expr_list(): ExprContext[] {
    return this.getTypedRuleContexts(ExprContext) as ExprContext[];
  }
  public expr(i: number): ExprContext {
    return this.getTypedRuleContext(ExprContext, i) as ExprContext;
  }
  public COMMA_list(): TerminalNode[] {
    return this.getTokens(GoParser.COMMA);
  }
  public COMMA(i: number): TerminalNode {
    return this.getToken(GoParser.COMMA, i);
  }
  public get ruleIndex(): number {
    return GoParser.RULE_exprList;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterExprList) {
      listener.enterExprList(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitExprList) {
      listener.exitExprList(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitExprList) {
      return visitor.visitExprList(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class PrimaryExprContext extends ParserRuleContext {
  public _fn!: PrimaryExprContext;
  public _base!: PrimaryExprContext;
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public lit(): LitContext {
    return this.getTypedRuleContext(LitContext, 0) as LitContext;
  }
  public name(): NameContext {
    return this.getTypedRuleContext(NameContext, 0) as NameContext;
  }
  public args(): ArgsContext {
    return this.getTypedRuleContext(ArgsContext, 0) as ArgsContext;
  }
  public primaryExpr(): PrimaryExprContext {
    return this.getTypedRuleContext(PrimaryExprContext, 0) as PrimaryExprContext;
  }
  public selector(): SelectorContext {
    return this.getTypedRuleContext(SelectorContext, 0) as SelectorContext;
  }
  public get ruleIndex(): number {
    return GoParser.RULE_primaryExpr;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterPrimaryExpr) {
      listener.enterPrimaryExpr(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitPrimaryExpr) {
      listener.exitPrimaryExpr(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitPrimaryExpr) {
      return visitor.visitPrimaryExpr(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class SelectorContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public PERIOD(): TerminalNode {
    return this.getToken(GoParser.PERIOD, 0);
  }
  public name(): NameContext {
    return this.getTypedRuleContext(NameContext, 0) as NameContext;
  }
  public get ruleIndex(): number {
    return GoParser.RULE_selector;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterSelector) {
      listener.enterSelector(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitSelector) {
      listener.exitSelector(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitSelector) {
      return visitor.visitSelector(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class ArgsContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public L_PAREN(): TerminalNode {
    return this.getToken(GoParser.L_PAREN, 0);
  }
  public R_PAREN(): TerminalNode {
    return this.getToken(GoParser.R_PAREN, 0);
  }
  public arg_list(): ArgContext[] {
    return this.getTypedRuleContexts(ArgContext) as ArgContext[];
  }
  public arg(i: number): ArgContext {
    return this.getTypedRuleContext(ArgContext, i) as ArgContext;
  }
  public COMMA_list(): TerminalNode[] {
    return this.getTokens(GoParser.COMMA);
  }
  public COMMA(i: number): TerminalNode {
    return this.getToken(GoParser.COMMA, i);
  }
  public get ruleIndex(): number {
    return GoParser.RULE_args;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterArgs) {
      listener.enterArgs(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitArgs) {
      listener.exitArgs(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitArgs) {
      return visitor.visitArgs(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class ArgContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public expr(): ExprContext {
    return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
  }
  public type_(): TypeContext {
    return this.getTypedRuleContext(TypeContext, 0) as TypeContext;
  }
  public get ruleIndex(): number {
    return GoParser.RULE_arg;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterArg) {
      listener.enterArg(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitArg) {
      listener.exitArg(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitArg) {
      return visitor.visitArg(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class BlockContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public L_BRACE(): TerminalNode {
    return this.getToken(GoParser.L_BRACE, 0);
  }
  public R_BRACE(): TerminalNode {
    return this.getToken(GoParser.R_BRACE, 0);
  }
  public stmt_list(): StmtContext[] {
    return this.getTypedRuleContexts(StmtContext) as StmtContext[];
  }
  public stmt(i: number): StmtContext {
    return this.getTypedRuleContext(StmtContext, i) as StmtContext;
  }
  public eos_list(): EosContext[] {
    return this.getTypedRuleContexts(EosContext) as EosContext[];
  }
  public eos(i: number): EosContext {
    return this.getTypedRuleContext(EosContext, i) as EosContext;
  }
  public get ruleIndex(): number {
    return GoParser.RULE_block;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterBlock) {
      listener.enterBlock(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitBlock) {
      listener.exitBlock(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitBlock) {
      return visitor.visitBlock(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class UnaryOpContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public MINUS(): TerminalNode {
    return this.getToken(GoParser.MINUS, 0);
  }
  public PLUS(): TerminalNode {
    return this.getToken(GoParser.PLUS, 0);
  }
  public RCV(): TerminalNode {
    return this.getToken(GoParser.RCV, 0);
  }
  public get ruleIndex(): number {
    return GoParser.RULE_unaryOp;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterUnaryOp) {
      listener.enterUnaryOp(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitUnaryOp) {
      listener.exitUnaryOp(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitUnaryOp) {
      return visitor.visitUnaryOp(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class LogicalOpContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public LOGICAL_OR(): TerminalNode {
    return this.getToken(GoParser.LOGICAL_OR, 0);
  }
  public LOGICAL_AND(): TerminalNode {
    return this.getToken(GoParser.LOGICAL_AND, 0);
  }
  public get ruleIndex(): number {
    return GoParser.RULE_logicalOp;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterLogicalOp) {
      listener.enterLogicalOp(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitLogicalOp) {
      listener.exitLogicalOp(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitLogicalOp) {
      return visitor.visitLogicalOp(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class RelOpContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public EQ(): TerminalNode {
    return this.getToken(GoParser.EQ, 0);
  }
  public NEQ(): TerminalNode {
    return this.getToken(GoParser.NEQ, 0);
  }
  public LESS(): TerminalNode {
    return this.getToken(GoParser.LESS, 0);
  }
  public LEQ(): TerminalNode {
    return this.getToken(GoParser.LEQ, 0);
  }
  public GREATER(): TerminalNode {
    return this.getToken(GoParser.GREATER, 0);
  }
  public GEQ(): TerminalNode {
    return this.getToken(GoParser.GEQ, 0);
  }
  public get ruleIndex(): number {
    return GoParser.RULE_relOp;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterRelOp) {
      listener.enterRelOp(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitRelOp) {
      listener.exitRelOp(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitRelOp) {
      return visitor.visitRelOp(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class MulOpContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public STAR(): TerminalNode {
    return this.getToken(GoParser.STAR, 0);
  }
  public DIV(): TerminalNode {
    return this.getToken(GoParser.DIV, 0);
  }
  public get ruleIndex(): number {
    return GoParser.RULE_mulOp;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterMulOp) {
      listener.enterMulOp(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitMulOp) {
      listener.exitMulOp(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitMulOp) {
      return visitor.visitMulOp(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class AddOpContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public PLUS(): TerminalNode {
    return this.getToken(GoParser.PLUS, 0);
  }
  public MINUS(): TerminalNode {
    return this.getToken(GoParser.MINUS, 0);
  }
  public get ruleIndex(): number {
    return GoParser.RULE_addOp;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterAddOp) {
      listener.enterAddOp(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitAddOp) {
      listener.exitAddOp(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitAddOp) {
      return visitor.visitAddOp(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class ShortVarDeclContext extends ParserRuleContext {
  public _lhs!: LnameListContext;
  public _rhs!: ExprListContext;
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public WALRUS(): TerminalNode {
    return this.getToken(GoParser.WALRUS, 0);
  }
  public lnameList(): LnameListContext {
    return this.getTypedRuleContext(LnameListContext, 0) as LnameListContext;
  }
  public exprList(): ExprListContext {
    return this.getTypedRuleContext(ExprListContext, 0) as ExprListContext;
  }
  public get ruleIndex(): number {
    return GoParser.RULE_shortVarDecl;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterShortVarDecl) {
      listener.enterShortVarDecl(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitShortVarDecl) {
      listener.exitShortVarDecl(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitShortVarDecl) {
      return visitor.visitShortVarDecl(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class TopLevelDeclContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public decl(): DeclContext {
    return this.getTypedRuleContext(DeclContext, 0) as DeclContext;
  }
  public funcDecl(): FuncDeclContext {
    return this.getTypedRuleContext(FuncDeclContext, 0) as FuncDeclContext;
  }
  public methodDecl(): MethodDeclContext {
    return this.getTypedRuleContext(MethodDeclContext, 0) as MethodDeclContext;
  }
  public get ruleIndex(): number {
    return GoParser.RULE_topLevelDecl;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterTopLevelDecl) {
      listener.enterTopLevelDecl(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitTopLevelDecl) {
      listener.exitTopLevelDecl(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitTopLevelDecl) {
      return visitor.visitTopLevelDecl(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class MethodDeclContext extends ParserRuleContext {
  public _receiver!: ParamContext;
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public FUNC(): TerminalNode {
    return this.getToken(GoParser.FUNC, 0);
  }
  public L_PAREN(): TerminalNode {
    return this.getToken(GoParser.L_PAREN, 0);
  }
  public R_PAREN(): TerminalNode {
    return this.getToken(GoParser.R_PAREN, 0);
  }
  public name(): NameContext {
    return this.getTypedRuleContext(NameContext, 0) as NameContext;
  }
  public signature(): SignatureContext {
    return this.getTypedRuleContext(SignatureContext, 0) as SignatureContext;
  }
  public funcBody(): FuncBodyContext {
    return this.getTypedRuleContext(FuncBodyContext, 0) as FuncBodyContext;
  }
  public param(): ParamContext {
    return this.getTypedRuleContext(ParamContext, 0) as ParamContext;
  }
  public get ruleIndex(): number {
    return GoParser.RULE_methodDecl;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterMethodDecl) {
      listener.enterMethodDecl(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitMethodDecl) {
      listener.exitMethodDecl(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitMethodDecl) {
      return visitor.visitMethodDecl(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class DeclContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public varDecl(): VarDeclContext {
    return this.getTypedRuleContext(VarDeclContext, 0) as VarDeclContext;
  }
  public typeDecl(): TypeDeclContext {
    return this.getTypedRuleContext(TypeDeclContext, 0) as TypeDeclContext;
  }
  public get ruleIndex(): number {
    return GoParser.RULE_decl;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterDecl) {
      listener.enterDecl(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitDecl) {
      listener.exitDecl(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitDecl) {
      return visitor.visitDecl(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class TypeDeclContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public TYPE(): TerminalNode {
    return this.getToken(GoParser.TYPE, 0);
  }
  public name(): NameContext {
    return this.getTypedRuleContext(NameContext, 0) as NameContext;
  }
  public type_(): TypeContext {
    return this.getTypedRuleContext(TypeContext, 0) as TypeContext;
  }
  public get ruleIndex(): number {
    return GoParser.RULE_typeDecl;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterTypeDecl) {
      listener.enterTypeDecl(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitTypeDecl) {
      listener.exitTypeDecl(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitTypeDecl) {
      return visitor.visitTypeDecl(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class VarDeclContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public VAR(): TerminalNode {
    return this.getToken(GoParser.VAR, 0);
  }
  public name(): NameContext {
    return this.getTypedRuleContext(NameContext, 0) as NameContext;
  }
  public type_(): TypeContext {
    return this.getTypedRuleContext(TypeContext, 0) as TypeContext;
  }
  public ASSIGN(): TerminalNode {
    return this.getToken(GoParser.ASSIGN, 0);
  }
  public expr(): ExprContext {
    return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
  }
  public get ruleIndex(): number {
    return GoParser.RULE_varDecl;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterVarDecl) {
      listener.enterVarDecl(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitVarDecl) {
      listener.exitVarDecl(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitVarDecl) {
      return visitor.visitVarDecl(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class FuncDeclContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public FUNC(): TerminalNode {
    return this.getToken(GoParser.FUNC, 0);
  }
  public name(): NameContext {
    return this.getTypedRuleContext(NameContext, 0) as NameContext;
  }
  public signature(): SignatureContext {
    return this.getTypedRuleContext(SignatureContext, 0) as SignatureContext;
  }
  public funcBody(): FuncBodyContext {
    return this.getTypedRuleContext(FuncBodyContext, 0) as FuncBodyContext;
  }
  public get ruleIndex(): number {
    return GoParser.RULE_funcDecl;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterFuncDecl) {
      listener.enterFuncDecl(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitFuncDecl) {
      listener.exitFuncDecl(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitFuncDecl) {
      return visitor.visitFuncDecl(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class SignatureContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public L_PAREN(): TerminalNode {
    return this.getToken(GoParser.L_PAREN, 0);
  }
  public params(): ParamsContext {
    return this.getTypedRuleContext(ParamsContext, 0) as ParamsContext;
  }
  public R_PAREN(): TerminalNode {
    return this.getToken(GoParser.R_PAREN, 0);
  }
  public funcResult(): FuncResultContext {
    return this.getTypedRuleContext(FuncResultContext, 0) as FuncResultContext;
  }
  public get ruleIndex(): number {
    return GoParser.RULE_signature;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterSignature) {
      listener.enterSignature(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitSignature) {
      listener.exitSignature(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitSignature) {
      return visitor.visitSignature(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class FuncBodyContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public block(): BlockContext {
    return this.getTypedRuleContext(BlockContext, 0) as BlockContext;
  }
  public get ruleIndex(): number {
    return GoParser.RULE_funcBody;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterFuncBody) {
      listener.enterFuncBody(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitFuncBody) {
      listener.exitFuncBody(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitFuncBody) {
      return visitor.visitFuncBody(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class FuncResultContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public type__list(): TypeContext[] {
    return this.getTypedRuleContexts(TypeContext) as TypeContext[];
  }
  public type_(i: number): TypeContext {
    return this.getTypedRuleContext(TypeContext, i) as TypeContext;
  }
  public L_PAREN(): TerminalNode {
    return this.getToken(GoParser.L_PAREN, 0);
  }
  public R_PAREN(): TerminalNode {
    return this.getToken(GoParser.R_PAREN, 0);
  }
  public COMMA_list(): TerminalNode[] {
    return this.getTokens(GoParser.COMMA);
  }
  public COMMA(i: number): TerminalNode {
    return this.getToken(GoParser.COMMA, i);
  }
  public get ruleIndex(): number {
    return GoParser.RULE_funcResult;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterFuncResult) {
      listener.enterFuncResult(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitFuncResult) {
      listener.exitFuncResult(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitFuncResult) {
      return visitor.visitFuncResult(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class LitFuncContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public FUNC(): TerminalNode {
    return this.getToken(GoParser.FUNC, 0);
  }
  public signature(): SignatureContext {
    return this.getTypedRuleContext(SignatureContext, 0) as SignatureContext;
  }
  public funcBody(): FuncBodyContext {
    return this.getTypedRuleContext(FuncBodyContext, 0) as FuncBodyContext;
  }
  public get ruleIndex(): number {
    return GoParser.RULE_litFunc;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterLitFunc) {
      listener.enterLitFunc(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitLitFunc) {
      listener.exitLitFunc(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitLitFunc) {
      return visitor.visitLitFunc(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class ParamsContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public param_list(): ParamContext[] {
    return this.getTypedRuleContexts(ParamContext) as ParamContext[];
  }
  public param(i: number): ParamContext {
    return this.getTypedRuleContext(ParamContext, i) as ParamContext;
  }
  public COMMA_list(): TerminalNode[] {
    return this.getTokens(GoParser.COMMA);
  }
  public COMMA(i: number): TerminalNode {
    return this.getToken(GoParser.COMMA, i);
  }
  public get ruleIndex(): number {
    return GoParser.RULE_params;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterParams) {
      listener.enterParams(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitParams) {
      listener.exitParams(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitParams) {
      return visitor.visitParams(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class ParamContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public name(): NameContext {
    return this.getTypedRuleContext(NameContext, 0) as NameContext;
  }
  public typeName(): TypeNameContext {
    return this.getTypedRuleContext(TypeNameContext, 0) as TypeNameContext;
  }
  public get ruleIndex(): number {
    return GoParser.RULE_param;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterParam) {
      listener.enterParam(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitParam) {
      listener.exitParam(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitParam) {
      return visitor.visitParam(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class TypeContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public typeName(): TypeNameContext {
    return this.getTypedRuleContext(TypeNameContext, 0) as TypeNameContext;
  }
  public typeLit(): TypeLitContext {
    return this.getTypedRuleContext(TypeLitContext, 0) as TypeLitContext;
  }
  public get ruleIndex(): number {
    return GoParser.RULE_type;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterType) {
      listener.enterType(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitType) {
      listener.exitType(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitType) {
      return visitor.visitType(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class TypeNameContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public WORD(): TerminalNode {
    return this.getToken(GoParser.WORD, 0);
  }
  public get ruleIndex(): number {
    return GoParser.RULE_typeName;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterTypeName) {
      listener.enterTypeName(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitTypeName) {
      listener.exitTypeName(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitTypeName) {
      return visitor.visitTypeName(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class TypeLitContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public structType(): StructTypeContext {
    return this.getTypedRuleContext(StructTypeContext, 0) as StructTypeContext;
  }
  public channelType(): ChannelTypeContext {
    return this.getTypedRuleContext(ChannelTypeContext, 0) as ChannelTypeContext;
  }
  public get ruleIndex(): number {
    return GoParser.RULE_typeLit;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterTypeLit) {
      listener.enterTypeLit(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitTypeLit) {
      listener.exitTypeLit(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitTypeLit) {
      return visitor.visitTypeLit(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class ChannelTypeContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public CHAN(): TerminalNode {
    return this.getToken(GoParser.CHAN, 0);
  }
  public elementType(): ElementTypeContext {
    return this.getTypedRuleContext(ElementTypeContext, 0) as ElementTypeContext;
  }
  public get ruleIndex(): number {
    return GoParser.RULE_channelType;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterChannelType) {
      listener.enterChannelType(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitChannelType) {
      listener.exitChannelType(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitChannelType) {
      return visitor.visitChannelType(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class ElementTypeContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public type_(): TypeContext {
    return this.getTypedRuleContext(TypeContext, 0) as TypeContext;
  }
  public get ruleIndex(): number {
    return GoParser.RULE_elementType;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterElementType) {
      listener.enterElementType(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitElementType) {
      listener.exitElementType(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitElementType) {
      return visitor.visitElementType(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class StructTypeContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public STRUCT(): TerminalNode {
    return this.getToken(GoParser.STRUCT, 0);
  }
  public L_BRACE(): TerminalNode {
    return this.getToken(GoParser.L_BRACE, 0);
  }
  public R_BRACE(): TerminalNode {
    return this.getToken(GoParser.R_BRACE, 0);
  }
  public fieldDecl_list(): FieldDeclContext[] {
    return this.getTypedRuleContexts(FieldDeclContext) as FieldDeclContext[];
  }
  public fieldDecl(i: number): FieldDeclContext {
    return this.getTypedRuleContext(FieldDeclContext, i) as FieldDeclContext;
  }
  public eos_list(): EosContext[] {
    return this.getTypedRuleContexts(EosContext) as EosContext[];
  }
  public eos(i: number): EosContext {
    return this.getTypedRuleContext(EosContext, i) as EosContext;
  }
  public get ruleIndex(): number {
    return GoParser.RULE_structType;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterStructType) {
      listener.enterStructType(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitStructType) {
      listener.exitStructType(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitStructType) {
      return visitor.visitStructType(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class FieldDeclContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public name(): NameContext {
    return this.getTypedRuleContext(NameContext, 0) as NameContext;
  }
  public type_(): TypeContext {
    return this.getTypedRuleContext(TypeContext, 0) as TypeContext;
  }
  public get ruleIndex(): number {
    return GoParser.RULE_fieldDecl;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterFieldDecl) {
      listener.enterFieldDecl(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitFieldDecl) {
      listener.exitFieldDecl(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitFieldDecl) {
      return visitor.visitFieldDecl(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class NameContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public WORD(): TerminalNode {
    return this.getToken(GoParser.WORD, 0);
  }
  public get ruleIndex(): number {
    return GoParser.RULE_name;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterName) {
      listener.enterName(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitName) {
      listener.exitName(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitName) {
      return visitor.visitName(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class NameListContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public name_list(): NameContext[] {
    return this.getTypedRuleContexts(NameContext) as NameContext[];
  }
  public name(i: number): NameContext {
    return this.getTypedRuleContext(NameContext, i) as NameContext;
  }
  public COMMA_list(): TerminalNode[] {
    return this.getTokens(GoParser.COMMA);
  }
  public COMMA(i: number): TerminalNode {
    return this.getToken(GoParser.COMMA, i);
  }
  public get ruleIndex(): number {
    return GoParser.RULE_nameList;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterNameList) {
      listener.enterNameList(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitNameList) {
      listener.exitNameList(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitNameList) {
      return visitor.visitNameList(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class LitContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public number_(): NumberContext {
    return this.getTypedRuleContext(NumberContext, 0) as NumberContext;
  }
  public litStr(): LitStrContext {
    return this.getTypedRuleContext(LitStrContext, 0) as LitStrContext;
  }
  public litNil(): LitNilContext {
    return this.getTypedRuleContext(LitNilContext, 0) as LitNilContext;
  }
  public litBool(): LitBoolContext {
    return this.getTypedRuleContext(LitBoolContext, 0) as LitBoolContext;
  }
  public litFunc(): LitFuncContext {
    return this.getTypedRuleContext(LitFuncContext, 0) as LitFuncContext;
  }
  public litStruct(): LitStructContext {
    return this.getTypedRuleContext(LitStructContext, 0) as LitStructContext;
  }
  public get ruleIndex(): number {
    return GoParser.RULE_lit;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterLit) {
      listener.enterLit(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitLit) {
      listener.exitLit(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitLit) {
      return visitor.visitLit(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class LitNilContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public NIL(): TerminalNode {
    return this.getToken(GoParser.NIL, 0);
  }
  public get ruleIndex(): number {
    return GoParser.RULE_litNil;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterLitNil) {
      listener.enterLitNil(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitLitNil) {
      listener.exitLitNil(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitLitNil) {
      return visitor.visitLitNil(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class LitStrContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public LIT_STR(): TerminalNode {
    return this.getToken(GoParser.LIT_STR, 0);
  }
  public get ruleIndex(): number {
    return GoParser.RULE_litStr;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterLitStr) {
      listener.enterLitStr(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitLitStr) {
      listener.exitLitStr(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitLitStr) {
      return visitor.visitLitStr(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class LitBoolContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public TRUE(): TerminalNode {
    return this.getToken(GoParser.TRUE, 0);
  }
  public FALSE(): TerminalNode {
    return this.getToken(GoParser.FALSE, 0);
  }
  public get ruleIndex(): number {
    return GoParser.RULE_litBool;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterLitBool) {
      listener.enterLitBool(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitLitBool) {
      listener.exitLitBool(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitLitBool) {
      return visitor.visitLitBool(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class LitStructContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public L_BRACE(): TerminalNode {
    return this.getToken(GoParser.L_BRACE, 0);
  }
  public keyedElems(): KeyedElemsContext {
    return this.getTypedRuleContext(KeyedElemsContext, 0) as KeyedElemsContext;
  }
  public R_BRACE(): TerminalNode {
    return this.getToken(GoParser.R_BRACE, 0);
  }
  public structType(): StructTypeContext {
    return this.getTypedRuleContext(StructTypeContext, 0) as StructTypeContext;
  }
  public typeName(): TypeNameContext {
    return this.getTypedRuleContext(TypeNameContext, 0) as TypeNameContext;
  }
  public get ruleIndex(): number {
    return GoParser.RULE_litStruct;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterLitStruct) {
      listener.enterLitStruct(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitLitStruct) {
      listener.exitLitStruct(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitLitStruct) {
      return visitor.visitLitStruct(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class KeyedElemsContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public keyedElem_list(): KeyedElemContext[] {
    return this.getTypedRuleContexts(KeyedElemContext) as KeyedElemContext[];
  }
  public keyedElem(i: number): KeyedElemContext {
    return this.getTypedRuleContext(KeyedElemContext, i) as KeyedElemContext;
  }
  public COMMA_list(): TerminalNode[] {
    return this.getTokens(GoParser.COMMA);
  }
  public COMMA(i: number): TerminalNode {
    return this.getToken(GoParser.COMMA, i);
  }
  public get ruleIndex(): number {
    return GoParser.RULE_keyedElems;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterKeyedElems) {
      listener.enterKeyedElems(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitKeyedElems) {
      listener.exitKeyedElems(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitKeyedElems) {
      return visitor.visitKeyedElems(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class KeyedElemContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public lname(): LnameContext {
    return this.getTypedRuleContext(LnameContext, 0) as LnameContext;
  }
  public COLON(): TerminalNode {
    return this.getToken(GoParser.COLON, 0);
  }
  public expr(): ExprContext {
    return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
  }
  public get ruleIndex(): number {
    return GoParser.RULE_keyedElem;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterKeyedElem) {
      listener.enterKeyedElem(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitKeyedElem) {
      listener.exitKeyedElem(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitKeyedElem) {
      return visitor.visitKeyedElem(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class NumberContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public INT(): TerminalNode {
    return this.getToken(GoParser.INT, 0);
  }
  public FLOAT(): TerminalNode {
    return this.getToken(GoParser.FLOAT, 0);
  }
  public get ruleIndex(): number {
    return GoParser.RULE_number;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterNumber) {
      listener.enterNumber(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitNumber) {
      listener.exitNumber(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitNumber) {
      return visitor.visitNumber(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class EosContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public EOS(): TerminalNode {
    return this.getToken(GoParser.EOS, 0);
  }
  public EOF(): TerminalNode {
    return this.getToken(GoParser.EOF, 0);
  }
  public get ruleIndex(): number {
    return GoParser.RULE_eos;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterEos) {
      listener.enterEos(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitEos) {
      listener.exitEos(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitEos) {
      return visitor.visitEos(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}
