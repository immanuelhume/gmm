import {
  ParserRuleContext,
  CharStream,
  CommonTokenStream,
  ErrorListener,
  RecognitionException,
  Recognizer,
  Token,
} from "antlr4";
import GoLexer from "../antlr/GoLexer";
import GoParser, {
  ExprListContext,
  FieldContext,
  LitStrContext,
  LitStructContext,
  StructTypeContext,
  TypeContext,
  LogicalOpContext,
  LnameContext,
  UnaryOpContext,
  MethodDeclContext,
  MulOpContext,
  AddOpContext,
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
  ILoadStructField,
  ILoadStructFieldLoc,
  ILogicalOp,
  LogicalOp,
  IUnaryOp,
  UnaryOp,
  ILoadMethod,
} from "./instructions";
import { ArrayStack, Stack, StrPool, allUnique, arraysEqual } from "./util";
import { builtinSymbols } from "./heapviews";
import { assert } from "console";

class BytecodeWriter implements Emitter {
  private _code: DataView;
  private _wc: number;
  /**
   * Map from bytecode address to source line number. Used for debugging only.
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

  /**
   * Reserves space in the bytecode for an instruction corresponding to some
   * opcode. Size is given in bytes.
   **/
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

/**
 * Compile time environment.
 */
class CompTimeEnv {
  private env: string[][]; // search from left -> right

  constructor() {
    this.env = [];
  }

  pushFrame(frame: string[]) {
    this.env.unshift(frame);
  }

  popFrame() {
    this.env.shift();
  }

  lookup(name: string): [number, number] | undefined {
    for (let i = 0; i < this.env.length; ++i) {
      const frame = this.env[i];
      const offset = frame.indexOf(name);
      if (offset !== -1) {
        return [i, offset];
      }
    }
    return undefined;
  }

  lookupExn(name: string, ctx: ParserRuleContext): [number, number] {
    const ret = this.lookup(name);
    if (ret === undefined) {
      err(ctx, `undefined: ${name}`);
    }
    return ret!;
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

  visitMethodDecl = (ctx: MethodDeclContext) => {
    // @todo: pointer types?
    const rcvType = ctx._receiver.typeName().getText();
    const fnName = ctx.name().getText();
    return [rcvType + "::" + fnName];
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
    // An annoying case to handle separately. Since [for] statements can
    // actually declare variables, but we don't want to include that when
    // scanning a program or block.
    //
    // The for loop's iteration variables will be handled explicitly when
    // compiling the for loop code.
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

/**
 * A collection of data and logic related to types at compile time.
 */
namespace Type {
  export type T = {
    name?: string;
    data: Data;
    /**
     * All types can have methods, even function types!
     */
    methods?: Map<string, Func>;
  };

  type Data = Struct | Channel | Primitive | Func;

  export type Struct = {
    kind: "struct";
    /**
     * A mapping from field name to its type name. We use a list instead of a
     * map, because the order is important.
     */
    fields: [string, T][];
  };

  /**
   * @todo: should this be parked under Primitive?
   */
  export type Channel = {
    kind: "chan";
    /**
     * Type of the element which the channel accepts.
     */
    elem: T;
  };

  export type Primitive = {
    kind: "primitive";
    name: Primitive.Name;
  };

  export type Func = {
    kind: "func";
    params: T[];
    results: T[];
  };

  /**
   * Checks if two types are equal.
   */
  export const equal = (lhs: T, rhs: T): boolean => {
    // @note: we could also check if their names match
    return equalData(lhs.data, rhs.data);
  };

  const equalData = (lhs: Data, rhs: Data): boolean => {
    if (lhs.kind !== rhs.kind) return false;
    let _rhs;
    switch (lhs.kind) {
      case "struct":
        _rhs = rhs as Struct;
        return arraysEqual(lhs.fields, _rhs.fields, (a, b) => a[0] === b[0] && equal(a[1], b[1]));
      case "chan":
        _rhs = rhs as Channel;
        return equal(lhs.elem, _rhs.elem);
      case "primitive":
        _rhs = rhs as Primitive;
        return lhs.name === _rhs.name;
      case "func":
        _rhs = rhs as Func;
        return arraysEqual(lhs.params, _rhs.params, equal) && arraysEqual(lhs.results, _rhs.results, equal);
    }
  };

  export const isBool = (t: T | undefined): boolean => {
    if (t === undefined) return false;
    return t.data.kind === "primitive" && t.data.name === "bool";
  };

  /**
   * Tries to find a given field or method on some type t. Fields are checked
   * first, then methods.
   */
  export const findFieldOrMethodExn = (t: T, field: string, ctx: ParserRuleContext): T => {
    if (t.data.kind === "struct") {
      const f = t.data.fields.find(([name, _]) => name === field);
      if (f !== undefined) {
        return f[1];
      }
    }
    const mthd = t.methods?.get(field);
    if (mthd === undefined) {
      err(ctx, `type ${t.name} has no field or method ${field}`);
    }
    return { data: mthd! };
  };

  export namespace Primitive {
    /**
     * Raw names of each kind of primitive.
     */
    export type Name = "int64" | "float64" | "bool" | "string";

    export const make = (name: string, underlying: Name): T => {
      return { name, data: { kind: "primitive", name: underlying } };
    };

    /**
     * A list of the primitive types. This is our "root frame" for the compile
     * time type environment.
     */
    export const types: T[] = [
      make("int", "int64"),
      make("float", "float64"),
      make("int64", "int64"),
      make("float64", "float64"),
      make("bool", "bool"),
      make("string", "string"),
    ];
  }
}

/**
 * Auxiliary stuff for when we are parsing out types, but not resolving them
 * yet - e.g. for a struct like
 *
 *   struct foo bar
 *
 * we'll eventually need to know what "bar" is. But when we first encounter
 * this, we may not have enough information. This is what this namespace
 * contains - intermediate data structures before we resolve full type info.
 */
namespace _Type {
  type T = { name?: string; data: Data; ctx: ParserRuleContext };

  type Data = Struct | Channel | Func | Alias;

  type Struct = {
    kind: "struct";
    fields: [string, string][];
  };

  type Channel = {
    kind: "chan";
    elem: string;
  };

  type Func = {
    kind: "func";
    params: string[];
    results: string[];
  };

  type Alias = {
    kind: "alias";
    alias: string;
  };

  /**
   * Scans type declarations. Does not resolve type references! Everything is stringy.
   */
  export class Scanner extends GoVisitor<T[]> {
    private stop: boolean = false;

    constructor() {
      super();
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
      const data = fromContext(ctx.type_());
      return [{ name, data, ctx }];
    };

    visitChildren(node: ParserRuleContext): T[] {
      if (!node.children) return [];
      return node.children.flatMap((child) => this.visit(child)).filter((ty) => ty !== undefined);
    }
  }

  export const fromContext = (ctx: TypeContext): Data => {
    if (ctx.typeName()) {
      const alias = ctx.typeName().getText();
      return { kind: "alias", alias };
    } else if (ctx.typeLit()) {
      const lit = ctx.typeLit();
      if (lit.structType()) {
        return fromStructContext(lit.structType());
      } else if (lit.channelType()) {
        // @todo
        throw "Channel types are not supported yet";
      } else {
        throw "Unreachable";
      }
    } else {
      throw "Unreachable";
    }
  };

  const fromStructContext = (ctx: StructTypeContext): Struct => {
    const fs = ctx.fieldDecl_list();
    const fields: [string, string][] = fs.map((field) => {
      const name = field.name().getText();
      const ty = field.type_().getText();
      return [name, ty];
    });
    const fnames = fields.map(([name, _]) => name);
    for (let i = 0; i < fnames.length; ++i) {
      for (let j = i + 1; j < fnames.length; ++j) {
        if (fnames[i] === fnames[j]) {
          err(ctx, `multiple declarations of field ${fnames[i]}`);
        }
      }
    }
    return { kind: "struct", fields };
  };

  /**
   * An unreasonably complex function. Resolves full type information for a
   * new frame of types.
   *
   * @param ts    A "frame" of types to resolve
   * @param store The current type store, from previous frames
   */
  export const resolve = (ts: T[], store: TypeStore): Type.T[] => {
    // depth-first searchin' - note that the store would not include types from [ts]
    // -1: unvisited, 0: visiting, 1: visited
    const state: number[] = Array(ts.length).fill(-1);
    const ret: Type.T[] = [];
    const checkFriends = (name: string): number | undefined => {
      for (let i = 0; i < ts.length; ++i) {
        if (ts[i].name === name) return i;
      }
      return undefined;
    };
    const aux = (name: string, ctx: ParserRuleContext): Type.T => {
      const idx = checkFriends(name);
      if (idx === undefined) {
        const t = store.lookupExn(name, ctx);
        return t;
      } else {
        const t = dfs(idx);
        return t;
      }
    };
    const dfs = (i: number): Type.T => {
      if (state[i] == 0) {
        // @todo recursive pointer types should be allowed - think about how to do this
        err(ts[i].ctx, `found recursive type: ${ts[i].name}`);
      } else if (state[i] == 1) {
        return ret[i];
      }
      state[i] = 0;
      const ty = ts[i];
      switch (ty.data.kind) {
        case "struct":
          const fields = ty.data.fields.map(([name, tyname]) => {
            const typ = aux(tyname, ty.ctx);
            return [name, typ] as [string, Type.T];
          });
          state[i] = 1;
          return (ret[i] = { name: ty.name, data: { kind: "struct", fields } });
        case "chan":
          const elem = aux(ty.data.elem, ty.ctx);
          state[i] = 1;
          return (ret[i] = { name: ty.name, data: { kind: "chan", elem } });
        case "func":
          const params = ty.data.params.map((tyname) => aux(tyname, ty.ctx));
          const results = ty.data.results.map((tyname) => aux(tyname, ty.ctx));
          state[i] = 1;
          return (ret[i] = { name: ty.name, data: { kind: "func", params, results } });
        case "alias":
          const alias = aux(ty.data.alias, ty.ctx);
          state[i] = 1;
          return (ret[i] = alias);
      }
    };
    for (let i = 0; i < ts.length; ++i) {
      if (state[i] === 1) continue;
      if (state[i] === 0) {
        throw "Unreachable";
      }
      dfs(i);
    }
    return ret;
  };
}

/**
 * Since type declarations themselves are scoped (e.g. we may have a struct
 * type declared in a function, we'll need to have an "environment" for types,
 * just like we do for variables.
 *
 * We'll call it [TypeStore] to distinguish it from the [TypeEnv] in the
 * lecture notes.
 */
class TypeStore {
  frames: Type.T[][] = []; // search from left -> right

  pushFrame(types: Type.T[]) {
    this.frames.unshift(types);
  }

  popFrame() {
    this.frames.unshift();
  }

  lookup(typeName: string): Type.T | undefined {
    for (const frame of this.frames) {
      for (const t of frame) {
        if (t.name === typeName) {
          return t;
        }
      }
    }
    return undefined;
  }

  lookupExn(typeName: string, ctx: ParserRuleContext): Type.T {
    const ret = this.lookup(typeName);
    if (ret === undefined) {
      err(ctx, `undefined: ${typeName}`);
    }
    return ret!;
  }
}

/**
 * Mapes variable names to their type.
 */
class TypeEnv {
  private frames: Map<string, Type.T>[] = []; // search from left -> right

  pushFrame() {
    this.frames.unshift(new Map());
  }

  pushFrame_(frame: Map<string, Type.T>) {
    this.frames.unshift(frame);
  }

  popFrame() {
    this.frames.unshift();
  }

  lookup(name: string): Type.T | undefined {
    for (const frame of this.frames) {
      const ty = frame.get(name);
      if (ty !== undefined) return ty;
    }
    return undefined;
  }
  lookupExn(name: string, ctx: ParserRuleContext): Type.T {
    const ret = this.lookup(name);
    if (ret === undefined) {
      err(ctx, `undefined: ${name}`);
    }
    return ret!;
  }

  set(name: string, ty: Type.T) {
    this.frames[0].set(name, ty);
  }
}

/**
 * Types a given expression.
 *
 * A list of types is returned. This is because expressions like function calls
 * may return multiple things.
 */
class Typer extends GoVisitor<Type.T[]> {
  store: TypeStore;
  env: TypeEnv;

  constructor(store: TypeStore, env: TypeEnv) {
    super();
    this.store = store;
    this.env = env;
  }

  visitExpr = (ctx: ExprContext): Type.T[] => {
    if (ctx.mulOp() || ctx.addOp() || ctx.relOp()) {
      const lhs = this.visit(ctx._lhs);
      const rhs = this.visit(ctx._rhs);
      if (lhs.length !== 1 || rhs.length !== 1) {
        err(ctx, "invalid operation"); // @todo a better err msg
      }
      // @todo: we should check that the operation and type are indeed correct? e.g. numbers, bools,
      // @todo we're assuming all binary operations take the same types?
      if (!Type.equal(lhs[0], rhs[0])) {
        err(ctx, `invalid operation between ${lhs[0].name} and ${lhs[0].name}`);
      }
      return lhs;
    } else if (ctx.logicalOp()) {
      const lhs = this.visit(ctx._lhs);
      const rhs = this.visit(ctx._rhs);
      if (lhs.length !== 1 || rhs.length !== 1) {
        err(ctx, "invalid operation"); // @todo a better err msg
      }
      if (!Type.isBool(lhs[0]) || !Type.isBool(rhs[0])) {
        err(ctx, `invalid logical operation, expected bool on both sides but got (${lhs[0].name}, ${lhs[0].name})`);
      }
      return [Type.Primitive.make("bool", "bool")];
    } else if (ctx.unaryOp()) {
      // @todo
      throw "Unimplemented";
    } else if (ctx.primaryExpr()) {
      return this.visit(ctx.primaryExpr());
    } else {
      throw "Unreachable";
    }
  };

  visitPrimaryExpr = (ctx: PrimaryExprContext): Type.T[] => {
    if (ctx.lit()) {
      return this.visit(ctx.lit());
    } else if (ctx.name()) {
      return this.visit(ctx.name());
    } else if (ctx._fn) {
      const fnty = this.visit(ctx._fn);
      if (fnty.length !== 1 || fnty[0].data.kind !== "func") {
        err(ctx, `uncallable: ${ctx._fn.getText()}`);
      }
      return (fnty[0].data as Type.Func).results;
    } else if (ctx._base) {
      const _basety = this.visit(ctx._base);
      if (_basety.length !== 1) {
        err(ctx, `bad dot access`); // @todo btr err msg
      }
      const basety = _basety[0];
      const final = ctx.selector().name().getText();
      return [Type.findFieldOrMethodExn(basety, final, ctx)];
    } else {
      throw "Unreachable";
    }
  };

  visitLitStruct = (ctx: LitStructContext): Type.T[] => {
    if (ctx.typeName()) {
      // @todo Should we type-check the fields?
      const ret = this.store.lookupExn(ctx.typeName().getText(), ctx);
      return [ret];
    } else if (ctx.structType()) {
      // @todo: disallow this
      throw "Unimplemented";
    } else {
      throw "Unreachable";
    }
  };

  visitNumber = (ctx: NumberContext): Type.T[] => {
    if (ctx.INT()) {
      return [Type.Primitive.make("int64", "int64")];
    } else if (ctx.FLOAT()) {
      return [Type.Primitive.make("float64", "float64")];
    } else {
      throw "Unreachable";
    }
  };

  visitName = (ctx: NameContext): Type.T[] => {
    return [this.env.lookupExn(ctx.getText(), ctx)];
  };

  visitChildren(node: ParserRuleContext): Type.T[] {
    if (!node.children) return [];
    const ret = node.children.flatMap((child) => this.visit(child)).filter((child) => child !== undefined);
    return ret;
  }
}

/**
 * A utility class to help set the types of function declarations into some
 * [TypeStore]. This is needed since functions may be called before they are
 * declared, and we'll need to know their type information.
 */
class FuncTypeBumper extends GoVisitor<void> {
  private tenv: TypeEnv;
  private tstore: TypeStore;

  constructor(tenv: TypeEnv, tstore: TypeStore) {
    super();
    this.tenv = tenv;
    this.tstore = tstore;
  }

  visitMethodDecl = (ctx: MethodDeclContext) => {
    const params = ctx
      .signature()
      .params()
      .param_list()
      .map((param) => this.tstore.lookupExn(param.typeName().getText(), ctx));
    const results = ctx
      .signature()
      .funcResult()
      .type__list()
      // @todo: disallow anonymous return types?
      .map((ty) => this.tstore.lookupExn(ty.typeName().getText(), ctx));

    // Unlike functions, the type info for a method is not stored in the type
    // environment. Instead we attach it to the type info of the type this
    // method is declared on.
    const rcvType = this.tstore.lookupExn(ctx._receiver.typeName().getText(), ctx);
    const mthdType: Type.Func = { kind: "func", params, results };
    if (rcvType.methods === undefined) {
      rcvType.methods = new Map();
    }
    const fname = ctx.name().getText();
    rcvType.methods.set(fname, mthdType);
  };

  visitFuncDecl = (ctx: FuncDeclContext) => {
    const fname = ctx.name().getText();
    const params = ctx
      .signature()
      .params()
      .param_list()
      .map((param) => this.tstore.lookupExn(param.typeName().getText(), ctx));
    const results = ctx
      .signature()
      .funcResult()
      .type__list()
      // @todo: disallow anonymous return types?
      .map((ty) => this.tstore.lookupExn(ty.typeName().getText(), ctx));
    this.tenv.set(fname, { data: { kind: "func", params, results } });
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
    this.tstore.pushFrame(Type.Primitive.types);
  }

  scanDecls = (ctx: ParserRuleContext): string[] => {
    const scanner = new DeclScanner();
    return scanner.visit(ctx);
  };

  scanTypeDecls = (ctx: ParserRuleContext): Type.T[] => {
    const scanner = new _Type.Scanner();
    const rawtypes = scanner.visit(ctx);
    return _Type.resolve(rawtypes, this.tstore);
  };

  /**
   * Resolves a type when compiling. We assume that any requisite type info
   * is already in the type store.
   */
  resolveTypeExn = (ctx: TypeContext): Type.T => {
    if (ctx.typeName()) {
      return this.tstore.lookupExn(ctx.typeName().getText(), ctx);
    } else if (ctx.typeLit()) {
      const tydata = _Type.fromContext(ctx);
      const ret = _Type.resolve([{ data: tydata, ctx }], this.tstore);
      assert(ret.length === 1);
      return ret[0];
    } else {
      throw "Unreachable";
    }
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
      err(ctx, "main function is undeclared");
    }

    // We'll need to jump to [main] to start running the program. So we just
    // append a call instruction to the end of the program.

    const [frame, offset] = this.env.lookupExn("main", ctx);
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
    this.tenv.pushFrame(); // push a type env frame, and then set types for the params
    ctx
      .signature()
      .params()
      .param_list()
      .forEach((param) => {
        const name = param.name().getText();
        const typ = this.tstore.lookupExn(param.typeName().getText(), param.typeName());
        this.tenv.set(name, typ);
      });
    this.visit(ctx.funcBody()); // compile the body
    this.tenv.popFrame();
    this.env.popFrame();

    // Note that we *always* emit this, even if the function body has explicit
    // return statement(s). These instructions will not affect those functions
    // (since we'll never reach these lines). Instead these are meant for
    // functions without return statements.
    IPush.emit(this.bc); // for now, just push some garbage @todo maybe push Nil or something?
    IReturn.emit(this.bc);

    goto.setWhere(this.bc.wc());

    // We need to explicitly handle the assignment instruction here, since our
    // function declarations with [func] are not re-written into simple
    // assignment statements.
    //
    // This is a limitation of not working with an AST.
    const fnName = ctx.name().getText();
    const [frame, offset] = this.env.lookupExn(fnName, ctx);
    ILoadNameLoc.emit(this.bc, ctx).setFrame(frame).setOffset(offset);
    IAssign.emit(this.bc, ctx).setCount(1);

    // Check if this function is, in fact, main
    if (fnName === "main") {
      if (this.main) {
        err(ctx, "multiple main functions declared");
      }
      this.main = fnPc;
    }

    return 0;
  };

  visitMethodDecl = (ctx: MethodDeclContext): number => {
    const ldf = ILoadFn.emit(this.bc, ctx);
    const goto = IGoto.emit(this.bc);
    const params = ctx
      .signature()
      .params()
      .param_list()
      .map((param) => {
        return param.name().getText();
      });
    const rcvName = ctx._receiver.name().getText();
    params.unshift(rcvName); // insert receiver param name

    const fnPc = this.bc.wc();
    ldf.setPc(fnPc).setArgc(params.length);

    const rcvType = this.tstore.lookupExn(ctx._receiver.typeName().getText(), ctx._receiver);

    this.env.pushFrame(params);
    this.tenv.pushFrame(); // push a type env frame, and then set types for the params
    this.tenv.set(rcvName, rcvType); // also include the receiver's type
    ctx
      .signature()
      .params()
      .param_list()
      .forEach((param) => {
        const name = param.name().getText();
        const typ = this.tstore.lookupExn(param.typeName().getText(), param);
        this.tenv.set(name, typ);
      });
    this.visit(ctx.funcBody()); // compile the body
    this.tenv.popFrame();
    this.env.popFrame();

    IPush.emit(this.bc);
    IReturn.emit(this.bc);

    goto.setWhere(this.bc.wc());

    const fnName = rcvType.name + "::" + ctx.name().getText();
    const [frame, offset] = this.env.lookupExn(fnName, ctx);
    ILoadNameLoc.emit(this.bc, ctx).setFrame(frame).setOffset(offset);
    IAssign.emit(this.bc, ctx).setCount(1);

    return 0;
  };

  visitVarDecl = (ctx: VarDeclContext): number => {
    this.visit(ctx.expr()); // compile RHS
    const name = ctx.name().getText();
    const [frame, offset] = this.env.lookupExn(name, ctx);
    ILoadNameLoc.emit(this.bc, ctx).setFrame(frame).setOffset(offset);
    IAssign.emit(this.bc, ctx).setCount(1);

    // Insert type information about this variable.
    const t = this.resolveTypeExn(ctx.type_());
    this.tenv.set(ctx.name().getText(), t);

    // Declarations, even if there is an initializing expression, should leave
    // nothing on the stack.
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
      throw "Unreachable";
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
    const [frame, offset] = this.env.lookupExn(name, ctx);
    ILoadNameLoc.emit(this.bc).setFrame(frame).setOffset(offset);
    return 1;
  };

  visitField = (ctx: FieldContext): number => {
    const baseType = new Typer(this.tstore, this.tenv).visit(ctx._base);
    if (baseType.length === 0) {
      err(ctx, `could not determine type of ${ctx._base.getText()}`);
    }
    const ty = baseType![0];
    switch (ty.data.kind) {
      case "struct":
        const last = ctx._last.text;
        const offset = ty.data.fields.findIndex(([name, _]) => name === last);
        if (offset === -1) {
          err(ctx, `field ${last} not found on ${ctx._base.getText()}`);
        }
        this.visit(ctx._base); // compile the base first
        ILoadStructFieldLoc.emit(this.bc).setOffset(offset);
        return 0;
      default:
        err(ctx, `expected struct but got ${ty.data.kind} as type of ${ctx._base.getText()}`);
        throw "Unreachable";
    }
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
      err(ctx, `${nnames} on LHS but ${rhsTypes.length} on RHS`);
    }
    for (let i = 0; i < nnames; ++i) {
      const lhs = ctx._lhs.lname_list()[i].getText();
      const ty = rhsTypes[i];
      if (ty === undefined) {
        err(ctx, `could not find type for ${lhs}`);
      }
      this.tenv.set(lhs, ty!);
    }
    return 0;
  };

  visitExpr = (ctx: ExprContext): number => {
    // An expression can be one of three types.
    if (ctx.mulOp()) {
      this.visit(ctx._lhs);
      this.visit(ctx._rhs);
      this.visit(ctx.mulOp());
    } else if (ctx.addOp()) {
      this.visit(ctx._lhs);
      this.visit(ctx._rhs);
      this.visit(ctx.addOp());
    } else if (ctx.relOp()) {
      this.visit(ctx._lhs);
      this.visit(ctx._rhs);
      this.visit(ctx.relOp());
    } else if (ctx.logicalOp()) {
      this.visit(ctx._lhs);
      this.visit(ctx._rhs);
      this.visit(ctx.logicalOp());
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
      if (baseType.length === 0) {
        err(ctx, `could not find type for ${ctx.getText()}`);
      }
      if (baseType!.length > 1) {
        err(ctx, `bad access on ${ctx.getText()} - multiple values on LHS`);
      }

      const final = ctx.selector().name().getText();
      const kind = baseType![0].data.kind;

      const searchField = () => {
        switch (kind) {
          case "struct":
            const offset = baseType![0].data.fields.findIndex(([name, _]) => name === final);
            if (offset === -1) {
              return false;
              // err(ctx, `field ${final} not found on ${ctx._base.getText()}`);
            }
            this.visit(ctx._base); // get the base onto the OS
            ILoadStructField.emit(this.bc).setOffset(offset);
            return true;
          default:
            return false;
          // err(ctx, `expected struct but got ${kind} for type of ${ctx._base.getText()}`);
        }
      };
      const fieldOk = searchField();
      if (fieldOk) return 1;

      const methodName = baseType![0].name + "::" + final;
      const [frame, offset] = this.env.lookupExn(methodName, ctx); // @todo better error message
      ILoadName.emit(this.bc).setFrame(frame).setOffset(offset);
      this.visit(ctx._base); // evaluate base
      ILoadMethod.emit(this.bc);
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

  visitMulOp = (ctx: MulOpContext): number => {
    const op = IBinaryOp.emit(this.bc);

    if (ctx.STAR()) {
      op.setOp(BinaryOp.Mul);
    } else if (ctx.DIV()) {
      op.setOp(BinaryOp.Div);
    } else {
      err(ctx, `unexpected multiplication operator ${ctx.getText()}`);
    }

    return 0;
  };

  visitAddOp = (ctx: AddOpContext): number => {
    const op = IBinaryOp.emit(this.bc);

    if (ctx.PLUS()) {
      op.setOp(BinaryOp.Add);
    } else if (ctx.MINUS()) {
      op.setOp(BinaryOp.Sub);
    } else {
      err(ctx, `unexpected addition operator ${ctx.getText()}`);
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
      err(ctx, `unexpected relation operator ${ctx.getText()}`);
    }
    return 0;
  };

  visitLogicalOp = (ctx: LogicalOpContext): number => {
    const op = ILogicalOp.emit(this.bc);
    if (ctx.LOGICAL_OR()) {
      op.setOp(LogicalOp.Or);
    } else if (ctx.LOGICAL_AND()) {
      op.setOp(LogicalOp.And);
    } else {
      err(ctx, `unexpected logical operator ${ctx.getText()}`);
    }
    return 0;
  };

  visitUnaryOp = (ctx: UnaryOpContext): number => {
    const op = IUnaryOp.emit(this.bc);
    if (ctx.MINUS()) {
      op.setOp(UnaryOp.Sub);
    } else if (ctx.PLUS()) {
      op.setOp(UnaryOp.Add);
    } else {
      err(ctx, `unexpected unary operator ${ctx.getText()}`);
    }
    return 0;
  };

  visitName = (ctx: NameContext): number => {
    const name = ctx.getText();
    const [frame, offset] = this.env.lookupExn(name, ctx);
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
      throw "Unreachable";
    }
    ILoadC.emit(this.bc).setVal(val);
    return 1;
  };

  visitLitStruct = (ctx: LitStructContext): number => {
    /**
     * A budget way of making sure we assign the struct fields in the correct
     * order. We just sort the given field expressions into the order based
     * on the struct declaration.
     */
    const sortFields = <T>(givenFields: [string, T][], expectedFields: string[]): [string, T][] => {
      const ret: [string, T][] = [];
      for (const name1 of expectedFields) {
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
      const repr = this.tstore.lookupExn(ty, ctx);
      switch (repr.data.kind) {
        case "struct":
          const fieldc = repr.data.fields.length;
          const given = ctx
            .keyedElems()
            .keyedElem_list()
            .map((elem) => [elem.lname().getText(), elem.expr()] as [string, ExprContext]);
          const expected = repr.data.fields.map(([name, _]) => name);
          const sorted = sortFields(given, expected);
          if (sorted.length !== fieldc) {
            err(ctx, `in struct literal of ${ty} - expected ${fieldc} fields, but got ${sorted.length}`);
          }
          sorted.reverse().forEach(([_, expr]) => this.visit(expr)); // compile each field's expression
          IPackStruct.emit(this.bc).setFieldc(fieldc);
          break;
        case "chan":
        case "primitive":
          err(ctx, `expected struct but got ${repr.data.kind}`);
      }
    } else if (ctx.structType()) {
      // @todo or we just don't allow it i.e. it would be a parse error
      throw "Unimplemented";
    } else {
      throw "Unreachable";
    }
    return 1;
  };
}

class CompileError extends Error {}
class ParseError extends Error {}

/**
 * Throws a compile time error.
 */
const err = (ctx: ParserRuleContext, msg: string): never => {
  const lineno = ctx.start.line;
  const colno = ctx.start.column;
  const s = `${lineno}:${colno}: ${msg}`;
  throw new CompileError(s);
};

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

  const parseErrHandler = new ParsingErrorHandler();

  parser.buildParseTrees = true;
  parser.removeErrorListeners();
  parser.addErrorListener(parseErrHandler);

  const tree = parser.prog(); // parse the program

  if (parseErrHandler.errs.length > 0) {
    for (const err of parseErrHandler.errs) {
      console.error(err);
    }
    throw new ParseError(`encountered ${parseErrHandler.errs.length} errors`);
  }

  // @todo: throw parse error if encountered
  const ass = new Assembler();
  ass.visit(tree);

  const bytecode = ass.bc.code();
  const srcMap = ass.bc.srcMap();
  const strPool = ass.strPool;

  return { bytecode, srcMap, strPool };
};

class ParsingErrorHandler extends ErrorListener<Token> {
  errs: string[] = [];
  syntaxError(
    recognizer: Recognizer<Token>,
    offendingSymbol: Token,
    line: number,
    column: number,
    msg: string,
    e: RecognitionException | undefined,
  ): void {
    const err = `line ${line}:${column} ${msg}`;
    this.errs.push(err);
  }
}
