import { ParserRuleContext, CharStream, CommonTokenStream } from "antlr4";
import GoLexer from "../antlr/GoLexer";
import GoParser from "../antlr/GoParser";
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
} from "./instructions";
import { ArrayStack, Stack } from "./util";
import { builtins } from "./heapviews";

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
    return [ctx.lvalue().getText()];
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

export class Assembler extends GoVisitor<void> {
  bc: BytecodeWriter;
  env: CompileTimeEnvironment;

  main: number | undefined; // keep track of where the main function starts

  contiss: Stack<IGoto[]>;
  breakss: Stack<IGoto[]>;

  constructor() {
    super();
    this.bc = new BytecodeWriter();
    this.env = new CompileTimeEnvironment();
    this.contiss = new ArrayStack();
    this.breakss = new ArrayStack();

    this.env.pushFrame(builtins);
  }

  static scanDecls = (ctx: ParserRuleContext): string[] => {
    const scanner = new DeclScanner();
    return scanner.visit(ctx);
  };

  visitProg = (ctx: ProgContext) => {
    const names = Assembler.scanDecls(ctx);
    this.env.pushFrame(names);

    // Wrap the entire program in a block. Don't care about exiting the block.
    IEnterBlock.emit(this.bc, ctx).setNumVars(names.length);

    // @todo: we need to let individual stmts handle this
    ctx.decl_list().forEach((decl) => {
      this.visit(decl);
      IPop.emit(this.bc, decl);
    });

    if (!this.main) {
      throw new Error("A [main] function was not declared");
    }

    // We'll need to jump to [main] to start running the program. So we just
    // append a call instruction to the end of the program.

    const [frame, offset] = this.env.lookup("main");
    ILoadName.emit(this.bc).setFrame(frame).setOffset(offset);
    ICall.emit(this.bc).setArgc(0); // call [main]
    IDone.emit(this.bc); // last instruction
  };

  visitSmt = (ctx: StmtContext) => {
    this.visitChildren(ctx);
    // Each statement is expected to leave *something* on the operand stack.
    // We don't *have* to do this but it makes things easier.
    IPop.emit(this.bc, ctx);
  };

  visitFuncDecl = (ctx: FuncDeclContext) => {
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
    IPush.emit(this.bc); // for now, just push some garbage
    IReturn.emit(this.bc);

    goto.setWhere(this.bc.wc());

    // We need to explicitly handle the assignment instruction here, since our function
    // declarations with [func] are not re-written into simple assignment statements.
    //
    // This is a limitation of not working with an AST.
    const fnName = ctx.ident().getText();
    const [frame, offset] = this.env.lookup(fnName);
    ILoadNameLoc.emit(this.bc, ctx).setFrame(frame).setOffset(offset);
    IAssign.emit(this.bc, ctx);

    // Check if this function is, in fact, main
    if (fnName === "main") {
      if (this.main) {
        throw new Error("Multiple [main] functions declared");
      }
      this.main = fnPc;
    }
  };

  visitVarDecl = (ctx: VarDeclContext) => {
    if (ctx.expr()) {
      this.visit(ctx.expr()); // compile RHS
      const ident = ctx.ident().getText();
      const [frame, offset] = this.env.lookup(ident);
      ILoadNameLoc.emit(this.bc, ctx).setFrame(frame).setOffset(offset);
      IAssign.emit(this.bc, ctx);
    } else {
      // @todo: need to find a way to handle default initialization
      //
      // perhaps we can have a global representing "uninitialized"? and then initialize it when
      // we first access the value?
      console.log(`variable ${ctx.ident().getText()} was default initialized`);
    }
  };

  visitTypeDecl = (ctx: TypeDeclContext) => {
    // @todo: wtf to do for type declarations?
  };

  visitReturnStmt = (ctx: ReturnStmtContext) => {
    // @todo handle empty return statements!
    this.visit(ctx.expr()); // compile the thing to return
    IReturn.emit(this.bc, ctx);
  };

  visitForStmt = (ctx: ForStmtContext) => {
    this.contiss.push([]);
    this.breakss.push([]);

    const processContinuesAndBreaks = (startAddr: number) => {
      // Process continues and breaks.
      const contis = this.contiss.pop();
      const breaks = this.breakss.pop();
      if (contis.length > 0) {
        contis.forEach((conti) => conti.setWhere(startAddr));
      }
      if (breaks.length > 0) {
        breaks.forEach((brk) => brk.setWhere(this.bc.wc()));

        // We need to insert an [ExitBlock] here, because a break statement
        // would not exit the block as per normal.
        IExitBlock.emit(this.bc);
      }
    };

    // There are three kinds of [for] loops.
    if (ctx.condition()) {
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

      if (init.shortVarDecl()) {
        // We may be declaring a variable. In which case we'll create a new
        // block surrounding this for statement, with that new variable inside.
        IEnterBlock.emit(this.bc).setNumVars(1);
        const ident = init.shortVarDecl().lvalue().getText();
        this.env.pushFrame([ident]);
      }

      this.visit(init);
      const startAddr = this.bc.wc();
      this.visit(cond);
      const jof = IJof.emit(this.bc);
      this.visit(ctx.block());
      this.visit(post);
      IGoto.emit(this.bc).setWhere(startAddr);

      processContinuesAndBreaks(startAddr);

      const endAddr = this.bc.wc();
      jof.setWhere(endAddr);

      if (init.shortVarDecl()) {
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
  };

  visitBreakStmt = (_: BreakStmtContext) => {
    const goto = IGoto.emit(this.bc);
    this.breakss.peek().push(goto);
  };

  visitContinueStmt = (_: ContinueStmtContext) => {
    const goto = IGoto.emit(this.bc);
    this.contiss.peek().push(goto);
  };

  visitIfStmt = (ctx: IfStmtContext) => {
    this.visit(ctx._cond); // compile the condition
    const jof = IJof.emit(this.bc);
    this.visit(ctx._cons); // compile consequent
    const goto = IGoto.emit(this.bc);
    jof.setWhere(this.bc.wc());
    if (ctx.alt()) {
      this.visit(ctx.alt());
    }
    goto.setWhere(this.bc.wc());
  };

  visitBlock = (ctx: BlockContext) => {
    const names = Assembler.scanDecls(ctx);
    this.env.pushFrame(names);

    IEnterBlock.emit(this.bc).setNumVars(names.length);
    // @todo: we need to let individual stmts handle this
    ctx.stmt_list().forEach((decl) => {
      this.visit(decl);
      IPop.emit(this.bc);
    });
    IExitBlock.emit(this.bc);

    this.env.popFrame();
  };

  visitGoStmt = (ctx: GoStmtContext) => {
    // @todo
  };

  visitSendStmt = (ctx: SendStmtContext) => {
    // @todo
  };

  visitLvalue = (ctx: LvalueContext) => {
    const ident = ctx.ident().getText();
    const [frame, offset] = this.env.lookup(ident);
    ILoadNameLoc.emit(this.bc).setFrame(frame).setOffset(offset);
  };

  visitAssignment = (ctx: AssignmentContext) => {
    this.visit(ctx._rhs);
    this.visit(ctx._lhs);
    IAssign.emit(this.bc);
  };

  visitShortVarDecl = (ctx: ShortVarDeclContext) => {
    this.visit(ctx.expr());
    this.visit(ctx.lvalue());
    IAssign.emit(this.bc);
  };

  visitExpr = (ctx: ExprContext) => {
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
  };

  visitPrimaryExpr = (ctx: PrimaryExprContext) => {
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
  };

  visitNumericOp = (ctx: NumericOpContext) => {
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
  };

  visitRelOp = (ctx: RelOpContext) => {
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
  };

  visitIdent = (ctx: IdentContext) => {
    const ident = ctx.getText();
    const [frame, offset] = this.env.lookup(ident);
    ILoadName.emit(this.bc).setFrame(frame).setOffset(offset);
  };

  visitNumber = (ctx: NumberContext) => {
    const val = parseInt(ctx.getText());
    ILoadC.emit(this.bc).setVal(val);
  };
}

/**
 * Compiles given source code into bytecode.
 */
export const compileSrc = (src: string): [DataView, Map<number, number>] => {
  const chars = new CharStream(src);
  const lexer = new GoLexer(chars);
  const tokens = new CommonTokenStream(lexer);
  const parser = new GoParser(tokens);
  const tree = parser.prog();

  const ass = new Assembler();
  ass.visit(tree);

  return [ass.bc.code(), ass.bc.srcMap()];
};
