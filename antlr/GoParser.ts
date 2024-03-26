// Generated from GoParser.g4 by ANTLR 4.13.1
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
  public static readonly L_BRACE = 21;
  public static readonly R_BRACE = 22;
  public static readonly L_PAREN = 23;
  public static readonly R_PAREN = 24;
  public static readonly COMMA = 25;
  public static readonly SEMI = 26;
  public static readonly ASSIGN = 27;
  public static readonly WALRUS = 28;
  public static readonly MINUS = 29;
  public static readonly PLUS = 30;
  public static readonly DIV = 31;
  public static readonly RCV = 32;
  public static readonly LOGICAL_OR = 33;
  public static readonly LOGICAL_AND = 34;
  public static readonly EQ = 35;
  public static readonly NEQ = 36;
  public static readonly LESS = 37;
  public static readonly LEQ = 38;
  public static readonly GREATER = 39;
  public static readonly GEQ = 40;
  public static readonly STAR = 41;
  public static readonly WORD = 42;
  public static readonly WS = 43;
  public static readonly NLSEMI_WS = 44;
  public static readonly EOS = 45;
  public static readonly OTHER = 46;
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
  public static readonly RULE_forStmt = 12;
  public static readonly RULE_condition = 13;
  public static readonly RULE_forClause = 14;
  public static readonly RULE_rangeClause = 15;
  public static readonly RULE_exprStmt = 16;
  public static readonly RULE_returnStmt = 17;
  public static readonly RULE_expr = 18;
  public static readonly RULE_exprList = 19;
  public static readonly RULE_primaryExpr = 20;
  public static readonly RULE_selector = 21;
  public static readonly RULE_args = 22;
  public static readonly RULE_arg = 23;
  public static readonly RULE_block = 24;
  public static readonly RULE_unaryOp = 25;
  public static readonly RULE_binaryOp = 26;
  public static readonly RULE_logicalOp = 27;
  public static readonly RULE_relOp = 28;
  public static readonly RULE_numericOp = 29;
  public static readonly RULE_shortVarDecl = 30;
  public static readonly RULE_decl = 31;
  public static readonly RULE_typeDecl = 32;
  public static readonly RULE_varDecl = 33;
  public static readonly RULE_funcDecl = 34;
  public static readonly RULE_signature = 35;
  public static readonly RULE_funcBody = 36;
  public static readonly RULE_litFunc = 37;
  public static readonly RULE_params = 38;
  public static readonly RULE_param = 39;
  public static readonly RULE_type = 40;
  public static readonly RULE_typeName = 41;
  public static readonly RULE_typeLit = 42;
  public static readonly RULE_channelType = 43;
  public static readonly RULE_elementType = 44;
  public static readonly RULE_structType = 45;
  public static readonly RULE_fieldDecl = 46;
  public static readonly RULE_ident = 47;
  public static readonly RULE_identList = 48;
  public static readonly RULE_lit = 49;
  public static readonly RULE_litNil = 50;
  public static readonly RULE_litStr = 51;
  public static readonly RULE_litBool = 52;
  public static readonly RULE_number = 53;
  public static readonly RULE_eos = 54;
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
    "binaryOp",
    "logicalOp",
    "relOp",
    "numericOp",
    "shortVarDecl",
    "decl",
    "typeDecl",
    "varDecl",
    "funcDecl",
    "signature",
    "funcBody",
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
    "ident",
    "identList",
    "lit",
    "litNil",
    "litStr",
    "litBool",
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
        this.state = 115;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        while ((_la & ~0x1f) === 0 && ((1 << _la) & 832) !== 0) {
          {
            {
              this.state = 110;
              this.decl();
              this.state = 111;
              this.eos();
            }
          }
          this.state = 117;
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
      this.state = 128;
      this._errHandler.sync(this);
      switch (this._interp.adaptivePredict(this._input, 1, this._ctx)) {
        case 1:
          this.enterOuterAlt(localctx, 1);
          {
            this.state = 118;
            this.decl();
          }
          break;
        case 2:
          this.enterOuterAlt(localctx, 2);
          {
            this.state = 119;
            this.returnStmt();
          }
          break;
        case 3:
          this.enterOuterAlt(localctx, 3);
          {
            this.state = 120;
            this.forStmt();
          }
          break;
        case 4:
          this.enterOuterAlt(localctx, 4);
          {
            this.state = 121;
            this.breakStmt();
          }
          break;
        case 5:
          this.enterOuterAlt(localctx, 5);
          {
            this.state = 122;
            this.continueStmt();
          }
          break;
        case 6:
          this.enterOuterAlt(localctx, 6);
          {
            this.state = 123;
            this.ifStmt();
          }
          break;
        case 7:
          this.enterOuterAlt(localctx, 7);
          {
            this.state = 124;
            this.goStmt();
          }
          break;
        case 8:
          this.enterOuterAlt(localctx, 8);
          {
            this.state = 125;
            this.sendStmt();
          }
          break;
        case 9:
          this.enterOuterAlt(localctx, 9);
          {
            this.state = 126;
            this.block();
          }
          break;
        case 10:
          this.enterOuterAlt(localctx, 10);
          {
            this.state = 127;
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
      this.state = 133;
      this._errHandler.sync(this);
      switch (this._interp.adaptivePredict(this._input, 2, this._ctx)) {
        case 1:
          this.enterOuterAlt(localctx, 1);
          {
            this.state = 130;
            this.assignment();
          }
          break;
        case 2:
          this.enterOuterAlt(localctx, 2);
          {
            this.state = 131;
            this.shortVarDecl();
          }
          break;
        case 3:
          this.enterOuterAlt(localctx, 3);
          {
            this.state = 132;
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
        this.state = 135;
        this.match(GoParser.IF);
        this.state = 136;
        localctx._cond = this.expr(0);
        this.state = 137;
        localctx._cons = this.block();
        this.state = 140;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if (_la === 18) {
          {
            this.state = 138;
            this.match(GoParser.ELSE);
            this.state = 139;
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
      this.state = 144;
      this._errHandler.sync(this);
      switch (this._input.LA(1)) {
        case 17:
          this.enterOuterAlt(localctx, 1);
          {
            this.state = 142;
            this.ifStmt();
          }
          break;
        case 21:
          this.enterOuterAlt(localctx, 2);
          {
            this.state = 143;
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
        this.state = 146;
        localctx._channel = this.expr(0);
        this.state = 147;
        this.match(GoParser.RCV);
        this.state = 148;
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
        this.state = 150;
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
        this.state = 152;
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
        this.state = 154;
        this.match(GoParser.GO);
        this.state = 155;
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
        this.state = 157;
        localctx._lhs = this.lvalueList();
        this.state = 158;
        this.match(GoParser.ASSIGN);
        this.state = 159;
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
        this.state = 161;
        this.lvalue();
        this.state = 166;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        while (_la === 25) {
          {
            {
              this.state = 162;
              this.match(GoParser.COMMA);
              this.state = 163;
              this.lvalue();
            }
          }
          this.state = 168;
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
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 169;
        this.ident();
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
    this.enterRule(localctx, 24, GoParser.RULE_forStmt);
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 171;
        this.match(GoParser.FOR);
        this.state = 175;
        this._errHandler.sync(this);
        switch (this._interp.adaptivePredict(this._input, 6, this._ctx)) {
          case 1:
            {
              this.state = 172;
              this.condition();
            }
            break;
          case 2:
            {
              this.state = 173;
              this.forClause();
            }
            break;
          case 3:
            {
              this.state = 174;
              this.rangeClause();
            }
            break;
        }
        this.state = 177;
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
    this.enterRule(localctx, 26, GoParser.RULE_condition);
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 179;
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
    this.enterRule(localctx, 28, GoParser.RULE_forClause);
    let _la: number;
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 182;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if (((_la & ~0x1f) === 0 && ((1 << _la) & 1610621246) !== 0) || _la === 32 || _la === 42) {
          {
            this.state = 181;
            localctx._init = this.simpleStmt();
          }
        }

        this.state = 184;
        this.match(GoParser.SEMI);
        this.state = 186;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if (((_la & ~0x1f) === 0 && ((1 << _la) & 1610621246) !== 0) || _la === 32 || _la === 42) {
          {
            this.state = 185;
            localctx._cond = this.condition();
          }
        }

        this.state = 188;
        this.match(GoParser.SEMI);
        this.state = 190;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if (((_la & ~0x1f) === 0 && ((1 << _la) & 1610621246) !== 0) || _la === 32 || _la === 42) {
          {
            this.state = 189;
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
    this.enterRule(localctx, 30, GoParser.RULE_rangeClause);
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 198;
        this._errHandler.sync(this);
        switch (this._interp.adaptivePredict(this._input, 10, this._ctx)) {
          case 1:
            {
              this.state = 192;
              this.exprList();
              this.state = 193;
              this.match(GoParser.ASSIGN);
            }
            break;
          case 2:
            {
              this.state = 195;
              this.identList();
              this.state = 196;
              this.match(GoParser.WALRUS);
            }
            break;
        }
        this.state = 200;
        this.match(GoParser.RANGE);
        this.state = 201;
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
    this.enterRule(localctx, 32, GoParser.RULE_exprStmt);
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 203;
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
    this.enterRule(localctx, 34, GoParser.RULE_returnStmt);
    let _la: number;
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 205;
        this.match(GoParser.RETURN);
        this.state = 207;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if (((_la & ~0x1f) === 0 && ((1 << _la) & 1610621246) !== 0) || _la === 32 || _la === 42) {
          {
            this.state = 206;
            this.expr(0);
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
    let _startState: number = 36;
    this.enterRecursionRule(localctx, 36, GoParser.RULE_expr, _p);
    try {
      let _alt: number;
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 214;
        this._errHandler.sync(this);
        switch (this._input.LA(1)) {
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
          case 8:
          case 13:
          case 42:
            {
              this.state = 210;
              this.primaryExpr(0);
            }
            break;
          case 29:
          case 30:
          case 32:
            {
              this.state = 211;
              this.unaryOp();
              this.state = 212;
              this.expr(2);
            }
            break;
          default:
            throw new NoViableAltException(this);
        }
        this._ctx.stop = this._input.LT(-1);
        this.state = 222;
        this._errHandler.sync(this);
        _alt = this._interp.adaptivePredict(this._input, 13, this._ctx);
        while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
          if (_alt === 1) {
            if (this._parseListeners != null) {
              this.triggerExitRuleEvent();
            }
            _prevctx = localctx;
            {
              {
                localctx = new ExprContext(this, _parentctx, _parentState);
                localctx._lhs = _prevctx;
                this.pushNewRecursionContext(localctx, _startState, GoParser.RULE_expr);
                this.state = 216;
                if (!this.precpred(this._ctx, 1)) {
                  throw this.createFailedPredicateException("this.precpred(this._ctx, 1)");
                }
                this.state = 217;
                this.binaryOp();
                this.state = 218;
                localctx._rhs = this.expr(2);
              }
            }
          }
          this.state = 224;
          this._errHandler.sync(this);
          _alt = this._interp.adaptivePredict(this._input, 13, this._ctx);
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
    this.enterRule(localctx, 38, GoParser.RULE_exprList);
    let _la: number;
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 225;
        this.expr(0);
        this.state = 230;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        while (_la === 25) {
          {
            {
              this.state = 226;
              this.match(GoParser.COMMA);
              this.state = 227;
              this.expr(0);
            }
          }
          this.state = 232;
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
    let _startState: number = 40;
    this.enterRecursionRule(localctx, 40, GoParser.RULE_primaryExpr, _p);
    try {
      let _alt: number;
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 236;
        this._errHandler.sync(this);
        switch (this._input.LA(1)) {
          case 42:
            {
              this.state = 234;
              this.ident();
            }
            break;
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
          case 8:
          case 13:
            {
              this.state = 235;
              this.lit();
            }
            break;
          default:
            throw new NoViableAltException(this);
        }
        this._ctx.stop = this._input.LT(-1);
        this.state = 244;
        this._errHandler.sync(this);
        _alt = this._interp.adaptivePredict(this._input, 17, this._ctx);
        while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
          if (_alt === 1) {
            if (this._parseListeners != null) {
              this.triggerExitRuleEvent();
            }
            _prevctx = localctx;
            {
              this.state = 242;
              this._errHandler.sync(this);
              switch (this._interp.adaptivePredict(this._input, 16, this._ctx)) {
                case 1:
                  {
                    localctx = new PrimaryExprContext(this, _parentctx, _parentState);
                    localctx._fn = _prevctx;
                    this.pushNewRecursionContext(localctx, _startState, GoParser.RULE_primaryExpr);
                    this.state = 238;
                    if (!this.precpred(this._ctx, 2)) {
                      throw this.createFailedPredicateException("this.precpred(this._ctx, 2)");
                    }
                    this.state = 239;
                    this.args();
                  }
                  break;
                case 2:
                  {
                    localctx = new PrimaryExprContext(this, _parentctx, _parentState);
                    localctx._base = _prevctx;
                    this.pushNewRecursionContext(localctx, _startState, GoParser.RULE_primaryExpr);
                    this.state = 240;
                    if (!this.precpred(this._ctx, 1)) {
                      throw this.createFailedPredicateException("this.precpred(this._ctx, 1)");
                    }
                    this.state = 241;
                    this.selector();
                  }
                  break;
              }
            }
          }
          this.state = 246;
          this._errHandler.sync(this);
          _alt = this._interp.adaptivePredict(this._input, 17, this._ctx);
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
    this.enterRule(localctx, 42, GoParser.RULE_selector);
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 247;
        this.match(GoParser.PERIOD);
        this.state = 248;
        this.ident();
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
    this.enterRule(localctx, 44, GoParser.RULE_args);
    let _la: number;
    try {
      let _alt: number;
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 250;
        this.match(GoParser.L_PAREN);
        this.state = 251;
        this.arg();
        this.state = 256;
        this._errHandler.sync(this);
        _alt = this._interp.adaptivePredict(this._input, 18, this._ctx);
        while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
          if (_alt === 1) {
            {
              {
                this.state = 252;
                this.match(GoParser.COMMA);
                this.state = 253;
                this.arg();
              }
            }
          }
          this.state = 258;
          this._errHandler.sync(this);
          _alt = this._interp.adaptivePredict(this._input, 18, this._ctx);
        }
        this.state = 260;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if (_la === 25) {
          {
            this.state = 259;
            this.match(GoParser.COMMA);
          }
        }

        this.state = 262;
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
    this.enterRule(localctx, 46, GoParser.RULE_arg);
    try {
      this.state = 266;
      this._errHandler.sync(this);
      switch (this._interp.adaptivePredict(this._input, 20, this._ctx)) {
        case 1:
          this.enterOuterAlt(localctx, 1);
          {
            this.state = 264;
            this.expr(0);
          }
          break;
        case 2:
          this.enterOuterAlt(localctx, 2);
          {
            this.state = 265;
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
    this.enterRule(localctx, 48, GoParser.RULE_block);
    let _la: number;
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 268;
        this.match(GoParser.L_BRACE);
        this.state = 274;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        while (((_la & ~0x1f) === 0 && ((1 << _la) & 1612966910) !== 0) || _la === 32 || _la === 42) {
          {
            {
              this.state = 269;
              this.stmt();
              this.state = 270;
              this.eos();
            }
          }
          this.state = 276;
          this._errHandler.sync(this);
          _la = this._input.LA(1);
        }
        this.state = 277;
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
    this.enterRule(localctx, 50, GoParser.RULE_unaryOp);
    let _la: number;
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 279;
        _la = this._input.LA(1);
        if (!(((_la - 29) & ~0x1f) === 0 && ((1 << (_la - 29)) & 11) !== 0)) {
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
  public binaryOp(): BinaryOpContext {
    let localctx: BinaryOpContext = new BinaryOpContext(this, this._ctx, this.state);
    this.enterRule(localctx, 52, GoParser.RULE_binaryOp);
    try {
      this.state = 284;
      this._errHandler.sync(this);
      switch (this._input.LA(1)) {
        case 33:
        case 34:
          this.enterOuterAlt(localctx, 1);
          {
            this.state = 281;
            this.logicalOp();
          }
          break;
        case 35:
        case 36:
        case 37:
        case 38:
        case 39:
        case 40:
          this.enterOuterAlt(localctx, 2);
          {
            this.state = 282;
            this.relOp();
          }
          break;
        case 29:
        case 30:
        case 31:
        case 41:
          this.enterOuterAlt(localctx, 3);
          {
            this.state = 283;
            this.numericOp();
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
  public logicalOp(): LogicalOpContext {
    let localctx: LogicalOpContext = new LogicalOpContext(this, this._ctx, this.state);
    this.enterRule(localctx, 54, GoParser.RULE_logicalOp);
    let _la: number;
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 286;
        _la = this._input.LA(1);
        if (!(_la === 33 || _la === 34)) {
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
    this.enterRule(localctx, 56, GoParser.RULE_relOp);
    let _la: number;
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 288;
        _la = this._input.LA(1);
        if (!(((_la - 35) & ~0x1f) === 0 && ((1 << (_la - 35)) & 63) !== 0)) {
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
  public numericOp(): NumericOpContext {
    let localctx: NumericOpContext = new NumericOpContext(this, this._ctx, this.state);
    this.enterRule(localctx, 58, GoParser.RULE_numericOp);
    let _la: number;
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 290;
        _la = this._input.LA(1);
        if (!(((_la - 29) & ~0x1f) === 0 && ((1 << (_la - 29)) & 4103) !== 0)) {
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
    this.enterRule(localctx, 60, GoParser.RULE_shortVarDecl);
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 292;
        localctx._lhs = this.lvalueList();
        this.state = 293;
        this.match(GoParser.WALRUS);
        this.state = 294;
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
  public decl(): DeclContext {
    let localctx: DeclContext = new DeclContext(this, this._ctx, this.state);
    this.enterRule(localctx, 62, GoParser.RULE_decl);
    try {
      this.state = 299;
      this._errHandler.sync(this);
      switch (this._input.LA(1)) {
        case 8:
          this.enterOuterAlt(localctx, 1);
          {
            this.state = 296;
            this.funcDecl();
          }
          break;
        case 6:
          this.enterOuterAlt(localctx, 2);
          {
            this.state = 297;
            this.varDecl();
          }
          break;
        case 9:
          this.enterOuterAlt(localctx, 3);
          {
            this.state = 298;
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
    this.enterRule(localctx, 64, GoParser.RULE_typeDecl);
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 301;
        this.match(GoParser.TYPE);
        this.state = 302;
        this.ident();
        this.state = 303;
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
    this.enterRule(localctx, 66, GoParser.RULE_varDecl);
    let _la: number;
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 305;
        this.match(GoParser.VAR);
        this.state = 306;
        this.ident();
        this.state = 307;
        this.type_();
        this.state = 310;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if (_la === 27) {
          {
            this.state = 308;
            this.match(GoParser.ASSIGN);
            this.state = 309;
            this.expr(0);
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
  public funcDecl(): FuncDeclContext {
    let localctx: FuncDeclContext = new FuncDeclContext(this, this._ctx, this.state);
    this.enterRule(localctx, 68, GoParser.RULE_funcDecl);
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 312;
        this.match(GoParser.FUNC);
        this.state = 313;
        this.ident();
        this.state = 314;
        this.signature();
        this.state = 315;
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
    this.enterRule(localctx, 70, GoParser.RULE_signature);
    let _la: number;
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 317;
        this.match(GoParser.L_PAREN);
        this.state = 318;
        this.params();
        this.state = 319;
        this.match(GoParser.R_PAREN);
        this.state = 321;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if (_la === 10 || _la === 12 || _la === 42) {
          {
            this.state = 320;
            this.type_();
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
  public funcBody(): FuncBodyContext {
    let localctx: FuncBodyContext = new FuncBodyContext(this, this._ctx, this.state);
    this.enterRule(localctx, 72, GoParser.RULE_funcBody);
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 323;
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
  public litFunc(): LitFuncContext {
    let localctx: LitFuncContext = new LitFuncContext(this, this._ctx, this.state);
    this.enterRule(localctx, 74, GoParser.RULE_litFunc);
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 325;
        this.match(GoParser.FUNC);
        this.state = 326;
        this.signature();
        this.state = 327;
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
    this.enterRule(localctx, 76, GoParser.RULE_params);
    let _la: number;
    try {
      let _alt: number;
      this.state = 343;
      this._errHandler.sync(this);
      switch (this._interp.adaptivePredict(this._input, 29, this._ctx)) {
        case 1:
          this.enterOuterAlt(localctx, 1);
          {
            this.state = 329;
            this.param();
            this.state = 334;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input, 26, this._ctx);
            while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
              if (_alt === 1) {
                {
                  {
                    this.state = 330;
                    this.match(GoParser.COMMA);
                    this.state = 331;
                    this.param();
                  }
                }
              }
              this.state = 336;
              this._errHandler.sync(this);
              _alt = this._interp.adaptivePredict(this._input, 26, this._ctx);
            }
            this.state = 338;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
            if (_la === 25) {
              {
                this.state = 337;
                this.match(GoParser.COMMA);
              }
            }
          }
          break;
        case 2:
          this.enterOuterAlt(localctx, 2);
          {
            this.state = 341;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
            if (_la === 42) {
              {
                this.state = 340;
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
    this.enterRule(localctx, 78, GoParser.RULE_param);
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 345;
        this.ident();
        this.state = 346;
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
    this.enterRule(localctx, 80, GoParser.RULE_type);
    try {
      this.state = 350;
      this._errHandler.sync(this);
      switch (this._input.LA(1)) {
        case 42:
          this.enterOuterAlt(localctx, 1);
          {
            this.state = 348;
            this.typeName();
          }
          break;
        case 10:
        case 12:
          this.enterOuterAlt(localctx, 2);
          {
            this.state = 349;
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
    this.enterRule(localctx, 82, GoParser.RULE_typeName);
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 352;
        this.ident();
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
    this.enterRule(localctx, 84, GoParser.RULE_typeLit);
    try {
      this.state = 356;
      this._errHandler.sync(this);
      switch (this._input.LA(1)) {
        case 10:
          this.enterOuterAlt(localctx, 1);
          {
            this.state = 354;
            this.structType();
          }
          break;
        case 12:
          this.enterOuterAlt(localctx, 2);
          {
            this.state = 355;
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
    this.enterRule(localctx, 86, GoParser.RULE_channelType);
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 358;
        this.match(GoParser.CHAN);
        this.state = 359;
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
    this.enterRule(localctx, 88, GoParser.RULE_elementType);
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 361;
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
    this.enterRule(localctx, 90, GoParser.RULE_structType);
    let _la: number;
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 363;
        this.match(GoParser.STRUCT);
        this.state = 364;
        this.match(GoParser.L_BRACE);
        this.state = 370;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        while (_la === 42) {
          {
            {
              this.state = 365;
              this.fieldDecl();
              this.state = 366;
              this.eos();
            }
          }
          this.state = 372;
          this._errHandler.sync(this);
          _la = this._input.LA(1);
        }
        this.state = 373;
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
    this.enterRule(localctx, 92, GoParser.RULE_fieldDecl);
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 375;
        this.ident();
        this.state = 376;
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
  public ident(): IdentContext {
    let localctx: IdentContext = new IdentContext(this, this._ctx, this.state);
    this.enterRule(localctx, 94, GoParser.RULE_ident);
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 378;
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
  public identList(): IdentListContext {
    let localctx: IdentListContext = new IdentListContext(this, this._ctx, this.state);
    this.enterRule(localctx, 96, GoParser.RULE_identList);
    let _la: number;
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 380;
        this.ident();
        this.state = 385;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        while (_la === 25) {
          {
            {
              this.state = 381;
              this.match(GoParser.COMMA);
              this.state = 382;
              this.ident();
            }
          }
          this.state = 387;
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
    this.enterRule(localctx, 98, GoParser.RULE_lit);
    try {
      this.state = 393;
      this._errHandler.sync(this);
      switch (this._input.LA(1)) {
        case 1:
        case 2:
          this.enterOuterAlt(localctx, 1);
          {
            this.state = 388;
            this.number_();
          }
          break;
        case 3:
          this.enterOuterAlt(localctx, 2);
          {
            this.state = 389;
            this.litStr();
          }
          break;
        case 13:
          this.enterOuterAlt(localctx, 3);
          {
            this.state = 390;
            this.litNil();
          }
          break;
        case 4:
        case 5:
          this.enterOuterAlt(localctx, 4);
          {
            this.state = 391;
            this.litBool();
          }
          break;
        case 8:
          this.enterOuterAlt(localctx, 5);
          {
            this.state = 392;
            this.litFunc();
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
    this.enterRule(localctx, 100, GoParser.RULE_litNil);
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 395;
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
    this.enterRule(localctx, 102, GoParser.RULE_litStr);
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 397;
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
    this.enterRule(localctx, 104, GoParser.RULE_litBool);
    let _la: number;
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 399;
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
  public number_(): NumberContext {
    let localctx: NumberContext = new NumberContext(this, this._ctx, this.state);
    this.enterRule(localctx, 106, GoParser.RULE_number);
    let _la: number;
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 401;
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
    this.enterRule(localctx, 108, GoParser.RULE_eos);
    let _la: number;
    try {
      this.enterOuterAlt(localctx, 1);
      {
        this.state = 403;
        _la = this._input.LA(1);
        if (!(_la === -1 || _la === 45)) {
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
      case 18:
        return this.expr_sempred(localctx as ExprContext, predIndex);
      case 20:
        return this.primaryExpr_sempred(localctx as PrimaryExprContext, predIndex);
    }
    return true;
  }
  private expr_sempred(localctx: ExprContext, predIndex: number): boolean {
    switch (predIndex) {
      case 0:
        return this.precpred(this._ctx, 1);
    }
    return true;
  }
  private primaryExpr_sempred(localctx: PrimaryExprContext, predIndex: number): boolean {
    switch (predIndex) {
      case 1:
        return this.precpred(this._ctx, 2);
      case 2:
        return this.precpred(this._ctx, 1);
    }
    return true;
  }

  public static readonly _serializedATN: number[] = [
    4, 1, 46, 406, 2, 0, 7, 0, 2, 1, 7, 1, 2, 2, 7, 2, 2, 3, 7, 3, 2, 4, 7, 4, 2, 5, 7, 5, 2, 6, 7, 6, 2, 7, 7, 7, 2, 8,
    7, 8, 2, 9, 7, 9, 2, 10, 7, 10, 2, 11, 7, 11, 2, 12, 7, 12, 2, 13, 7, 13, 2, 14, 7, 14, 2, 15, 7, 15, 2, 16, 7, 16,
    2, 17, 7, 17, 2, 18, 7, 18, 2, 19, 7, 19, 2, 20, 7, 20, 2, 21, 7, 21, 2, 22, 7, 22, 2, 23, 7, 23, 2, 24, 7, 24, 2,
    25, 7, 25, 2, 26, 7, 26, 2, 27, 7, 27, 2, 28, 7, 28, 2, 29, 7, 29, 2, 30, 7, 30, 2, 31, 7, 31, 2, 32, 7, 32, 2, 33,
    7, 33, 2, 34, 7, 34, 2, 35, 7, 35, 2, 36, 7, 36, 2, 37, 7, 37, 2, 38, 7, 38, 2, 39, 7, 39, 2, 40, 7, 40, 2, 41, 7,
    41, 2, 42, 7, 42, 2, 43, 7, 43, 2, 44, 7, 44, 2, 45, 7, 45, 2, 46, 7, 46, 2, 47, 7, 47, 2, 48, 7, 48, 2, 49, 7, 49,
    2, 50, 7, 50, 2, 51, 7, 51, 2, 52, 7, 52, 2, 53, 7, 53, 2, 54, 7, 54, 1, 0, 1, 0, 1, 0, 5, 0, 114, 8, 0, 10, 0, 12,
    0, 117, 9, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 129, 8, 1, 1, 2, 1, 2, 1, 2, 3, 2,
    134, 8, 2, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 3, 3, 141, 8, 3, 1, 4, 1, 4, 3, 4, 145, 8, 4, 1, 5, 1, 5, 1, 5, 1, 5, 1, 6,
    1, 6, 1, 7, 1, 7, 1, 8, 1, 8, 1, 8, 1, 9, 1, 9, 1, 9, 1, 9, 1, 10, 1, 10, 1, 10, 5, 10, 165, 8, 10, 10, 10, 12, 10,
    168, 9, 10, 1, 11, 1, 11, 1, 12, 1, 12, 1, 12, 1, 12, 3, 12, 176, 8, 12, 1, 12, 1, 12, 1, 13, 1, 13, 1, 14, 3, 14,
    183, 8, 14, 1, 14, 1, 14, 3, 14, 187, 8, 14, 1, 14, 1, 14, 3, 14, 191, 8, 14, 1, 15, 1, 15, 1, 15, 1, 15, 1, 15, 1,
    15, 3, 15, 199, 8, 15, 1, 15, 1, 15, 1, 15, 1, 16, 1, 16, 1, 17, 1, 17, 3, 17, 208, 8, 17, 1, 18, 1, 18, 1, 18, 1,
    18, 1, 18, 3, 18, 215, 8, 18, 1, 18, 1, 18, 1, 18, 1, 18, 5, 18, 221, 8, 18, 10, 18, 12, 18, 224, 9, 18, 1, 19, 1,
    19, 1, 19, 5, 19, 229, 8, 19, 10, 19, 12, 19, 232, 9, 19, 1, 20, 1, 20, 1, 20, 3, 20, 237, 8, 20, 1, 20, 1, 20, 1,
    20, 1, 20, 5, 20, 243, 8, 20, 10, 20, 12, 20, 246, 9, 20, 1, 21, 1, 21, 1, 21, 1, 22, 1, 22, 1, 22, 1, 22, 5, 22,
    255, 8, 22, 10, 22, 12, 22, 258, 9, 22, 1, 22, 3, 22, 261, 8, 22, 1, 22, 1, 22, 1, 23, 1, 23, 3, 23, 267, 8, 23, 1,
    24, 1, 24, 1, 24, 1, 24, 5, 24, 273, 8, 24, 10, 24, 12, 24, 276, 9, 24, 1, 24, 1, 24, 1, 25, 1, 25, 1, 26, 1, 26, 1,
    26, 3, 26, 285, 8, 26, 1, 27, 1, 27, 1, 28, 1, 28, 1, 29, 1, 29, 1, 30, 1, 30, 1, 30, 1, 30, 1, 31, 1, 31, 1, 31, 3,
    31, 300, 8, 31, 1, 32, 1, 32, 1, 32, 1, 32, 1, 33, 1, 33, 1, 33, 1, 33, 1, 33, 3, 33, 311, 8, 33, 1, 34, 1, 34, 1,
    34, 1, 34, 1, 34, 1, 35, 1, 35, 1, 35, 1, 35, 3, 35, 322, 8, 35, 1, 36, 1, 36, 1, 37, 1, 37, 1, 37, 1, 37, 1, 38, 1,
    38, 1, 38, 5, 38, 333, 8, 38, 10, 38, 12, 38, 336, 9, 38, 1, 38, 3, 38, 339, 8, 38, 1, 38, 3, 38, 342, 8, 38, 3, 38,
    344, 8, 38, 1, 39, 1, 39, 1, 39, 1, 40, 1, 40, 3, 40, 351, 8, 40, 1, 41, 1, 41, 1, 42, 1, 42, 3, 42, 357, 8, 42, 1,
    43, 1, 43, 1, 43, 1, 44, 1, 44, 1, 45, 1, 45, 1, 45, 1, 45, 1, 45, 5, 45, 369, 8, 45, 10, 45, 12, 45, 372, 9, 45, 1,
    45, 1, 45, 1, 46, 1, 46, 1, 46, 1, 47, 1, 47, 1, 48, 1, 48, 1, 48, 5, 48, 384, 8, 48, 10, 48, 12, 48, 387, 9, 48, 1,
    49, 1, 49, 1, 49, 1, 49, 1, 49, 3, 49, 394, 8, 49, 1, 50, 1, 50, 1, 51, 1, 51, 1, 52, 1, 52, 1, 53, 1, 53, 1, 54, 1,
    54, 1, 54, 0, 2, 36, 40, 55, 0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44,
    46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80, 82, 84, 86, 88, 90, 92, 94, 96, 98, 100,
    102, 104, 106, 108, 0, 7, 2, 0, 29, 30, 32, 32, 1, 0, 33, 34, 1, 0, 35, 40, 2, 0, 29, 31, 41, 41, 1, 0, 4, 5, 1, 0,
    1, 2, 1, 1, 45, 45, 400, 0, 115, 1, 0, 0, 0, 2, 128, 1, 0, 0, 0, 4, 133, 1, 0, 0, 0, 6, 135, 1, 0, 0, 0, 8, 144, 1,
    0, 0, 0, 10, 146, 1, 0, 0, 0, 12, 150, 1, 0, 0, 0, 14, 152, 1, 0, 0, 0, 16, 154, 1, 0, 0, 0, 18, 157, 1, 0, 0, 0,
    20, 161, 1, 0, 0, 0, 22, 169, 1, 0, 0, 0, 24, 171, 1, 0, 0, 0, 26, 179, 1, 0, 0, 0, 28, 182, 1, 0, 0, 0, 30, 198, 1,
    0, 0, 0, 32, 203, 1, 0, 0, 0, 34, 205, 1, 0, 0, 0, 36, 214, 1, 0, 0, 0, 38, 225, 1, 0, 0, 0, 40, 236, 1, 0, 0, 0,
    42, 247, 1, 0, 0, 0, 44, 250, 1, 0, 0, 0, 46, 266, 1, 0, 0, 0, 48, 268, 1, 0, 0, 0, 50, 279, 1, 0, 0, 0, 52, 284, 1,
    0, 0, 0, 54, 286, 1, 0, 0, 0, 56, 288, 1, 0, 0, 0, 58, 290, 1, 0, 0, 0, 60, 292, 1, 0, 0, 0, 62, 299, 1, 0, 0, 0,
    64, 301, 1, 0, 0, 0, 66, 305, 1, 0, 0, 0, 68, 312, 1, 0, 0, 0, 70, 317, 1, 0, 0, 0, 72, 323, 1, 0, 0, 0, 74, 325, 1,
    0, 0, 0, 76, 343, 1, 0, 0, 0, 78, 345, 1, 0, 0, 0, 80, 350, 1, 0, 0, 0, 82, 352, 1, 0, 0, 0, 84, 356, 1, 0, 0, 0,
    86, 358, 1, 0, 0, 0, 88, 361, 1, 0, 0, 0, 90, 363, 1, 0, 0, 0, 92, 375, 1, 0, 0, 0, 94, 378, 1, 0, 0, 0, 96, 380, 1,
    0, 0, 0, 98, 393, 1, 0, 0, 0, 100, 395, 1, 0, 0, 0, 102, 397, 1, 0, 0, 0, 104, 399, 1, 0, 0, 0, 106, 401, 1, 0, 0,
    0, 108, 403, 1, 0, 0, 0, 110, 111, 3, 62, 31, 0, 111, 112, 3, 108, 54, 0, 112, 114, 1, 0, 0, 0, 113, 110, 1, 0, 0,
    0, 114, 117, 1, 0, 0, 0, 115, 113, 1, 0, 0, 0, 115, 116, 1, 0, 0, 0, 116, 1, 1, 0, 0, 0, 117, 115, 1, 0, 0, 0, 118,
    129, 3, 62, 31, 0, 119, 129, 3, 34, 17, 0, 120, 129, 3, 24, 12, 0, 121, 129, 3, 12, 6, 0, 122, 129, 3, 14, 7, 0,
    123, 129, 3, 6, 3, 0, 124, 129, 3, 16, 8, 0, 125, 129, 3, 10, 5, 0, 126, 129, 3, 48, 24, 0, 127, 129, 3, 4, 2, 0,
    128, 118, 1, 0, 0, 0, 128, 119, 1, 0, 0, 0, 128, 120, 1, 0, 0, 0, 128, 121, 1, 0, 0, 0, 128, 122, 1, 0, 0, 0, 128,
    123, 1, 0, 0, 0, 128, 124, 1, 0, 0, 0, 128, 125, 1, 0, 0, 0, 128, 126, 1, 0, 0, 0, 128, 127, 1, 0, 0, 0, 129, 3, 1,
    0, 0, 0, 130, 134, 3, 18, 9, 0, 131, 134, 3, 60, 30, 0, 132, 134, 3, 32, 16, 0, 133, 130, 1, 0, 0, 0, 133, 131, 1,
    0, 0, 0, 133, 132, 1, 0, 0, 0, 134, 5, 1, 0, 0, 0, 135, 136, 5, 17, 0, 0, 136, 137, 3, 36, 18, 0, 137, 140, 3, 48,
    24, 0, 138, 139, 5, 18, 0, 0, 139, 141, 3, 8, 4, 0, 140, 138, 1, 0, 0, 0, 140, 141, 1, 0, 0, 0, 141, 7, 1, 0, 0, 0,
    142, 145, 3, 6, 3, 0, 143, 145, 3, 48, 24, 0, 144, 142, 1, 0, 0, 0, 144, 143, 1, 0, 0, 0, 145, 9, 1, 0, 0, 0, 146,
    147, 3, 36, 18, 0, 147, 148, 5, 32, 0, 0, 148, 149, 3, 36, 18, 0, 149, 11, 1, 0, 0, 0, 150, 151, 5, 15, 0, 0, 151,
    13, 1, 0, 0, 0, 152, 153, 5, 16, 0, 0, 153, 15, 1, 0, 0, 0, 154, 155, 5, 14, 0, 0, 155, 156, 3, 40, 20, 0, 156, 17,
    1, 0, 0, 0, 157, 158, 3, 20, 10, 0, 158, 159, 5, 27, 0, 0, 159, 160, 3, 38, 19, 0, 160, 19, 1, 0, 0, 0, 161, 166, 3,
    22, 11, 0, 162, 163, 5, 25, 0, 0, 163, 165, 3, 22, 11, 0, 164, 162, 1, 0, 0, 0, 165, 168, 1, 0, 0, 0, 166, 164, 1,
    0, 0, 0, 166, 167, 1, 0, 0, 0, 167, 21, 1, 0, 0, 0, 168, 166, 1, 0, 0, 0, 169, 170, 3, 94, 47, 0, 170, 23, 1, 0, 0,
    0, 171, 175, 5, 11, 0, 0, 172, 176, 3, 26, 13, 0, 173, 176, 3, 28, 14, 0, 174, 176, 3, 30, 15, 0, 175, 172, 1, 0, 0,
    0, 175, 173, 1, 0, 0, 0, 175, 174, 1, 0, 0, 0, 176, 177, 1, 0, 0, 0, 177, 178, 3, 48, 24, 0, 178, 25, 1, 0, 0, 0,
    179, 180, 3, 36, 18, 0, 180, 27, 1, 0, 0, 0, 181, 183, 3, 4, 2, 0, 182, 181, 1, 0, 0, 0, 182, 183, 1, 0, 0, 0, 183,
    184, 1, 0, 0, 0, 184, 186, 5, 26, 0, 0, 185, 187, 3, 26, 13, 0, 186, 185, 1, 0, 0, 0, 186, 187, 1, 0, 0, 0, 187,
    188, 1, 0, 0, 0, 188, 190, 5, 26, 0, 0, 189, 191, 3, 4, 2, 0, 190, 189, 1, 0, 0, 0, 190, 191, 1, 0, 0, 0, 191, 29,
    1, 0, 0, 0, 192, 193, 3, 38, 19, 0, 193, 194, 5, 27, 0, 0, 194, 199, 1, 0, 0, 0, 195, 196, 3, 96, 48, 0, 196, 197,
    5, 28, 0, 0, 197, 199, 1, 0, 0, 0, 198, 192, 1, 0, 0, 0, 198, 195, 1, 0, 0, 0, 199, 200, 1, 0, 0, 0, 200, 201, 5,
    19, 0, 0, 201, 202, 3, 36, 18, 0, 202, 31, 1, 0, 0, 0, 203, 204, 3, 36, 18, 0, 204, 33, 1, 0, 0, 0, 205, 207, 5, 7,
    0, 0, 206, 208, 3, 36, 18, 0, 207, 206, 1, 0, 0, 0, 207, 208, 1, 0, 0, 0, 208, 35, 1, 0, 0, 0, 209, 210, 6, 18, -1,
    0, 210, 215, 3, 40, 20, 0, 211, 212, 3, 50, 25, 0, 212, 213, 3, 36, 18, 2, 213, 215, 1, 0, 0, 0, 214, 209, 1, 0, 0,
    0, 214, 211, 1, 0, 0, 0, 215, 222, 1, 0, 0, 0, 216, 217, 10, 1, 0, 0, 217, 218, 3, 52, 26, 0, 218, 219, 3, 36, 18,
    2, 219, 221, 1, 0, 0, 0, 220, 216, 1, 0, 0, 0, 221, 224, 1, 0, 0, 0, 222, 220, 1, 0, 0, 0, 222, 223, 1, 0, 0, 0,
    223, 37, 1, 0, 0, 0, 224, 222, 1, 0, 0, 0, 225, 230, 3, 36, 18, 0, 226, 227, 5, 25, 0, 0, 227, 229, 3, 36, 18, 0,
    228, 226, 1, 0, 0, 0, 229, 232, 1, 0, 0, 0, 230, 228, 1, 0, 0, 0, 230, 231, 1, 0, 0, 0, 231, 39, 1, 0, 0, 0, 232,
    230, 1, 0, 0, 0, 233, 234, 6, 20, -1, 0, 234, 237, 3, 94, 47, 0, 235, 237, 3, 98, 49, 0, 236, 233, 1, 0, 0, 0, 236,
    235, 1, 0, 0, 0, 237, 244, 1, 0, 0, 0, 238, 239, 10, 2, 0, 0, 239, 243, 3, 44, 22, 0, 240, 241, 10, 1, 0, 0, 241,
    243, 3, 42, 21, 0, 242, 238, 1, 0, 0, 0, 242, 240, 1, 0, 0, 0, 243, 246, 1, 0, 0, 0, 244, 242, 1, 0, 0, 0, 244, 245,
    1, 0, 0, 0, 245, 41, 1, 0, 0, 0, 246, 244, 1, 0, 0, 0, 247, 248, 5, 20, 0, 0, 248, 249, 3, 94, 47, 0, 249, 43, 1, 0,
    0, 0, 250, 251, 5, 23, 0, 0, 251, 256, 3, 46, 23, 0, 252, 253, 5, 25, 0, 0, 253, 255, 3, 46, 23, 0, 254, 252, 1, 0,
    0, 0, 255, 258, 1, 0, 0, 0, 256, 254, 1, 0, 0, 0, 256, 257, 1, 0, 0, 0, 257, 260, 1, 0, 0, 0, 258, 256, 1, 0, 0, 0,
    259, 261, 5, 25, 0, 0, 260, 259, 1, 0, 0, 0, 260, 261, 1, 0, 0, 0, 261, 262, 1, 0, 0, 0, 262, 263, 5, 24, 0, 0, 263,
    45, 1, 0, 0, 0, 264, 267, 3, 36, 18, 0, 265, 267, 3, 80, 40, 0, 266, 264, 1, 0, 0, 0, 266, 265, 1, 0, 0, 0, 267, 47,
    1, 0, 0, 0, 268, 274, 5, 21, 0, 0, 269, 270, 3, 2, 1, 0, 270, 271, 3, 108, 54, 0, 271, 273, 1, 0, 0, 0, 272, 269, 1,
    0, 0, 0, 273, 276, 1, 0, 0, 0, 274, 272, 1, 0, 0, 0, 274, 275, 1, 0, 0, 0, 275, 277, 1, 0, 0, 0, 276, 274, 1, 0, 0,
    0, 277, 278, 5, 22, 0, 0, 278, 49, 1, 0, 0, 0, 279, 280, 7, 0, 0, 0, 280, 51, 1, 0, 0, 0, 281, 285, 3, 54, 27, 0,
    282, 285, 3, 56, 28, 0, 283, 285, 3, 58, 29, 0, 284, 281, 1, 0, 0, 0, 284, 282, 1, 0, 0, 0, 284, 283, 1, 0, 0, 0,
    285, 53, 1, 0, 0, 0, 286, 287, 7, 1, 0, 0, 287, 55, 1, 0, 0, 0, 288, 289, 7, 2, 0, 0, 289, 57, 1, 0, 0, 0, 290, 291,
    7, 3, 0, 0, 291, 59, 1, 0, 0, 0, 292, 293, 3, 20, 10, 0, 293, 294, 5, 28, 0, 0, 294, 295, 3, 38, 19, 0, 295, 61, 1,
    0, 0, 0, 296, 300, 3, 68, 34, 0, 297, 300, 3, 66, 33, 0, 298, 300, 3, 64, 32, 0, 299, 296, 1, 0, 0, 0, 299, 297, 1,
    0, 0, 0, 299, 298, 1, 0, 0, 0, 300, 63, 1, 0, 0, 0, 301, 302, 5, 9, 0, 0, 302, 303, 3, 94, 47, 0, 303, 304, 3, 80,
    40, 0, 304, 65, 1, 0, 0, 0, 305, 306, 5, 6, 0, 0, 306, 307, 3, 94, 47, 0, 307, 310, 3, 80, 40, 0, 308, 309, 5, 27,
    0, 0, 309, 311, 3, 36, 18, 0, 310, 308, 1, 0, 0, 0, 310, 311, 1, 0, 0, 0, 311, 67, 1, 0, 0, 0, 312, 313, 5, 8, 0, 0,
    313, 314, 3, 94, 47, 0, 314, 315, 3, 70, 35, 0, 315, 316, 3, 72, 36, 0, 316, 69, 1, 0, 0, 0, 317, 318, 5, 23, 0, 0,
    318, 319, 3, 76, 38, 0, 319, 321, 5, 24, 0, 0, 320, 322, 3, 80, 40, 0, 321, 320, 1, 0, 0, 0, 321, 322, 1, 0, 0, 0,
    322, 71, 1, 0, 0, 0, 323, 324, 3, 48, 24, 0, 324, 73, 1, 0, 0, 0, 325, 326, 5, 8, 0, 0, 326, 327, 3, 70, 35, 0, 327,
    328, 3, 72, 36, 0, 328, 75, 1, 0, 0, 0, 329, 334, 3, 78, 39, 0, 330, 331, 5, 25, 0, 0, 331, 333, 3, 78, 39, 0, 332,
    330, 1, 0, 0, 0, 333, 336, 1, 0, 0, 0, 334, 332, 1, 0, 0, 0, 334, 335, 1, 0, 0, 0, 335, 338, 1, 0, 0, 0, 336, 334,
    1, 0, 0, 0, 337, 339, 5, 25, 0, 0, 338, 337, 1, 0, 0, 0, 338, 339, 1, 0, 0, 0, 339, 344, 1, 0, 0, 0, 340, 342, 3,
    78, 39, 0, 341, 340, 1, 0, 0, 0, 341, 342, 1, 0, 0, 0, 342, 344, 1, 0, 0, 0, 343, 329, 1, 0, 0, 0, 343, 341, 1, 0,
    0, 0, 344, 77, 1, 0, 0, 0, 345, 346, 3, 94, 47, 0, 346, 347, 3, 82, 41, 0, 347, 79, 1, 0, 0, 0, 348, 351, 3, 82, 41,
    0, 349, 351, 3, 84, 42, 0, 350, 348, 1, 0, 0, 0, 350, 349, 1, 0, 0, 0, 351, 81, 1, 0, 0, 0, 352, 353, 3, 94, 47, 0,
    353, 83, 1, 0, 0, 0, 354, 357, 3, 90, 45, 0, 355, 357, 3, 86, 43, 0, 356, 354, 1, 0, 0, 0, 356, 355, 1, 0, 0, 0,
    357, 85, 1, 0, 0, 0, 358, 359, 5, 12, 0, 0, 359, 360, 3, 88, 44, 0, 360, 87, 1, 0, 0, 0, 361, 362, 3, 80, 40, 0,
    362, 89, 1, 0, 0, 0, 363, 364, 5, 10, 0, 0, 364, 370, 5, 21, 0, 0, 365, 366, 3, 92, 46, 0, 366, 367, 3, 108, 54, 0,
    367, 369, 1, 0, 0, 0, 368, 365, 1, 0, 0, 0, 369, 372, 1, 0, 0, 0, 370, 368, 1, 0, 0, 0, 370, 371, 1, 0, 0, 0, 371,
    373, 1, 0, 0, 0, 372, 370, 1, 0, 0, 0, 373, 374, 5, 22, 0, 0, 374, 91, 1, 0, 0, 0, 375, 376, 3, 94, 47, 0, 376, 377,
    3, 80, 40, 0, 377, 93, 1, 0, 0, 0, 378, 379, 5, 42, 0, 0, 379, 95, 1, 0, 0, 0, 380, 385, 3, 94, 47, 0, 381, 382, 5,
    25, 0, 0, 382, 384, 3, 94, 47, 0, 383, 381, 1, 0, 0, 0, 384, 387, 1, 0, 0, 0, 385, 383, 1, 0, 0, 0, 385, 386, 1, 0,
    0, 0, 386, 97, 1, 0, 0, 0, 387, 385, 1, 0, 0, 0, 388, 394, 3, 106, 53, 0, 389, 394, 3, 102, 51, 0, 390, 394, 3, 100,
    50, 0, 391, 394, 3, 104, 52, 0, 392, 394, 3, 74, 37, 0, 393, 388, 1, 0, 0, 0, 393, 389, 1, 0, 0, 0, 393, 390, 1, 0,
    0, 0, 393, 391, 1, 0, 0, 0, 393, 392, 1, 0, 0, 0, 394, 99, 1, 0, 0, 0, 395, 396, 5, 13, 0, 0, 396, 101, 1, 0, 0, 0,
    397, 398, 5, 3, 0, 0, 398, 103, 1, 0, 0, 0, 399, 400, 7, 4, 0, 0, 400, 105, 1, 0, 0, 0, 401, 402, 7, 5, 0, 0, 402,
    107, 1, 0, 0, 0, 403, 404, 7, 6, 0, 0, 404, 109, 1, 0, 0, 0, 35, 115, 128, 133, 140, 144, 166, 175, 182, 186, 190,
    198, 207, 214, 222, 230, 236, 242, 244, 256, 260, 266, 274, 284, 299, 310, 321, 334, 338, 341, 343, 350, 356, 370,
    385, 393,
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
  public decl_list(): DeclContext[] {
    return this.getTypedRuleContexts(DeclContext) as DeclContext[];
  }
  public decl(i: number): DeclContext {
    return this.getTypedRuleContext(DeclContext, i) as DeclContext;
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
  public ident(): IdentContext {
    return this.getTypedRuleContext(IdentContext, 0) as IdentContext;
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
  public exprList(): ExprListContext {
    return this.getTypedRuleContext(ExprListContext, 0) as ExprListContext;
  }
  public ASSIGN(): TerminalNode {
    return this.getToken(GoParser.ASSIGN, 0);
  }
  public identList(): IdentListContext {
    return this.getTypedRuleContext(IdentListContext, 0) as IdentListContext;
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
  public expr(): ExprContext {
    return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
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
  public binaryOp(): BinaryOpContext {
    return this.getTypedRuleContext(BinaryOpContext, 0) as BinaryOpContext;
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
  public ident(): IdentContext {
    return this.getTypedRuleContext(IdentContext, 0) as IdentContext;
  }
  public lit(): LitContext {
    return this.getTypedRuleContext(LitContext, 0) as LitContext;
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
  public ident(): IdentContext {
    return this.getTypedRuleContext(IdentContext, 0) as IdentContext;
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
  public arg_list(): ArgContext[] {
    return this.getTypedRuleContexts(ArgContext) as ArgContext[];
  }
  public arg(i: number): ArgContext {
    return this.getTypedRuleContext(ArgContext, i) as ArgContext;
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

export class BinaryOpContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public logicalOp(): LogicalOpContext {
    return this.getTypedRuleContext(LogicalOpContext, 0) as LogicalOpContext;
  }
  public relOp(): RelOpContext {
    return this.getTypedRuleContext(RelOpContext, 0) as RelOpContext;
  }
  public numericOp(): NumericOpContext {
    return this.getTypedRuleContext(NumericOpContext, 0) as NumericOpContext;
  }
  public get ruleIndex(): number {
    return GoParser.RULE_binaryOp;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterBinaryOp) {
      listener.enterBinaryOp(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitBinaryOp) {
      listener.exitBinaryOp(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitBinaryOp) {
      return visitor.visitBinaryOp(this);
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

export class NumericOpContext extends ParserRuleContext {
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
  public STAR(): TerminalNode {
    return this.getToken(GoParser.STAR, 0);
  }
  public DIV(): TerminalNode {
    return this.getToken(GoParser.DIV, 0);
  }
  public get ruleIndex(): number {
    return GoParser.RULE_numericOp;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterNumericOp) {
      listener.enterNumericOp(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitNumericOp) {
      listener.exitNumericOp(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitNumericOp) {
      return visitor.visitNumericOp(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class ShortVarDeclContext extends ParserRuleContext {
  public _lhs!: LvalueListContext;
  public _rhs!: ExprListContext;
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public WALRUS(): TerminalNode {
    return this.getToken(GoParser.WALRUS, 0);
  }
  public lvalueList(): LvalueListContext {
    return this.getTypedRuleContext(LvalueListContext, 0) as LvalueListContext;
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

export class DeclContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public funcDecl(): FuncDeclContext {
    return this.getTypedRuleContext(FuncDeclContext, 0) as FuncDeclContext;
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
  public ident(): IdentContext {
    return this.getTypedRuleContext(IdentContext, 0) as IdentContext;
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
  public ident(): IdentContext {
    return this.getTypedRuleContext(IdentContext, 0) as IdentContext;
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
  public ident(): IdentContext {
    return this.getTypedRuleContext(IdentContext, 0) as IdentContext;
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
  public type_(): TypeContext {
    return this.getTypedRuleContext(TypeContext, 0) as TypeContext;
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
  public ident(): IdentContext {
    return this.getTypedRuleContext(IdentContext, 0) as IdentContext;
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
  public ident(): IdentContext {
    return this.getTypedRuleContext(IdentContext, 0) as IdentContext;
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
  public ident(): IdentContext {
    return this.getTypedRuleContext(IdentContext, 0) as IdentContext;
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

export class IdentContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public WORD(): TerminalNode {
    return this.getToken(GoParser.WORD, 0);
  }
  public get ruleIndex(): number {
    return GoParser.RULE_ident;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterIdent) {
      listener.enterIdent(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitIdent) {
      listener.exitIdent(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitIdent) {
      return visitor.visitIdent(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}

export class IdentListContext extends ParserRuleContext {
  constructor(parser?: GoParser, parent?: ParserRuleContext, invokingState?: number) {
    super(parent, invokingState);
    this.parser = parser;
  }
  public ident_list(): IdentContext[] {
    return this.getTypedRuleContexts(IdentContext) as IdentContext[];
  }
  public ident(i: number): IdentContext {
    return this.getTypedRuleContext(IdentContext, i) as IdentContext;
  }
  public COMMA_list(): TerminalNode[] {
    return this.getTokens(GoParser.COMMA);
  }
  public COMMA(i: number): TerminalNode {
    return this.getToken(GoParser.COMMA, i);
  }
  public get ruleIndex(): number {
    return GoParser.RULE_identList;
  }
  public enterRule(listener: GoParserListener): void {
    if (listener.enterIdentList) {
      listener.enterIdentList(this);
    }
  }
  public exitRule(listener: GoParserListener): void {
    if (listener.exitIdentList) {
      listener.exitIdentList(this);
    }
  }
  // @Override
  public accept<Result>(visitor: GoParserVisitor<Result>): Result {
    if (visitor.visitIdentList) {
      return visitor.visitIdentList(this);
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
