import { ParserRuleContext, CharStream, CommonTokenStream } from "antlr4";
import GoLexer from "../antlr/GoLexer";
import GoParser, {
  ExprListContext,
  FieldContext,
  LitStrContext,
  LitStructContext,
  LnameContext,
  StructTypeContext,
  TypeContext,
} from "../antlr/GoParser";
import {
  AssignmentContext,
  BlockContext,
  ExprContext,
  FuncDeclContext,
  NameContext,
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
  IPackStruct,
  IGetStructField,
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

class CompTimeEnv {
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

  lookup(name: string): [number, number] {
    for (let i = 0; i < this.env.length; ++i) {
      const frame = this.env[i];
      const offset = frame.indexOf(name);
      if (offset !== -1) {
        return [i, offset];
      }
    }
    // @todo: is it ok to throw an Error here?
    throw new Error(`Identifier [${name}] not found in compile time environment`);
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
    return [ctx.name().getText()];
  };

  visitVarDecl = (ctx: VarDeclContext) => {
    return [ctx.name().getText()];
  };

  visitShortVarDecl = (ctx: ShortVarDeclContext) => {
    return ctx
      .lnameList()
      .lname_list()
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

const getTypeRepr = (ctx: TypeContext, store: TypeStore): TypeRepr | undefined => {
  if (ctx.typeName()) {
    return store.lookup(ctx.typeName().getText());
  } else if (ctx.typeLit()) {
    const lit = ctx.typeLit();
    if (lit.structType()) {
      return getTypeReprStruct(lit.structType());
    } else if (lit.channelType()) {
      // @todo
      throw new Error("Unimplemented");
    } else {
      throw new Error("Unreachable");
    }
  } else {
    throw new Error("Unreachable");
  }
};

const getTypeReprStruct = (ctx: StructTypeContext): StructType => {
  const fs = ctx.fieldDecl_list();
  const fields: [string, string][] = fs.map((field) => {
    const name = field.name().getText();
    const ty = field.type_().getText();
    return [name, ty];
  });
  return { kind: "struct", fields };
};

class TypeDeclScanner extends GoVisitor<[string, TypeRepr][]> {
  private stop: boolean = false;
  private store: TypeStore;
  constructor(store: TypeStore) {
    super();
    this.store = store;
  }
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
  visitTypeDecl = (ctx: TypeDeclContext) => {
    const name = ctx.name().getText();
    const ty = getTypeRepr(ctx.type_(), this.store);
    if (ty === undefined) {
      throw new Error(`Could not find type for ${name}`);
    }
    return [[name, ty] as [string, TypeRepr]];
  };
  visitChildren(node: ParserRuleContext): [string, TypeRepr][] {
    if (!node.children) return [];
    return node.children.flatMap((child) => this.visit(child)).filter((ty) => ty !== undefined);
  }
}

type TypeRepr = StructType | ChannelType | PrimitiveType | FuncType;
type StructType = {
  kind: "struct";
  fields: [string, string][];
};
type ChannelType = {
  kind: "chan";
  elem: string;
};
type PrimitiveType = {
  kind: "primitive";
  name: PrimitiveTypeName;
};
type FuncType = {
  kind: "func";
  params: TypeRepr[];
  results: TypeRepr[];
};

const arraysEqual = <T>(xs: T[], ys: T[], equal: (x: T, y: T) => boolean): boolean => {
  if (xs.length !== ys.length) return false;
  for (let i = 0; i < xs.length; ++i) {
    const x = xs[i];
    const y = ys[i];
    if (!equal(x, y)) return false;
  }
  return true;
};

const areTypesEqual = (lhs: TypeRepr, rhs: TypeRepr): boolean => {
  if (lhs.kind !== rhs.kind) return false;
  let _rhs;
  switch (lhs.kind) {
    case "struct":
      _rhs = rhs as StructType;
      return arraysEqual(lhs.fields, _rhs.fields, (a, b) => a[0] === b[0] && a[1] === b[1]);
    case "chan":
      _rhs = rhs as ChannelType;
      return lhs.elem === _rhs.elem;
    case "primitive":
      _rhs = rhs as PrimitiveType;
      return lhs.name === _rhs.name;
    case "func":
      _rhs = rhs as FuncType;
      return (
        arraysEqual(lhs.params, _rhs.params, (u, v) => u === v) && arraysEqual(lhs.results, _rhs.results, areTypesEqual)
      );
  }
};

type PrimitiveTypeName = "int64" | "float64" | "bool" | "string";
const makePrimitive = (name: PrimitiveTypeName): PrimitiveType => ({ kind: "primitive", name });
const primitiveTypes: Map<string, PrimitiveType> = new Map([
  ["int", makePrimitive("int64")],
  ["float", makePrimitive("float64")],
  ["int64", makePrimitive("int64")],
  ["float64", makePrimitive("float64")],
  ["bool", makePrimitive("bool")],
  ["string", makePrimitive("string")],
]);

// const builtinFuncTypes: Map<string, TypeRepr> = new Map([
//   ["dbg", {kind: "func", params: [], results: []}],
//   ["log", {kind: "func", params: [], results: []}],
// ])

type TypeFrame = Map<string, TypeRepr>;
class TypeStore {
  // Type declarations themselves are scoped. So we'll need an "environment" for them.
  frames: TypeFrame[] = []; // search from left -> right
  pushFrame(types: Map<string, TypeRepr>) {
    this.frames.unshift(types);
  }
  popFrame() {
    this.frames.unshift();
  }
  lookup(typeName: string): TypeRepr | undefined {
    for (const frame of this.frames) {
      const repr = frame.get(typeName);
      if (repr !== undefined) return repr;
    }
    return undefined;
  }
}
class TypeEnv {
  private frames: Map<string, TypeRepr>[] = []; // search from left -> right
  pushFrame() {
    this.frames.unshift(new Map());
  }
  pushFrame_(frame: Map<string, TypeRepr>) {
    this.frames.unshift(frame);
  }
  popFrame() {
    this.frames.unshift();
  }
  lookup(name: string): TypeRepr | undefined {
    for (const frame of this.frames) {
      const ty = frame.get(name);
      if (ty !== undefined) return ty;
    }
    return undefined;
  }
  set(name: string, ty: TypeRepr) {
    this.frames[0].set(name, ty);
  }
}

class Typer extends GoVisitor<TypeRepr[] | undefined> {
  store: TypeStore;
  env: TypeEnv;
  constructor(store: TypeStore, env: TypeEnv) {
    super();
    this.store = store;
    this.env = env;
  }
  visitExpr = (ctx: ExprContext) => {
    if (ctx.binaryOp()) {
      const lhs = this.visit(ctx._lhs);
      const rhs = this.visit(ctx._rhs);
      if (lhs === undefined || rhs === undefined) {
        return undefined;
      }
      // @todo we're assuming all binary operations take the same types?
      if (!arraysEqual(lhs, rhs, areTypesEqual)) return undefined;
      return lhs;
    } else if (ctx.unaryOp()) {
      throw new Error("Unimplemented");
    } else if (ctx.primaryExpr()) {
      return this.visit(ctx.primaryExpr());
    } else {
      throw new Error("Unreachable");
    }
  };
  visitPrimaryExpr = (ctx: PrimaryExprContext): TypeRepr[] | undefined => {
    if (ctx.lit()) {
      return this.visit(ctx.lit());
    } else if (ctx.name()) {
      return this.visit(ctx.name());
    } else if (ctx._fn) {
      const ty = this.visit(ctx._fn);
      if (ty === undefined || ty.length === 0 || ty[0].kind !== "func") return undefined;
      return ty[0].results;
    } else if (ctx._base) {
      const baseType = this.visit(ctx._base);
      if (baseType === undefined) return undefined;
      const final = ctx.selector().name().getText();
      if (baseType.length > 1) {
        // Doesn't make sense.
        return undefined;
      }
      switch (baseType[0].kind) {
        case "struct":
          const field = baseType[0].fields.find(([name, _]) => name === final);
          if (field === undefined) return undefined;
          const ret = this.store.lookup(field[1]);
          if (ret === undefined) return ret;
          return [ret];
        default:
          return undefined;
      }
    }
  };
  visitLitStruct = (ctx: LitStructContext): TypeRepr[] | undefined => {
    if (ctx.typeName()) {
      // @todo Should we type-check the fields?
      const ret = this.store.lookup(ctx.typeName().getText());
      if (ret === undefined) return ret;
      return [ret];
    } else if (ctx.structType()) {
      return [getTypeReprStruct(ctx.structType())];
    } else {
      throw new Error("Unreachable");
    }
  };
  visitNumber = (ctx: NumberContext): TypeRepr[] | undefined => {
    if (ctx.INT()) {
      return [{ kind: "primitive", name: "int64" }];
    } else if (ctx.FLOAT()) {
      return [{ kind: "primitive", name: "float64" }];
    } else {
      throw new Error("Unreachable");
    }
  };
  visitName = (ctx: NameContext): TypeRepr[] | undefined => {
    const ret = this.env.lookup(ctx.getText());
    if (ret === undefined) return ret;
    return [ret];
  };
  visitChildren(node: ParserRuleContext): TypeRepr[] | undefined {
    if (!node.children) return undefined;
    const ret = node.children
      .flatMap((child) => this.visit(child))
      .filter((child) => child !== undefined) as TypeRepr[];
    if (ret.length === 0) return undefined;
    return ret;
  }
}

class FuncTypeBumper extends GoVisitor<void> {
  tenv: TypeEnv;
  tstore: TypeStore;
  constructor(tenv: TypeEnv, tstore: TypeStore) {
    super();
    this.tenv = tenv;
    this.tstore = tstore;
  }
  visitFuncDecl = (ctx: FuncDeclContext) => {
    const fname = ctx.name().getText();
    const _params = ctx
      .signature()
      .params()
      .param_list()
      .map((param) => this.tstore.lookup(param.typeName().getText()));
    const _results = ctx
      .signature()
      .funcResult()
      .type__list()
      .map((ty) => getTypeRepr(ty, this.tstore));
    if (_results.includes(undefined) || _params.includes(undefined)) {
      throw new Error(`Could not determine function type for ${fname}`);
    }
    const params = _params as TypeRepr[];
    const results = _results as TypeRepr[];
    this.tenv.set(fname, { kind: "func", params, results });
  };
}

export class Assembler extends GoVisitor<number> {
  bc: BytecodeWriter;
  env: CompTimeEnv;
  tenv: TypeEnv;
  tstore: TypeStore;

  main: number | undefined; // keep track of where the main function starts

  contiss: Stack<[IGoto[], number]>;
  breakss: Stack<[IGoto[], number]>;

  strPool: StrPool;

  constructor() {
    super();
    this.bc = new BytecodeWriter();
    this.env = new CompTimeEnv();
    this.contiss = new ArrayStack();
    this.breakss = new ArrayStack();
    this.strPool = new StrPool();

    this.tenv = new TypeEnv();
    this.tstore = new TypeStore();

    this.env.pushFrame(builtinSymbols);
    this.tenv.pushFrame();
    this.tstore.pushFrame(primitiveTypes);
  }

  scanDecls = (ctx: ParserRuleContext): string[] => {
    const scanner = new DeclScanner();
    return scanner.visit(ctx);
  };
  scanTypeDecls = (ctx: ParserRuleContext): TypeFrame => {
    const scanner = new TypeDeclScanner(this.tstore);
    const frame = scanner.visit(ctx);
    return new Map(frame);
  };

  visitChildren = (node: ParserRuleContext): number => {
    if (!node.children) return 0;
    return node.children.map((child) => this.visit(child)).reduce((acc, n) => acc + n, 0);
  };

  visitProg = (ctx: ProgContext) => {
    const names = this.scanDecls(ctx);
    this.env.pushFrame(names);
    this.tenv.pushFrame();

    const types = this.scanTypeDecls(ctx);
    this.tstore.pushFrame(types);

    // Before compiling the body, let's push the type of functions.
    new FuncTypeBumper(this.tenv, this.tstore).visit(ctx);

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
        return param.name().getText();
      });

    const fnPc = this.bc.wc();
    ldf.setPc(fnPc).setArgc(params.length);

    this.env.pushFrame(params);
    this.tenv.pushFrame();
    this.visit(ctx.funcBody()); // compile the body
    this.tenv.popFrame();
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
    const fnName = ctx.name().getText();
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
      const name = ctx.name().getText();
      const [frame, offset] = this.env.lookup(name);
      ILoadNameLoc.emit(this.bc, ctx).setFrame(frame).setOffset(offset);
      IAssign.emit(this.bc, ctx).setCount(1);
    } else {
      // perhaps we can have a global representing "uninitialized"? and then initialize it when
      // we first access the value?
      // console.log(`variable ${ctx.name().getText()} was default initialized`);
    }
    // Declarations, even if there is an initializing expression, should leave nothing on the stack.
    return 0;
  };

  visitTypeDecl = (ctx: TypeDeclContext): number => {
    // @todo: is there anything to do for type declarations?
    return 0;
  };

  visitReturnStmt = (ctx: ReturnStmtContext) => {
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
        const names = init
          .shortVarDecl()
          .lnameList()
          .lname_list()
          .map((lvalue) => lvalue.getText());
        this.env.pushFrame(names);
        this.tenv.pushFrame();
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
        this.tenv.popFrame();
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
    const names = this.scanDecls(ctx);
    this.env.pushFrame(names);
    this.tenv.pushFrame();

    const types = this.scanTypeDecls(ctx);
    this.tstore.pushFrame(types);

    IEnterBlock.emit(this.bc).setNumVars(names.length);
    this.visitChildren(ctx);
    IExitBlock.emit(this.bc);

    this.tenv.popFrame();
    this.env.popFrame();
    this.tstore.popFrame();
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

  visitLname = (ctx: LnameContext): number => {
    const name = ctx.getText();
    const [frame, offset] = this.env.lookup(name);
    ILoadNameLoc.emit(this.bc).setFrame(frame).setOffset(offset);
    return 1;
  };

  visitField = (ctx: FieldContext): number => {
    // @todo LValue field
    return 0;
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
    const nnames = ctx._lhs.lname_list().length;
    this.visit(ctx._rhs);
    this.visit(ctx._lhs);
    IAssign.emit(this.bc).setCount(nnames);

    const rhsTypes = ctx._rhs.expr_list().flatMap((expr) => new Typer(this.tstore, this.tenv).visit(expr));
    if (rhsTypes.length !== nnames) {
      throw new Error(`There are ${nnames} on LHS but ${rhsTypes.length} on RHS`);
    }
    for (let i = 0; i < nnames; ++i) {
      const lhs = ctx._lhs.lname_list()[i].getText();
      const ty = rhsTypes[i];
      if (ty === undefined) {
        throw new Error(`Could not determine type for ${lhs}`);
      }
      this.tenv.set(lhs, ty);
    }
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
    if (ctx.name()) {
      this.visit(ctx.name());
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
      const baseType = new Typer(this.tstore, this.tenv).visit(ctx._base);
      if (baseType === undefined || baseType.length === 0) {
        throw new Error(`Could not deduce type for ${ctx.getText()}`);
      }
      if (baseType.length > 1) {
        throw new Error(`Bad dot access on ${ctx.getText()} - multiple values on LHS`);
      }
      switch (baseType[0].kind) {
        case "struct":
          const final = ctx.selector().name().getText();
          const offset = baseType[0].fields.findIndex(([name, _]) => name === final);
          if (offset === -1) {
            throw new Error(`Field ${final} does not exist on ${ctx._base.getText()}`);
          }
          this.visit(ctx._base); // get the base onto the OS
          IGetStructField.emit(this.bc).setOffset(offset);
          break;
        default:
          throw new Error("Expected struct");
      }
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

  visitName = (ctx: NameContext): number => {
    const name = ctx.getText();
    const [frame, offset] = this.env.lookup(name);
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
    let val = 0;
    const raw = ctx.getText();
    if (ctx.INT()) {
      val = parseInt(raw);
    } else if (ctx.FLOAT()) {
      val = parseFloat(raw);
    } else {
      throw new Error("Unreachable");
    }
    ILoadC.emit(this.bc).setVal(val);
    return 1;
  };

  visitLitStruct = (ctx: LitStructContext): number => {
    const sortFields = <T>(givenFields: [string, T][], expectedFields: [string, string][]): [string, T][] => {
      const ret: [string, T][] = [];
      for (const [name1, _] of expectedFields) {
        for (const [name2, t] of givenFields) {
          if (name1 !== name2) continue;
          ret.push([name2, t]);
          break;
        }
      }
      return ret;
    };
    if (ctx.typeName()) {
      const ty = ctx.typeName().getText();
      const repr = this.tstore.lookup(ty);
      if (repr === undefined) {
        throw new Error(`Type ${ty} is not declared`);
      }
      switch (repr.kind) {
        case "struct":
          const fieldc = repr.fields.length;
          const fields = ctx
            .keyedElems()
            .keyedElem_list()
            .map((elem) => [elem.lname().getText(), elem.expr()] as [string, ExprContext]);
          const sorted = sortFields(fields, repr.fields);
          if (sorted.length !== fieldc) {
            throw new Error("Some fields are missing"); // @todo btr err msg
          }
          sorted.reverse().forEach(([_, expr]) => this.visit(expr)); // compile each field's expression
          IPackStruct.emit(this.bc).setFieldc(fieldc);
          break;
        case "chan":
        case "primitive":
          throw new Error(`Expectd struct type, but got ${repr.kind}`);
      }
    } else if (ctx.structType()) {
      const repr = getTypeReprStruct(ctx.structType());
      // @todo or we just don't allow it i.e. it would be a parse error
      throw new Error("Unimplemented");
    } else {
      throw new Error("Unreachable");
    }
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
