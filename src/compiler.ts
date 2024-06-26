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
  LitBoolContext,
  LitNilContext,
  LpointerContext,
  LitFuncContext,
  ChannelTypeContext,
  FuncTypeContext,
  KeyedElemContext,
  LvalueContext,
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
  IGo,
  // ILoadGlobal,
  ILoadBool,
  IPackPtr,
  IDeref,
  ILoadPtrSlot,
  ConstantKind,
  IChanRead,
  IChanWrite,
} from "./instructions";
import { Address, ArrayStack, Stack, StrPool, arraysEqual } from "./util";
import { DataType, Int64View, NodeView, PointerView, StructView, builtinSymbols } from "./heapviews";
import assert from "assert";

class BytecodeWriter implements Emitter {
  private _code: DataView;
  private _wc: number;
  private _prevWc: number;
  /**
   * Map from bytecode address to source line number. Used for debugging only.
   */
  private _srcMap: Map<number, number>;

  // @note: we can't dynamically resize (copy) the bytecode array around due to limitations in the compiler
  constructor(codeLen: number = 5_000_000) {
    this._code = new DataView(new ArrayBuffer(codeLen));
    this._wc = 0;
    this._prevWc = -1;
    this._srcMap = new Map();
  }

  code(): DataView {
    return this._code;
  }
  wc(): number {
    return this._wc;
  }
  /**
   * Returns the wc of the previous instruction.
   */
  prevWc(): number {
    return this._prevWc;
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
    this._prevWc = this._wc;

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
    const rcvType = ctx._rcvType.getText();
    const fnName = ctx._methodName.getText();
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

export namespace Channel {
  /**
   * A friendly interface for use. Although the channel's underlying fields
   * are all pointers, that is inconvenient to use.
   */
  export interface T {
    id: Int64View;
    status: Int64View;
    data: NodeView;
  }

  /**
   * Takes the address of a channel and returns its guts.
   *
   * A channel is a pointer to a struct with 3 fields.
   *
   *   0: channel's ID
   *   1: channel's status (-1, 0, 1)
   *   2: channel's data
   *
   * This function performs the required derefencing to extract the 3 fields.
   */
  export const view = (heap: DataView, addr: Address): T => {
    const chanp = new PointerView(heap, addr);
    const chan = new StructView(heap, chanp.getValue());

    const id = new Int64View(heap, chan.getField(0));
    const status = new Int64View(heap, chan.getField(1));
    const data = NodeView.of(heap, chan.getField(2));

    return { id, status, data };
  };
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
    methods?: Map<string, Method>;
  };

  type Data = Struct | Channel | Primitive | Func | Method | Pointer;

  export type Struct = {
    kind: "struct";
    /**
     * A mapping from field name to its type name. We use a list instead of a
     * map, because the order is important.
     */
    fields: [string, T][];
  };

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

  export type Method = {
    kind: "method";
    pointer: boolean;
    func: Func;
  };

  export type Pointer = {
    kind: "ptr";
    elem: T;

    /**
     * Only used when resolving types.
     */
    unresolved?: number;
  };

  /**
   * Checks if two types are equal.
   */
  export const equal = (lhs: T, rhs: T): boolean => {
    // @note: we could also check if their names match?
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
      case "ptr":
        _rhs = rhs as Pointer;
        return lhs.elem.name === _rhs.elem.name; // copium
      case "method":
        _rhs = rhs as Method;
        return lhs.pointer === _rhs.pointer && equalData(lhs.func, _rhs.func);
    }
  };

  export const isBool = (t: T | undefined): boolean => {
    if (t === undefined) return false;
    return t.data.kind === "primitive" && t.data.name === "bool";
  };

  /**
   * Finds a field in a type. (Of course these would only exist on struct or pointer types.)
   */
  export const findField = (t: T, field: string, recurse: boolean = true): { offset: number; t: T } | undefined => {
    if (t.data.kind === "struct") {
      const offset = t.data.fields.findIndex(([name, _]) => name === field);
      if (offset !== -1) {
        return { offset, t: t.data.fields[offset][1] };
      }
      return undefined;
    } else if (t.data.kind === "ptr" && recurse) {
      const elem = t.data.elem;
      return findField(elem, field, false);
    } else {
      return undefined;
    }
  };

  export const findFieldExn = (
    t: T,
    field: string,
    ctx: ParserRuleContext,
    recurse: boolean = true,
  ): { offset: number; t: T } => {
    if (t.data.kind === "struct") {
      const offset = t.data.fields.findIndex(([name, _]) => name === field);
      if (offset !== -1) {
        return { offset, t: t.data.fields[offset][1] };
      }
      err(ctx, `type ${t.name} has no field or method ${field}`);
    } else if (t.data.kind === "ptr" && recurse) {
      const elem = t.data.elem;
      return findFieldExn(elem, field, ctx, false);
    } else {
      err(ctx, `type ${t.name} has no field or method ${field}`);
    }
    throw "Unreachable";
  };

  export const findMethod = (
    t: T,
    method: string,
    recurse: boolean = true,
  ): { f: Method; fullname: string } | undefined => {
    if (t.data.kind !== "ptr") {
      const f = t.methods?.get(method);
      if (f === undefined) return undefined;
      return { fullname: t.name + "::" + method, f };
    } else if (recurse) {
      const elem = t.data.elem;
      return findMethod(elem, method, false);
    } else {
      return undefined;
    }
  };

  /**
   * Tries to find a given field or method on some type t. Fields are checked
   * first, then methods.
   */
  export const findFieldOrMethodExn = (t: T, field: string, ctx: ParserRuleContext): T => {
    const f = findField(t, field);
    if (f !== undefined) return f.t;
    const m = findMethod(t, field);
    if (m !== undefined) return { data: m.f };
    err(ctx, `type ${t.name} has no field or method ${field}`);
    throw "Unreachable";
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

  export const mutex: T = {
    name: "Mutex",
    data: {
      kind: "struct",
      fields: [
        ["locked", { data: { kind: "primitive", name: "bool" } }],
        ["id", { data: { kind: "primitive", name: "int64" } }],
      ],
    },
    // @note: Mutex::Lock and Mutex::Unlock must be implemented as built-in
    // functions!
    methods: new Map([
      ["Lock", { kind: "method", pointer: true, func: { kind: "func", params: [], results: [] } }],
      ["Unlock", { kind: "method", pointer: true, func: { kind: "func", params: [], results: [] } }],
    ]),
  };

  export const resolveTypeExn = (ctx: TypeContext, tstore: TypeStore): Type.T => {
    if (ctx.typeName()) {
      return tstore.lookupExn(ctx.typeName().getText(), ctx);
    } else if (ctx.typeLit()) {
      const tydata = _Type.fromContext(ctx);
      const ret = _Type.resolve([{ data: tydata, ctx }], tstore);
      assert(ret.length === 1);
      return ret[0];
    } else {
      throw "Unreachable";
    }
  };

  export const resolveStructTypeExn = (ctx: StructTypeContext, tstore: TypeStore): Type.T => {
    const tydata = _Type.fromStructContext(ctx);
    const ty = _Type.resolve([{ data: tydata, ctx }], tstore);
    assert(ty.length === 1);
    return ty[0];
  };
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

  type Data = Struct | Channel | Func | Pointer | Alias;

  type Struct = {
    kind: "struct";
    fields: [string, Data][];
  };

  type Channel = {
    kind: "chan";
    elem: Data;
  };

  type Func = {
    kind: "func";
    params: Data[];
    results: Data[];
  };

  type Pointer = {
    kind: "ptr";
    elem: Alias;
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
        return { kind: "chan", elem: fromContext(lit.channelType().type_()) };
      } else if (lit.pointerType()) {
        const alias = lit.pointerType().typeName().getText();
        return { kind: "ptr", elem: { kind: "alias", alias } };
      } else if (lit.funcType()) {
        return fromFuncTypeContext(lit.funcType());
      } else {
        throw "Unreachable";
      }
    } else {
      throw "Unreachable";
    }
  };

  const fromFuncTypeContext = (ctx: FuncTypeContext): Func => {
    const params = ctx
      .signature()
      .params()
      .param_list()
      .map((param) => fromContext(param.type_()));
    const results = ctx
      .signature()
      .funcResult()
      .type__list()
      .map((typ) => fromContext(typ));
    return { kind: "func", params, results };
  };

  export const fromStructContext = (ctx: StructTypeContext): Struct => {
    const fs = ctx.fieldDecl_list();
    const fields: [string, Data][] = fs.map((field) => {
      const name = field.name().getText();
      const ty = fromContext(field.type_());
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
   * new frame of types. (I have lost track of how it works.)
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
    const dummyType: Type.T = { data: { kind: "struct", fields: [] } };
    const aux = (ty: Data, ctx: ParserRuleContext, inPtr: boolean): Type.T | number => {
      switch (ty.kind) {
        case "struct":
          const fields: [string, Type.T][] = ty.fields.map(([fieldname, fieldty]) => {
            const typ = aux(fieldty, ctx, false);
            if (typeof typ === "number") {
              err(ctx, `could not resolve field's type: ${ctx.getText()}`);
              throw "Unreachable";
            } else {
              return [fieldname, typ];
            }
          });
          return { data: { kind: "struct", fields } };
        case "chan": {
          const elem = aux(ty.elem, ctx, false);
          if (typeof elem === "number") {
            err(ctx, `could not resolve channel's type: ${ctx.getText()}`);
            throw "Unreachable";
          }
          return { data: { kind: "chan", elem } };
        }
        case "func":
          const params = ty.params
            .map((param) => aux(param, ctx, false))
            .map((param) => {
              if (typeof param === "number") {
                err(ctx, `could not resolve function's parameter type: ${ctx.getText()}`);
                throw "Unreachable";
              }
              return param;
            });
          const results = ty.results
            .map((res) => aux(res, ctx, false))
            .map((res) => {
              if (typeof res === "number") {
                err(ctx, `could not resolve function's result type: ${ctx.getText()}`);
                throw "Unreachable";
              }
              return res;
            });
          return { data: { kind: "func", params, results } };
        case "ptr": {
          const elem = aux(ty.elem, ctx, true);
          if (typeof elem === "number") {
            return { data: { kind: "ptr", elem: dummyType, unresolved: elem } };
          } else {
            return { data: { kind: "ptr", elem } };
          }
        }
        case "alias":
          const idx = checkFriends(ty.alias);
          if (idx === undefined) {
            const t = store.lookupExn(ty.alias, ctx);
            return t;
          } else {
            const t = dfs(idx, inPtr);
            return t;
          }
      }
    };
    const dfs = (i: number, inPtr: boolean): Type.T | number => {
      if (state[i] === 0) {
        if (!inPtr) {
          err(ts[i].ctx, `found recursive type: ${ts[i].name}`);
        } else {
          // resolve in second pass
          return i;
        }
      } else if (state[i] === 1) {
        return ret[i];
      }
      state[i] = 0;
      const ty = ts[i];
      switch (ty.data.kind) {
        case "struct":
          const structtype = aux(ty.data, ty.ctx, false);
          if (typeof structtype === "number") {
            err(ty.ctx, `could not resolve struct type: ${ty.ctx.getText()}`);
            throw "Unreachable";
          }
          state[i] = 1;
          return (ret[i] = { ...structtype, name: ty.name });
        case "chan":
          const chantype = aux(ty.data, ty.ctx, false);
          if (typeof chantype === "number") {
            err(ty.ctx, `could not resolve channel type: ${ty.ctx.getText()}`);
            throw "Unreachable";
          }
          state[i] = 1;
          return (ret[i] = { ...chantype, name: ty.name });
        case "func":
          const functype = aux(ty.data, ty.ctx, false);
          if (typeof functype === "number") {
            err(ty.ctx, `could not resolve function type: ${ty.ctx.getText()}`);
            throw "Unreachable";
          }
          state[i] = 1;
          return (ret[i] = { ...functype, name: ty.name });
        case "ptr":
          const ptrtype = aux(ty.data, ty.ctx, false);
          if (typeof ptrtype === "number") {
            err(ty.ctx, `could not resolve pointer type: ${ty.ctx.getText()}`);
            throw "Unreachable";
          }
          state[i] = 1;
          return (ret[i] = { ...ptrtype, name: ty.name });
        case "alias":
          const alias = aux(ty.data, ty.ctx, false);
          if (typeof alias === "number") {
            err(ty.ctx, `could not resolve alias type: ${ty.ctx.getText()}`);
            throw "Unreachable";
          }
          state[i] = 1;
          return (ret[i] = alias);
      }
    };
    for (let i = 0; i < ts.length; ++i) {
      if (state[i] === 1) continue;
      if (state[i] === 0) {
        throw "Unreachable";
      }
      dfs(i, false);
    }
    const resolveCycles = (t: Type.T) => {
      switch (t.data.kind) {
        case "struct":
          t.data.fields.forEach(([_, fieldtype]) => resolveCycles(fieldtype));
          break;
        case "chan":
          resolveCycles(t.data.elem);
          break;
        case "primitive":
          break;
        case "func":
          t.data.params.forEach((param) => resolveCycles(param));
          t.data.results.forEach((res) => resolveCycles(res));
          break;
        case "method":
          // ?
          break;
        case "ptr":
          if (t.data.unresolved === undefined) return;
          t.data.elem = ret[t.data.unresolved]; // resolve it
          break;
      }
    };
    for (const t of ret) {
      resolveCycles(t);
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
    this.frames.shift();
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
    if (ctx.mulOp() || ctx.addOp()) {
      const lhs = this.visit(ctx._lhs);
      const rhs = this.visit(ctx._rhs);
      if (lhs.length !== 1 || rhs.length !== 1) {
        err(ctx, "invalid operation"); // @todo a better err msg
      }
      // @todo: we should check that the operation and type are indeed correct? e.g. numbers, bools,
      // @todo we're assuming all binary operations take the same types?
      if (!Type.equal(lhs[0], rhs[0])) {
        err(ctx, `invalid operation ${ctx.getText()} between ${lhs[0].name} and ${rhs[0].name}`);
      }
      return lhs;
    } else if (ctx.relOp()) {
      // @todo: very similar to the above. let's reduce the duplication.
      const lhs = this.visit(ctx._lhs);
      const rhs = this.visit(ctx._rhs);
      if (lhs.length !== 1 || rhs.length !== 1) {
        err(ctx, "invalid operation"); // @todo a better err msg
      }
      // @todo: we should check that the operation and type are indeed correct? e.g. numbers, bools,
      // @todo we're assuming all binary operations take the same types?
      if (!Type.equal(lhs[0], rhs[0])) {
        err(ctx, `invalid operation between ${lhs[0].name} and ${rhs[0].name}`);
      }
      return [Type.Primitive.make("bool", "bool")];
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
      if (ctx.unaryOp().AMPERSAND()) {
        const inner = this.visit(ctx.expr(0));
        if (inner.length !== 1) {
          err(ctx, `& operator cannot be used on multiple types (${ctx.getText()})`);
        }
        const ptr: Type.T = { data: { kind: "ptr", elem: inner[0] } };
        return [ptr];
      } else if (ctx.unaryOp().STAR()) {
        const outer = this.visit(ctx.expr(0));
        if (outer.length !== 1 || outer[0].data.kind !== "ptr") {
          err(ctx, `${ctx.expr(0).getText()} cannot be dereferenced`);
          throw "Unreachable";
        }
        return [outer[0].data.elem];
      } else if (ctx.unaryOp().RCV()) {
        const chanTy = this.visit(ctx.expr(0));
        if (chanTy.length != 1) {
          err(ctx, `cannot receive from ${ctx.expr(0).getText()}`);
          throw "Unreachable";
        }
        if (chanTy[0].data.kind !== "chan") {
          err(ctx, `${ctx.expr(0).getText()} is not a channel`);
          throw "Unreachable";
        }
        return [chanTy[0].data.elem];
      } else {
        return this.visit(ctx.expr(0));
      }
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
    } else if (ctx._wrapped) {
      return this.visit(ctx._wrapped);
    } else if (ctx.NEW()) {
      // new always returns a pointer type enclosing the inner type
      const elem = Type.resolveTypeExn(ctx.type_(), this.store);
      return [{ data: { kind: "ptr", elem } }];
    } else if (ctx.MAKE()) {
      const elem = Type.resolveTypeExn(ctx.channelType().type_(), this.store);
      return [{ data: { kind: "chan", elem } }];
    } else if (ctx._fn) {
      const fnty = this.visit(ctx._fn);
      if (fnty.length !== 1 || (fnty[0].data.kind !== "method" && fnty[0].data.kind !== "func")) {
        err(ctx, `cannot call non-function ${ctx._fn.getText()}`);
        throw "Unreachable";
      }
      switch (fnty[0].data.kind) {
        case "func":
          return fnty[0].data.results;
        case "method":
          return fnty[0].data.func.results;
      }
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
    // @todo Should we type-check the fields? NO - we do it when emitting bytecode
    if (ctx.typeName()) {
      const ret = this.store.lookupExn(ctx.typeName().getText(), ctx);
      ctx.keyedElems().keyedElem_list();
      return [ret];
    } else if (ctx.structType()) {
      const ret = Type.resolveStructTypeExn(ctx.structType(), this.store);
      return [ret];
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

  visitLitNil = (ctx: LitNilContext): Type.T[] => {
    err(ctx, "nil literals cannot be type checked at the moment");
    throw "Unreachable";
  };

  visitLitBool = (_ctx: LitBoolContext): Type.T[] => {
    return [Type.Primitive.make("bool", "bool")];
  };

  visitLitFunc = (ctx: LitFuncContext): Type.T[] => {
    const params = ctx
      .signature()
      .params()
      .param_list()
      .map((param) => Type.resolveTypeExn(param.type_(), this.store));
    const results = ctx
      .signature()
      .funcResult()
      .type__list()
      .map((typ) => Type.resolveTypeExn(typ, this.store));
    return [{ data: { kind: "func", params, results } }];
  };

  visitLitStr = (_ctx: LitStrContext): Type.T[] => {
    return [Type.Primitive.make("string", "string")];
  };

  visitLpointer = (ctx: LpointerContext): Type.T[] => {
    const inner = this.visit(ctx.lvalue());
    if (inner.length !== 1 || inner[0].data.kind !== "ptr") {
      err(ctx, `${ctx.getText()} cannot be dereferenced`);
      throw "Unreachable";
    }
    // we "deref" the type
    return [inner[0].data.elem];
  };

  visitLname = (ctx: LnameContext): Type.T[] => {
    return [this.env.lookupExn(ctx.getText(), ctx)];
  };

  visitField = (ctx: FieldContext): Type.T[] => {
    const _basety = this.visit(ctx._base);
    if (_basety.length !== 1) {
      err(ctx, `bad dot access`); // @todo btr err msg
    }
    const basety = _basety[0];
    const final = ctx._last.text;
    return [Type.findFieldOrMethodExn(basety, final, ctx)];
  };

  visitChildren(node: ParserRuleContext): Type.T[] {
    if (!node.children) return [];
    const ret = node.children.flatMap((child) => this.visit(child)).filter((child) => child !== undefined);
    return ret;
  }
}

/**
 * Type environment for builtin stuff. Note that [new] is not placed in here,
 * even though it should, since we are cutting corners and implementing it as
 * as "keyword".
 */
const baseTypeEnv: Map<string, Type.T> = new Map([
  [
    "panic",
    {
      data: { kind: "func", params: [], results: [] },
    },
  ],
  [
    "dbg",
    {
      data: { kind: "func", params: [], results: [] },
    },
  ],
  [
    "Mutex::Lock",
    {
      data: { kind: "func", params: [], results: [] },
    },
  ],
  [
    "Mutex::Unlock",
    {
      data: { kind: "func", params: [], results: [] },
    },
  ],
]);

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
      .map((param) => Type.resolveTypeExn(param.type_(), this.tstore));
    const results = ctx
      .signature()
      .funcResult()
      .type__list()
      .map((ty) => Type.resolveTypeExn(ty, this.tstore));

    // Unlike functions, the type info for a method is not stored in the type
    // environment. Instead we attach it to the type info of the type this
    // method is declared on.
    const rcvType = this.tstore.lookupExn(ctx._rcvType.getText(), ctx);
    const mthdType: Type.Method = {
      kind: "method",
      pointer: ctx.STAR() !== null,
      func: { kind: "func", params, results },
    };
    if (rcvType.methods === undefined) {
      rcvType.methods = new Map();
    }
    const fname = ctx._methodName.getText();
    rcvType.methods.set(fname, mthdType);
  };

  visitFuncDecl = (ctx: FuncDeclContext) => {
    const fname = ctx.name().getText();
    const params = ctx
      .signature()
      .params()
      .param_list()
      .map((param) => Type.resolveTypeExn(param.type_(), this.tstore));
    const results = ctx
      .signature()
      .funcResult()
      .type__list()
      .map((ty) => Type.resolveTypeExn(ty, this.tstore));
    this.tenv.set(fname, { data: { kind: "func", params, results } });
  };
}

export class Assembler extends GoVisitor<number> {
  bc: BytecodeWriter;
  env: CompTimeEnv;
  tenv: TypeEnv;
  tstore: TypeStore;

  main: number | undefined; // keep track of where the main function starts
  doneAt: number = -1; // also keep track of where [Done] is

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
    this.tenv.pushFrame_(baseTypeEnv);
    this.tstore.pushFrame(Type.Primitive.types.concat([Type.mutex]));
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
    return Type.resolveTypeExn(ctx, this.tstore);
  };

  typeComp = (ctx: ParserRuleContext): Type.T[] => {
    return new Typer(this.tstore, this.tenv).visit(ctx);
  };

  /**
   * Generates code for the default initialization of some type.
   */
  initDefault = (t: Type.T): void => {
    switch (t.data.kind) {
      case "struct":
        const fieldc = t.data.fields.length;
        // @note: we must do it in reverse!
        for (let i = fieldc - 1; i >= 0; --i) {
          this.initDefault(t.data.fields[i][1]);
        }
        IPackStruct.emit(this.bc).setFieldc(fieldc);
        break;
      case "primitive":
        switch (t.data.name) {
          case "string":
            const id = this.strPool.add("");
            ILoadStr.emit(this.bc).setId(id);
            break;
          case "int64":
            ILoadC.emit(this.bc).setKind(ConstantKind.Int64).setVal(0);
            break;
          case "float64":
            ILoadC.emit(this.bc).setKind(ConstantKind.Float64).setVal(0);
            break;
          case "bool":
            ILoadBool.emit(this.bc).set(false);
            // ILoadGlobal.emit(this.bc).setGlobal(Global["false"]);
            break;
        }
        break;
      case "ptr":
      case "chan":
        // The default value of a channel is nil. (A channel is a pointer.)
        IPush.emit(this.bc).setVal(-1);
        IPackPtr.emit(this.bc);
        // ILoadGlobal.emit(this.bc).setGlobal(Global["nil"]);
        break;
      case "func":
      case "method":
        throw "Unimplemented";
    }
  };

  /**
   * Generates code which initializes a channel. Note that this is different
   * from a channel's default initialization - the default is nil.
   */
  initChannel = (ctx: ChannelTypeContext): void => {
    const elem = this.resolveTypeExn(ctx.type_());

    // 2. data
    this.initDefault(elem);
    // 1. status
    ILoadC.emit(this.bc).setKind(ConstantKind.Int64).setVal(0);
    // 0. id
    ILoadC.emit(this.bc).setKind(ConstantKind.Int64).setVal(0);

    IPackStruct.emit(this.bc).setFieldc(3);
    IPackPtr.emit(this.bc);
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
    ICall.emit(this.bc).setArgc(0).setGo(false); // call [main]
    IDone.emit(this.bc); // last instruction
    this.doneAt = this.bc.prevWc();

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
        const typ = this.resolveTypeExn(param.type_());
        this.tenv.set(name, typ);
      });
    this.visit(ctx.funcBody()); // compile the body
    this.tenv.popFrame();
    this.env.popFrame();

    // Note that we *always* emit this, even if the function body has explicit
    // return statement(s). These instructions will not affect those functions
    // (since we'll never reach these lines). Instead these are meant for
    // functions without return statements.
    IReturn.emit(this.bc);

    ldf.setLast(this.bc.prevWc()); // goroutines need this info to know where to stop
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
    const rcvName = ctx._rcvName.getText();
    params.unshift(rcvName); // insert receiver param name

    const fnPc = this.bc.wc();
    ldf.setPc(fnPc).setArgc(params.length);

    let rcvType = this.tstore.lookupExn(ctx._rcvType.getText(), ctx._rcvType);
    if (ctx.STAR()) {
      rcvType = { data: { kind: "ptr", elem: rcvType } };
    }

    this.env.pushFrame(params);
    this.tenv.pushFrame(); // push a type env frame, and then set types for the params
    this.tenv.set(rcvName, rcvType); // also include the receiver's type
    ctx
      .signature()
      .params()
      .param_list()
      .forEach((param) => {
        const name = param.name().getText();
        const typ = this.resolveTypeExn(param.type_());
        this.tenv.set(name, typ);
      });
    this.visit(ctx.funcBody()); // compile the body
    this.tenv.popFrame();
    this.env.popFrame();

    IReturn.emit(this.bc);

    ldf.setLast(this.bc.prevWc()); // goroutines need this info to know where to stop
    goto.setWhere(this.bc.wc());

    const fnName = ctx._rcvType.getText() + "::" + ctx._methodName.getText();
    const [frame, offset] = this.env.lookupExn(fnName, ctx);
    ILoadNameLoc.emit(this.bc, ctx).setFrame(frame).setOffset(offset);
    IAssign.emit(this.bc, ctx).setCount(1);

    return 0;
  };

  visitVarDecl = (ctx: VarDeclContext): number => {
    if (ctx.expr()) {
      const expectedType = this.resolveTypeExn(ctx.type_());
      const givenType = this.typeComp(ctx.expr());
      if (givenType.length !== 1) {
        err(ctx, `unexpected multiple values on RHS`);
        throw "Unreachable";
      }
      if (!Type.equal(expectedType, givenType[0])) {
        err(ctx, `expected ${expectedType.name}, got ${givenType[0].name}`);
        throw "Unreachable";
      }

      this.visit(ctx.expr()); // compile RHS
    } else {
      const ty = this.resolveTypeExn(ctx.type_());
      this.initDefault(ty);
    }

    const name = ctx.name().getText();
    const [frame, offset] = this.env.lookupExn(name, ctx);
    ILoadNameLoc.emit(this.bc, ctx).setFrame(frame).setOffset(offset);
    IAssign.emit(this.bc, ctx).setCount(1);

    // Insert type information about this variable.
    const t = this.resolveTypeExn(ctx.type_());
    this.tenv.set(ctx.name().getText(), t);

    // Declarations, should leave nothing on the stack.
    return 0;
  };

  visitTypeDecl = (_: TypeDeclContext): number => {
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
    } else {
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
    const func = ctx.primaryExpr();
    if (!func._fn) {
      err(ctx, "expression in go must be function call");
    }

    const args = func.args();
    const fn = func._fn;
    const argc = args.arg_list().length;

    {
      const type = this.typeComp(fn);
      if (type.length !== 1) {
        err(ctx, `cannot call non-function ${fn.getText()}`);
        throw "Unreachable";
      }
      const kind = type[0].data.kind;
      if (kind !== "func" && kind !== "method") {
        err(ctx, `cannot call non-function ${fn.getText()}`);
      }
    }

    this.visit(fn); // emit code to evaluate the callable thing
    this.visit(args); // emit code to evaluate each arg

    // Note that a [Go] is always followed immediately by [Call]. We'll need to
    // rely on this at runtime.
    IGo.emit(this.bc, ctx);
    ICall.emit(this.bc, ctx).setArgc(argc).setGo(true);

    return 0;
  };

  visitSendStmt = (ctx: SendStmtContext): number => {
    this.visit(ctx._rhs);
    this.visit(ctx._channel);
    IChanWrite.emit(this.bc);
    return 0;
  };

  visitLname = (ctx: LnameContext): number => {
    const name = ctx.getText();
    const [frame, offset] = this.env.lookupExn(name, ctx);
    ILoadNameLoc.emit(this.bc).setFrame(frame).setOffset(offset);
    return 1;
  };

  visitLpointer = (ctx: LpointerContext): number => {
    this.typeComp(ctx); // implicit type checkin

    const inner = ctx.lvalue();
    if (inner.lname()) {
      const name = inner.lname().getText();
      const [frame, offset] = this.env.lookupExn(name, ctx);
      ILoadName.emit(this.bc).setFrame(frame).setOffset(offset);
    } else if (inner.field()) {
      this._visitField(inner.field(), false);
    } else if (inner.lpointer()) {
      this.visit(inner.lpointer());
    } else {
      throw "Unreachable";
    }
    ILoadPtrSlot.emit(this.bc);
    return 1;
  };

  _visitField = (ctx: FieldContext, lvalue = true): number => {
    const baseType = this.typeComp(ctx._base);
    if (baseType.length !== 1) {
      err(ctx, `could not determine type of ${ctx._base.getText()}`);
    }
    const basetype = baseType[0];
    const fieldname = ctx._last.text;
    const field = Type.findFieldExn(basetype, fieldname, ctx);

    switch (basetype.data.kind) {
      case "struct":
        this.visit(ctx._base); // compile the base first
        break;
      case "ptr":
        this.visit(ctx._base); // compile base to get a pointer type on OS...
        IDeref.emit(this.bc); // ... and deref it
        break;
      default:
        err(ctx, `${ctx._base.getText()} does not have field ${fieldname} (type ${basetype.data.kind})`);
        throw "Unreachable";
    }
    if (lvalue) {
      ILoadStructFieldLoc.emit(this.bc).setOffset(field.offset);
    } else {
      ILoadStructField.emit(this.bc).setOffset(field.offset);
    }
    return 1;
  };

  visitField = (ctx: FieldContext): number => {
    return this._visitField(ctx, true);
  };

  visitAssignment = (ctx: AssignmentContext): number => {
    const rhsTypes = ctx._rhs.expr_list().flatMap((expr) => this.typeComp(expr));
    const lhsTypes = ctx._lhs.lvalue_list().flatMap((lvalue) => this.typeComp(lvalue));
    if (rhsTypes.length !== lhsTypes.length) {
      err(ctx, `${lhsTypes.length} on LHS but ${rhsTypes.length} on RHS for ${ctx.getText()}`);
    }
    for (let i = 0; i < lhsTypes.length; ++i) {
      if (!Type.equal(lhsTypes[i], rhsTypes[i])) {
        err(ctx, `expected ${lhsTypes[i].name} but got ${rhsTypes[i].name}`);
      }
    }

    const nnames = ctx._lhs.lvalue_list().length;
    this.visit(ctx._rhs);
    this.visit(ctx._lhs);
    IAssign.emit(this.bc).setCount(nnames);
    return 0;
  };

  visitShortVarDecl = (ctx: ShortVarDeclContext): number => {
    // Identical to [visitAssignment]?
    //
    // @todo make them into a common function
    const nnames = ctx._lhs.lname_list().length;
    this.visit(ctx._rhs);
    this.visit(ctx._lhs);
    IAssign.emit(this.bc).setCount(nnames);

    const rhsTypes = ctx._rhs.expr_list().flatMap((expr) => this.typeComp(expr));
    if (rhsTypes.length !== nnames) {
      err(ctx, `${nnames} on LHS but ${rhsTypes.length} on RHS for ${ctx.getText()}`);
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
      return this.visit(ctx.primaryExpr());
    }
    // Most expressions evaluate to 1 item. However, function calls may evaluate
    // to multiple!
    return 1;
  };

  visitPrimaryExpr = (ctx: PrimaryExprContext): number => {
    if (ctx.name()) {
      return this.visit(ctx.name());
    } else if (ctx.lit()) {
      return this.visit(ctx.lit());
    } else if (ctx._wrapped) {
      return this.visit(ctx._wrapped);
    } else if (ctx.NEW()) {
      // a call to new
      const ty = this.resolveTypeExn(ctx.type_());
      this.initDefault(ty);
      IPackPtr.emit(this.bc);
      return 1;
    } else if (ctx.MAKE()) {
      // We can only make channels for now.
      this.initChannel(ctx.channelType());
      return 1;
    } else if (ctx._fn) {
      const args = ctx.args();
      const fn = ctx._fn;
      const argc = args.arg_list().length;

      const _fnType = this.typeComp(fn);
      if (_fnType.length !== 1 || (_fnType[0].data.kind !== "method" && _fnType[0].data.kind !== "func")) {
        err(ctx, `cannot call non-function ${fn.getText()}`);
        throw "Unreachable";
      }

      this.visit(fn); // emit code to evaluate the callable thing
      this.visit(args); // emit code to evaluate each arg

      ICall.emit(this.bc, ctx).setArgc(argc).setGo(false);

      const fnType = _fnType[0].data;
      switch (fnType.kind) {
        case "func":
          return fnType.results.length;
        case "method":
          return fnType.func.results.length;
      }
    } else if (ctx._base) {
      const baseType = this.typeComp(ctx._base);
      if (baseType.length === 0) {
        err(ctx, `could not find type for ${ctx.getText()}`);
      }
      if (baseType!.length > 1) {
        err(ctx, `bad access on ${ctx.getText()} - multiple values on LHS`);
      }

      const basetype = baseType[0];
      const fieldname = ctx.selector().name().getText();

      const field = Type.findField(basetype, fieldname);
      if (field !== undefined) {
        this.visit(ctx._base); // get the base onto the OS
        if (basetype.data.kind === "ptr") {
          IDeref.emit(this.bc);
        }
        ILoadStructField.emit(this.bc).setOffset(field.offset);
        return 1;
      }

      // We couldn't find a field. Try finding a method.
      const method = Type.findMethod(basetype, fieldname);
      if (method === undefined) {
        err(ctx, `type ${basetype.name} has no field or method ${fieldname}`);
        throw "Unreachable";
      }

      const [frame, offset] = this.env.lookupExn(method.fullname, ctx); // @todo better error message
      ILoadName.emit(this.bc).setFrame(frame).setOffset(offset);
      this.visit(ctx._base); // evaluate base
      switch (basetype.data.kind) {
        case "ptr":
          if (!method.f.pointer) {
            IDeref.emit(this.bc);
          }
          break;
        default:
          if (method.f.pointer) {
            IPackPtr.emit(this.bc);
          }
          break;
      }
      ILoadMethod.emit(this.bc);

      return 1;
    } else {
      throw "Unreachable";
    }
  };

  /**
   * Compiles an expression list. Expression lists should only appear on the RHS of
   * assignments (short var decls and assignments).
   */
  visitExprList = (ctx: ExprListContext): number => {
    const len = ctx.expr_list().flatMap((expr) => this.typeComp(expr)).length;
    this.visitChildren(ctx);
    return len;
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
    if (ctx.MINUS()) {
      IUnaryOp.emit(this.bc).setOp(UnaryOp.Sub);
    } else if (ctx.PLUS()) {
      IUnaryOp.emit(this.bc).setOp(UnaryOp.Add);
    } else if (ctx.STAR()) {
      IDeref.emit(this.bc);
    } else if (ctx.AMPERSAND()) {
      IPackPtr.emit(this.bc);
    } else if (ctx.RCV()) {
      IChanRead.emit(this.bc);
    } else if (ctx.BANG()) {
      IUnaryOp.emit(this.bc).setOp(UnaryOp.Not);
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

  visitLitBool = (ctx: LitBoolContext): number => {
    const raw = ctx.getText();
    if (raw === "true") {
      ILoadBool.emit(this.bc).set(true);
      // ILoadGlobal.emit(this.bc).setGlobal(Global["true"]);
    } else if (raw === "false") {
      ILoadBool.emit(this.bc).set(false);
      // ILoadGlobal.emit(this.bc).setGlobal(Global["false"]);
    } else {
      err(ctx, `unexpected boolean literal ${raw}`);
    }
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
      ILoadC.emit(this.bc).setKind(ConstantKind.Int64).setVal(val);
    } else if (ctx.FLOAT()) {
      val = parseFloat(raw);
      ILoadC.emit(this.bc).setKind(ConstantKind.Float64).setVal(val);
    } else {
      throw "Unreachable";
    }
    return 1;
  };

  visitLitNil = (_ctx: LitNilContext): number => {
    // nil pointer
    IPush.emit(this.bc).setVal(-1);
    IPackPtr.emit(this.bc);
    // ILoadGlobal.emit(this.bc).setGlobal(Global["nil"]);
    return 1;
  };

  visitLitFunc = (ctx: LitFuncContext): number => {
    // @todo: identical to visitFuncDecl (except the assignment) - let's put
    // them into a common fn?
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
        const typ = this.resolveTypeExn(param.type_());
        this.tenv.set(name, typ);
      });
    this.visit(ctx.funcBody()); // compile the body
    this.tenv.popFrame();
    this.env.popFrame();

    // Note that we *always* emit this, even if the function body has explicit
    // return statement(s). These instructions will not affect those functions
    // (since we'll never reach these lines). Instead these are meant for
    // functions without return statements.
    IReturn.emit(this.bc);

    ldf.setLast(this.bc.prevWc()); // goroutines need this info to know where to stop
    goto.setWhere(this.bc.wc());

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

    let ty: Type.T;

    if (ctx.typeName()) {
      const tyname = ctx.typeName().getText();
      ty = this.tstore.lookupExn(tyname, ctx);
    } else if (ctx.structType()) {
      ty = Type.resolveStructTypeExn(ctx.structType(), this.tstore);
    } else {
      throw "Unreachable";
    }

    switch (ty.data.kind) {
      case "struct":
        const fieldc = ty.data.fields.length;
        const given = ctx
          .keyedElems()
          .keyedElem_list()
          .map((elem) => [elem.lname().getText(), elem.expr()] as [string, ExprContext]);
        const expected = ty.data.fields.map(([name, _]) => name);
        const sorted = sortFields(given, expected);
        if (sorted.length !== fieldc) {
          err(ctx, `in struct literal - expected ${fieldc} fields, but got ${sorted.length}`);
        }

        for (let i = 0; i < fieldc; ++i) {
          const rhs = this.typeComp(given[i][1]);
          if (rhs.length != 1) {
            err(ctx, `multiple values assigned to one field at ${given[i][1].getText()}`);
            throw "Unreachable";
          }
          const lhs = ty.data.fields[i][1];
          if (!Type.equal(lhs, rhs[0])) {
            err(ctx, `field type mismatch - expected ${lhs.name} but got ${rhs[0].name}`);
            throw "Unreachable";
          }
        }

        sorted.reverse().forEach(([_, expr]) => this.visit(expr)); // compile each field's expression
        IPackStruct.emit(this.bc).setFieldc(fieldc);
        break;
      default:
        err(ctx, `expected struct but got ${ty.data.kind}`);
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
  /**
   * Address of the done instruction.
   */
  doneAt: number;
}

/**
 * Compiles given source code into bytecode.
 */
export const compileSrc = (src: string): CompileResult => {
  const chars = new CharStream(src);
  const lexer = new GoLexer(chars);
  const tokens = new CommonTokenStream(lexer);
  const parser = new GoParser(tokens);

  parser.buildParseTrees = true;
  parser.removeErrorListeners();
  const parseErrHandler = new ParsingErrorHandler();
  parser.addErrorListener(parseErrHandler);

  const tree = parser.prog(); // parse the program

  if (parseErrHandler.errs.length > 0) {
    for (const err of parseErrHandler.errs) {
      console.error(err);
    }
    throw new ParseError(`encountered ${parseErrHandler.errs.length} errors while parsing`);
  }

  const ass = new Assembler();
  ass.visit(tree);

  const bytecode = ass.bc.code();
  const srcMap = ass.bc.srcMap();
  const strPool = ass.strPool;
  const doneAt = ass.doneAt;

  return { bytecode, srcMap, strPool, doneAt };
};

class ParsingErrorHandler extends ErrorListener<Token> {
  errs: string[] = [];
  syntaxError(
    _recognizer: Recognizer<Token>,
    _offendingSymbol: Token,
    line: number,
    column: number,
    msg: string,
    _e: RecognitionException | undefined,
  ): void {
    const err = `line ${line}:${column} ${msg}`;
    this.errs.push(err);
  }
}
