import { ParserRuleContext, CharStream, CommonTokenStream, RuleNode } from "antlr4";
import GoLexer from "../antlr/GoLexer";
import GoParser, { ExprListContext, LitStrContext } from "../antlr/GoParser";
import {
  AssignmentContext,
  BlockContext,
  ExprContext,
  FuncDeclContext,
  IdentContext,
  IfStmtContext,
  PrimaryExprContext,
  ReturnStmtContext,
  TypeDeclContext,
  VarDeclContext,
  StmtContext,
  ProgContext,
  ShortVarDeclContext,
  NumberContext,
  NumericOpContext,
  ForStmtContext,
  RelOpContext,
  LvalueContext,
  BreakStmtContext,
  ContinueStmtContext,
  GoStmtContext,
  SendStmtContext,
} from "../antlr/GoParser";
import GoVisitor from "../antlr/GoParserVisitor";

import {
  IAssign,
  Emitter,
  IEnterBlock,
  IExitBlock,
  IGoto,
  ILoadNameLoc,
  IJof,
  ILoadFn,
  Opcode,
  ICall,
  ILoadName,
  IReturn,
  IPop,
  ILoadC,
  IDone,
  IBinaryOp,
  BinaryOp,
  IPush,
  ILoadStr,
  IPackTuple,
} from "./instructions";
import { ArrayStack, Stack, StrPool } from "./util";
import { builtinSymbols } from "./heapviews";

class BytecodeWriter implements Emitter {
  private _code: DataView;
  private _wc: number;
  /**
   * Map from bytecode address to source line number, for debugging.
   */
  private _srcMap: Map<number, number>;

  constructor(codeLen: number = 1028) {
    // @todo: how do we determine the size? should we make it resizable?
    this._code = new DataView(new ArrayBuffer(codeLen));
    this._wc = 0;
    this._srcMap = new Map();
  }

  code(): DataView {
    return this._code;
  }
  wc(): number {
    return this._wc;
  }
  srcMap(): Map<number, number> {
    return this._srcMap;
  }

  /* Reserves space in the bytecode for an instruction corresponding to some opcode. Size is given in bytes. */
  reserve(opcode: Opcode, size: number, ctx?: ParserRuleContext): number {
    const ret = this._wc;

    this._code.setUint8(this._wc, opcode);
    this._wc += size;

    if (ctx) {
      this._srcMap.set(ret, ctx.start.line);
    }

    return ret;
  }
}

class CompileTimeEnvironment {
  private env: string[][];

  constructor() {
    this.env = [];
  }

  pushFrame(frame: string[]) {
    this.env.unshift(frame);
  }

  popFrame() {
    this.env.shift();
  }

  lookup(ident: string): [number, number] {
    for (let i = 0; i < this.env.length; ++i) {
      const frame = this.env[i];
      const offset = frame.indexOf(ident);
      if (offset !== -1) {
        return [i, offset];
      }
    }
    // @todo: is it ok to throw an Error here?
    throw new Error(`Identifier [${ident}] not found in compile time environment`);
  }

  depth(): number {
    return this.env.length;
  }
}

/**
 * Tool for collecting all identifiers declared within a context, e.g. block or
 * program's top level.
 *
 * Use by calling the [visit] method on any context.
 */
class DeclScanner extends GoVisitor<string[]> {
  stop: boolean = false;

  visitFuncDecl = (ctx: FuncDeclContext) => {
    return [ctx.ident().getText()];
  };

  visitVarDecl = (ctx: VarDeclContext) => {
    return [ctx.ident().getText()];
  };

  visitShortVarDecl = (ctx: ShortVarDeclContext) => {
    return ctx
      .lvalueList()
      .lvalue_list()
      .map((lvalue) => lvalue.getText());
  };

  visitForStmt = (_: ForStmtContext) => {
    // An annoying case to handle separately. Since [for] statements can actually declare
    // variables, but we don't want to include that when scanning a program or block.
    //
    // The for loop's iteration variables will be handled explicitly when compiling the for loop
    // code.
    return [];
  };

  visitProg = (ctx: ProgContext) => {
    if (this.stop) return [];
    this.stop = true;
    return this.visitChildren(ctx);
  };

  visitBlock = (ctx: BlockContext) => {
    if (this.stop) return [];
    this.stop = true;
    return this.visitChildren(ctx);
  };

  visitChildren(node: ParserRuleContext): string[] {
    if (!node.children) return [];
    return node.children.flatMap((child) => this.visit(child)).filter((name) => name !== undefined);
  }
}

export class Assembler extends GoVisitor<number> {
  bc: BytecodeWriter;
  env: CompileTimeEnvironment;

  main: number | undefined; // keep track of where the main function starts

  contiss: Stack<[IGoto[], number]>;
  breakss: Stack<[IGoto[], number]>;

  strPool: StrPool;

  constructor() {
    super();
    this.bc = new BytecodeWriter();
    this.env = new CompileTimeEnvironment();
    this.contiss = new ArrayStack();
    this.breakss = new ArrayStack();
    this.strPool = new StrPool();

    this.env.pushFrame(builtinSymbols);
  }

  static scanDecls = (ctx: ParserRuleContext): string[] => {
    const scanner = new DeclScanner();
    return scanner.visit(ctx);
  };

  visitChildren = (node: ParserRuleContext): number => {
    if (!node.children) return 0;
    return node.children.map((child) => this.visit(child)).reduce((acc, n) => acc + n, 0);
  };

  visitProg = (ctx: ProgContext) => {
    const names = Assembler.scanDecls(ctx);
    this.env.pushFrame(names);

    // Wrap the entire program in a block. Don't care about exiting the block.
    IEnterBlock.emit(this.bc, ctx).setNumVars(names.length);

    this.visitChildren(ctx);

    if (!this.main) {
      throw new Error("A [main] function was not declared");
    }

    // We'll need to jump to [main] to start running the program. So we just
    // append a call instruction to the end of the program.

    const [frame, offset] = this.env.lookup("main");
    ILoadName.emit(this.bc).setFrame(frame).setOffset(offset);
    ICall.emit(this.bc).setArgc(0); // call [main]
    IDone.emit(this.bc); // last instruction

    return 0;
  };

  visitStmt = (ctx: StmtContext): number => {
    const leftOnStk = this.visitChildren(ctx);
    for (let i = 0; i < leftOnStk; ++i) {
      IPop.emit(this.bc, ctx);
    }
    return 0;
  };

  visitFuncDecl = (ctx: FuncDeclContext): number => {
    const ldf = ILoadFn.emit(this.bc, ctx);
    const goto = IGoto.emit(this.bc);
    const params = ctx
      .signature()
      .params()
      .param_list()
      .map((param) => {
        return param.ident().getText();
      });

    const fnPc = this.bc.wc();

    ldf.setPc(fnPc).setArgc(params.length);

    this.env.pushFrame(params);
    this.visit(ctx.funcBody()); // compile the body
    this.env.popFrame();

    // @todo: also handle non-returning funcs - this involves pushing "undefined"
    // onto the OS, but we haven't defined undefined yet!
    //
    // Note that we *always* emit this, even if the function body has explicit
    // return statement(s). These instructions will not affect those functions
    // (since we'll never reach these lines). Instead these are meant for functions
    // without return statements.
    //
    // @todo: allow multiple return values (then we won't have the issues above)
    IPush.emit(this.bc); // for now, just push some garbage, we should use Nil or something, probabaly
    IReturn.emit(this.bc);

    goto.setWhere(this.bc.wc());

    // We need to explicitly handle the assignment instruction here, since our function
    // declarations with [func] are not re-written into simple assignment statements.
    //
    // This is a limitation of not working with an AST.
    const fnName = ctx.ident().getText();
    const [frame, offset] = this.env.lookup(fnName);
    ILoadNameLoc.emit(this.bc, ctx).setFrame(frame).setOffset(offset);
    IAssign.emit(this.bc, ctx).setCount(1);

    // Check if this function is, in fact, main
    if (fnName === "main") {
      if (this.main) {
        throw new Error("Multiple [main] functions declared");
      }
      this.main = fnPc;
    }

    // There will be one item on the operand stack - the closure's address
    return 1;
  };

  visitVarDecl = (ctx: VarDeclContext): number => {
    if (ctx.expr()) {
      this.visit(ctx.expr()); // compile RHS
      const ident = ctx.ident().getText();
      const [frame, offset] = this.env.lookup(ident);
      ILoadNameLoc.emit(this.bc, ctx).setFrame(frame).setOffset(offset);
      IAssign.emit(this.bc, ctx).setCount(1);
    } else {
      // IPush.emit(this.bc); // @todo: FIXME we just pushin dummy stuff for now
      // @todo: need to find a way to handle default initialization
      //
      // perhaps we can have a global representing "uninitialized"? and then initialize it when
      // we first access the value?
      // console.log(`variable ${ctx.ident().getText()} was default initialized`);
    }
    // Declarations, even if there is an initializing expression, should leave nothing on the stack.
    return 0;
  };

  visitTypeDecl = (ctx: TypeDeclContext): number => {
    // @todo: wtf to do for type declarations?
    return 0;
  };

  visitReturnStmt = (ctx: ReturnStmtContext) => {
    // @todo handle empty return statements! - we probably can just check if the list is empty, then push Nil or something?
    const n = this.visit(ctx.exprList()); // compile the thing to return
    IReturn.emit(this.bc, ctx);
    return n;
  };

  visitForStmt = (ctx: ForStmtContext): number => {
    const recordDepth = () => {
      const curDepth = this.env.depth();
      this.contiss.push([[], curDepth]);
      this.breakss.push([[], curDepth]);
    };
    /**
     * Call this at the location where break statements should jump to!
     */
    const processContinuesAndBreaks = (postAddr: number) => {
      // Process continues and breaks.
      const [contis] = this.contiss.pop();
      const [breaks] = this.breakss.pop();
      contis.forEach((conti) => conti.setWhere(postAddr));
      breaks.forEach((brk) => brk.setWhere(this.bc.wc()));
    };

    // There are three kinds of [for] loops.
    if (ctx.condition()) {
      recordDepth();

      // basically a while loop
      const startAddr = this.bc.wc();
      this.visit(ctx.condition());
      const jof = IJof.emit(this.bc, ctx.condition());
      this.visit(ctx.block());
      IGoto.emit(this.bc, ctx).setWhere(startAddr);

      processContinuesAndBreaks(startAddr);

      const endAddr = this.bc.wc();
      jof.setWhere(endAddr);
    } else if (ctx.forClause()) {
      // C-style for loop
      const init = ctx.forClause()._init;
      const cond = ctx.forClause()._cond;
      const post = ctx.forClause()._post;

      const hasLoopVar = init !== undefined && init.shortVarDecl();

      if (hasLoopVar) {
        // We may be declaring a variable. In which case we'll create a new
        // block surrounding this for statement, with that new variable inside.
        IEnterBlock.emit(this.bc).setNumVars(1);
        const idents = init
          .shortVarDecl()
          .lvalueList()
          .lvalue_list()
          .map((lvalue) => lvalue.getText());
        this.env.pushFrame(idents);
      }

      recordDepth();

      if (init) this.visit(init);
      const startAddr = this.bc.wc();
      if (cond) this.visit(cond);
      const jof = IJof.emit(this.bc);
      this.visit(ctx.block());
      const postAddr = this.bc.wc(); // address of the Post operation
      if (post) this.visit(post);
      IGoto.emit(this.bc).setWhere(startAddr);

      processContinuesAndBreaks(postAddr);

      const endAddr = this.bc.wc();
      jof.setWhere(endAddr);

      if (hasLoopVar) {
        IExitBlock.emit(this.bc);
        this.env.popFrame();
      }
    } else if (ctx.rangeClause()) {
      // Golang special
      // @todo
    } else {
      // impossible
      throw new Error("Entered unreachable code");
    }

    // For loops leave nothing on da stack
    return 0;
  };

  visitBreakStmt = (_: BreakStmtContext): number => {
    const curDepth = this.env.depth();
    const [xs, startDepth] = this.breakss.peek();
    const toClear = curDepth - startDepth;
    for (let i = 0; i < toClear; ++i) {
      IExitBlock.emit(this.bc);
    }
    const goto = IGoto.emit(this.bc);
    xs.push(goto);
    return 0;
  };

  visitContinueStmt = (_: ContinueStmtContext): number => {
    const curDepth = this.env.depth();
    const [xs, startDepth] = this.contiss.peek();
    const toClear = curDepth - startDepth;
    for (let i = 0; i < toClear; ++i) {
      IExitBlock.emit(this.bc);
    }
    const goto = IGoto.emit(this.bc);
    xs.push(goto);
    return 0;
  };

  visitIfStmt = (ctx: IfStmtContext): number => {
    this.visit(ctx._cond); // compile the condition
    const jof = IJof.emit(this.bc);
    this.visit(ctx._cons); // compile consequent
    const goto = IGoto.emit(this.bc);
    jof.setWhere(this.bc.wc());
    if (ctx.alt()) {
      this.visit(ctx.alt());
    }
    goto.setWhere(this.bc.wc());
    return 0;
  };

  visitBlock = (ctx: BlockContext): number => {
    const names = Assembler.scanDecls(ctx);
    this.env.pushFrame(names);

    IEnterBlock.emit(this.bc).setNumVars(names.length);
    this.visitChildren(ctx);
    IExitBlock.emit(this.bc);

    this.env.popFrame();
    return 0;
  };

  visitGoStmt = (ctx: GoStmtContext): number => {
    return 0;
    // @todo
  };

  visitSendStmt = (ctx: SendStmtContext): number => {
    return 0;
    // @todo
  };

  visitLvalue = (ctx: LvalueContext): number => {
    const ident = ctx.ident().getText();
    const [frame, offset] = this.env.lookup(ident);
    ILoadNameLoc.emit(this.bc).setFrame(frame).setOffset(offset);
    return 1;
  };

  visitAssignment = (ctx: AssignmentContext): number => {
    const nnames = ctx._lhs.lvalue_list().length;
    this.visit(ctx._rhs);
    this.visit(ctx._lhs);
    IAssign.emit(this.bc).setCount(nnames);
    return 0;
  };

  visitShortVarDecl = (ctx: ShortVarDeclContext): number => {
    // Identical to [visitAssignment]
    //
    // @todo make them into a common function
    const nnames = ctx._lhs.lvalue_list().length;
    this.visit(ctx._rhs);
    this.visit(ctx._lhs);
    IAssign.emit(this.bc).setCount(nnames);
    return 0;
  };

  visitExpr = (ctx: ExprContext): number => {
    // An expression can be one of three types.
    if (ctx.binaryOp()) {
      this.visit(ctx._lhs);
      this.visit(ctx._rhs);
      this.visit(ctx.binaryOp());
    } else if (ctx.unaryOp()) {
      this.visit(ctx.expr(0));
      this.visit(ctx.unaryOp());
    } else {
      this.visit(ctx.primaryExpr());
    }
    return 1; // resolves to exactly one item on the stack
  };

  visitPrimaryExpr = (ctx: PrimaryExprContext): number => {
    if (ctx.ident()) {
      this.visit(ctx.ident());
    } else if (ctx.lit()) {
      this.visit(ctx.lit());
    } else if (ctx._fn) {
      const args = ctx.args();
      const fn = ctx._fn;
      const argc = args.arg_list().length;

      this.visit(fn); // emit code to evaluate the callable thing
      this.visit(args); // emit code to evaluate each arg

      ICall.emit(this.bc, ctx).setArgc(argc);
    } else if (ctx._base) {
      // @todo: figure out this shit - it means we are accessing a field/method?
    }
    return 1;
  };

  /**
   * Compiles an expression list. Expression lists should only appear on the RHS of
   * assignments (short var decls and assignments).
   *
   * If there is more than 1 expression, we pack it into a tuple.
   */
  visitExprList = (ctx: ExprListContext): number => {
    const len = ctx.expr_list().length;
    this.visitChildren(ctx);
    if (len > 1) {
      IPackTuple.emit(this.bc).setLen(len);
    }
    return 1;
  };

  visitNumericOp = (ctx: NumericOpContext): number => {
    const op = IBinaryOp.emit(this.bc);

    if (ctx.PLUS()) {
      op.setOp(BinaryOp.Add);
    } else if (ctx.MINUS()) {
      op.setOp(BinaryOp.Sub);
    } else if (ctx.STAR()) {
      op.setOp(BinaryOp.Mul);
    } else if (ctx.DIV()) {
      op.setOp(BinaryOp.Div);
    } else {
      throw new Error(`Unexpected numeric operator`); // @todo a better error msg
    }

    return 0;
  };

  visitRelOp = (ctx: RelOpContext): number => {
    const op = IBinaryOp.emit(this.bc);
    if (ctx.EQ()) {
      op.setOp(BinaryOp.Eq);
    } else if (ctx.NEQ()) {
      op.setOp(BinaryOp.Neq);
    } else if (ctx.LESS()) {
      op.setOp(BinaryOp.L);
    } else if (ctx.LEQ()) {
      op.setOp(BinaryOp.Leq);
    } else if (ctx.GREATER()) {
      op.setOp(BinaryOp.G);
    } else if (ctx.GEQ()) {
      op.setOp(BinaryOp.Geq);
    } else {
      throw new Error(`Unexpected relation operator`); // @todo a better error msg
    }
    return 0;
  };

  visitIdent = (ctx: IdentContext): number => {
    const ident = ctx.getText();
    const [frame, offset] = this.env.lookup(ident);
    ILoadName.emit(this.bc).setFrame(frame).setOffset(offset);
    return 1;
  };

  visitLitStr = (ctx: LitStrContext): number => {
    const raw = ctx.getText();
    const val = raw.slice(1, raw.length - 1); // remove the ""
    const id = this.strPool.add(val);
    ILoadStr.emit(this.bc).setId(id);
    return 1;
  };

  visitNumber = (ctx: NumberContext): number => {
    const val = parseInt(ctx.getText());
    ILoadC.emit(this.bc).setVal(val);
    return 1;
  };
}

interface CompileResult {
  bytecode: DataView;
  srcMap: Map<number, number>;
  strPool: StrPool;
}

/**
 * Compiles given source code into bytecode.
 */
export const compileSrc = (src: string): CompileResult => {
  const chars = new CharStream(src);
  const lexer = new GoLexer(chars);
  const tokens = new CommonTokenStream(lexer);
  const parser = new GoParser(tokens);
  const tree = parser.prog();

  const ass = new Assembler();
  ass.visit(tree);

  const bytecode = ass.bc.code();
  const srcMap = ass.bc.srcMap();
  const strPool = ass.strPool;

  return { bytecode, srcMap, strPool };
};
