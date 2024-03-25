import { ParserRuleContext } from "antlr4";
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
} from "./instructions";

class BytecodeWriter implements Emitter {
  private _code: DataView;
  private _wc: number;

  constructor(codeLen: number = 1028) {
    // @todo: how do we determine the size? should we make it resizable?
    this._code = new DataView(new ArrayBuffer(codeLen));
    this._wc = 0;
  }

  code(): DataView {
    return this._code;
  }
  wc(): number {
    return this._wc;
  }

  /* Reserves space in the bytecode for an instruction corresponding to some opcode. */
  reserve(opcode: Opcode, size: number): number {
    const ret = this._wc;
    this._code.setUint8(this._wc, opcode);
    this._wc += size;
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
    return [ctx.ident().getText()];
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
  bytecode: BytecodeWriter;
  env: CompileTimeEnvironment;

  main: number | undefined; // keep track of where the main function starts

  constructor() {
    super();
    this.bytecode = new BytecodeWriter();
    this.env = new CompileTimeEnvironment();
  }

  static scanDecls = (ctx: ParserRuleContext): string[] => {
    const scanner = new DeclScanner();
    return scanner.visit(ctx);
  };

  visitProg = (ctx: ProgContext) => {
    const names = Assembler.scanDecls(ctx);
    this.env.pushFrame(names);

    ctx.decl_list().forEach((decl) => {
      this.visit(decl);
      IPop.emit(this.bytecode);
    });

    if (!this.main) {
      throw new Error("A [main] function was not declared");
    }

    // We'll need to jump to [main] to start running the program. So we just
    // append a call instruction to the end of the program.

    ILoadC.emit(this.bytecode).setVal(this.main); // load [main]'s address
    ICall.emit(this.bytecode).setArgc(0); // call [main]
    IDone.emit(this.bytecode); // last instruction
  };

  visitSmt = (ctx: StmtContext) => {
    this.visitChildren(ctx);
    // Each statement is expected to leave *something* on the operand stack.
    // We don't *have* to do this but it makes things easier.
    IPop.emit(this.bytecode);
  };

  visitFuncDecl = (ctx: FuncDeclContext) => {
    const ldf = ILoadFn.emit(this.bytecode);
    const goto = IGoto.emit(this.bytecode);
    const params = ctx
      .signature()
      .params()
      .param_list()
      .map((param) => {
        return param.ident().getText();
      });

    const fnPc = this.bytecode.wc();

    ldf.setPc(fnPc).setArgc(params.length);

    this.env.pushFrame(params);
    this.visit(ctx.funcBody()); // compile the body
    this.env.popFrame();

    // @todo: do we need to insert a return instruction? also handle non-returning funcs?

    goto.setWhere(this.bytecode.wc());

    // We need to explicitly handle the assignment instruction here, since our function
    // declarations with [func] are not re-written into simple assignment statements.
    //
    // This is a limitation of not working with an AST.
    const fnName = ctx.ident().getText();
    const [frame, offset] = this.env.lookup(fnName);
    ILoadNameLoc.emit(this.bytecode).setFrame(frame).setOffset(offset);
    IAssign.emit(this.bytecode);

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
      ILoadNameLoc.emit(this.bytecode).setFrame(frame).setOffset(offset);
      IAssign.emit(this.bytecode);
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
    IReturn.emit(this.bytecode);
  };

  visitForStmt = (ctx: ForStmtContext) => {
    // There are three kinds of [for] loops.
    if (ctx.condition()) {
      // It's like a while loop.
      const startAddr = this.bytecode.wc();
      this.visit(ctx.condition());
      const jof = IJof.emit(this.bytecode);
      this.visit(ctx.block());
      IGoto.emit(this.bytecode).setWhere(startAddr);
      const endAddr = this.bytecode.wc();
      jof.setWhere(endAddr);
    } else if (ctx.forClause()) {
      // C-style for loop
    } else if (ctx.rangeClause()) {
      // range statement ahhh
    } else {
      // impossible
      throw new Error("Entered unreachable code");
    }
  };

  visitIfStmt = (ctx: IfStmtContext) => {
    this.visit(ctx._cond); // compile the condition
    const jof = IJof.emit(this.bytecode);
    this.visit(ctx._cons); // compile consequent
    const goto = IGoto.emit(this.bytecode);
    jof.setWhere(this.bytecode.wc());
    this.visit(ctx.alt());
    goto.setWhere(this.bytecode.wc());
  };

  visitBlock = (ctx: BlockContext) => {
    const names = Assembler.scanDecls(ctx);
    this.env.pushFrame(names);

    IEnterBlock.emit(this.bytecode);
    this.visitChildren(ctx); // compile each statement
    IExitBlock.emit(this.bytecode);

    this.env.popFrame();
  };

  visitAssignment = (ctx: AssignmentContext) => {
    this.visit(ctx._rhs);
    this.visit(ctx._lhs);
    IAssign.emit(this.bytecode);
  };

  visitShortVarDecl = (ctx: ShortVarDeclContext) => {
    this.visit(ctx.expr()); // compile RHS

    const ident = ctx.ident().getText();
    const [frame, offset] = this.env.lookup(ident);
    ILoadNameLoc.emit(this.bytecode).setFrame(frame).setOffset(offset);

    IAssign.emit(this.bytecode);
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
      const argc = args.arg_list.length;

      this.visit(args); // emit code to evaluate each arg
      this.visit(fn); // emit code to evaluate the callable thing

      const call = ICall.emit(this.bytecode);
      call.setArgc(argc);
    } else if (ctx._base) {
      // @todo: figure out this shit
    }
  };

  visitNumericOp = (ctx: NumericOpContext) => {
    const op = IBinaryOp.emit(this.bytecode);

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
    const op = IBinaryOp.emit(this.bytecode);
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
    ILoadName.emit(this.bytecode).setFrame(frame).setOffset(offset);
  };

  visitNumber = (ctx: NumberContext) => {
    const val = parseInt(ctx.getText());
    ILoadC.emit(this.bytecode).setVal(val);
  };
}
