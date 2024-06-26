/**
 * Memory model:
 *
 * - Everything is represented as a "node" on the heap
 * - Each node consists of >= 1 words
 * - Each word is 64 bits
 * - Words after the metadata block are called "children"
 *
 * - The first word of each node is a metadata block
 *   ┌──────────────────┬───────────────────┬───────────────────────┬───┐
 *   │data type (8 bits)│no. values (8 bits)│no. references (8 bits)│...│
 *   └──────────────────┴───────────────────┴───────────────────────┴───┘
 *   - Values: values in and of themselves (e.g. the actual value for an int)
 *   - Refs  : number representing location of another node
 *   	 - It's important to distinguish values from references! Within the words
 *       following the header block we'll store all the values first, then
 *       the chidren.
 */

import { Address, Stack, StrPool, fmtAddress } from "./util";

export interface Memory {
  heap: DataView;
  free: number;
}

/**
 * These are data types used at runtime, i.e. the different kinds of nodes we
 * find in memory. They don't necessarily correspond to JS or Go data types.
 * */
export enum DataType {
  Float64 = 0x00,
  Int64,
  String,
  Fn,
  Builtin,
  Method,
  Bool,
  Frame,
  Env,
  CallFrame,
  BlockFrame,
  Pointer,
  Tuple,
  Struct,
  Lvalue,
}
//
// /**
//  * Global values, which should eventually appear as singletons in memory.
//  */
// export enum Global {
//   "true" = 0x00,
//   "false",
//   "nil",
// }

export enum BuiltinId {
  "dbg" = 0x00,
  "panic",
  "Mutex::Lock",
  "Mutex::Unlock",
}
export const builtinSymbols: string[] = Object.keys(BuiltinId).filter((key) => isNaN(Number(key)));
export const builtinIds: number[] = Object.keys(BuiltinId)
  .map((key) => Number(key))
  .filter((key) => !isNaN(key));

/* Each word is a Float64. So 8 bytes. */
export const wordSize = 8;

/**
 * Allocates some memory, ensuring that the first byte is set to the provided
 * data type. We don't export this! So all allocation should happen within this
 * module.
 *
 * @param mem      Runtime machine state.
 * @param dataType The type of this node.
 * @param nvals    Number of values (numbers in and of themselves)
 * @param nrefs    Number of references (addresses of other nodes)
 *
 * @return Address of the newly allocated node.
 */
const allocate = (mem: Memory, dataType: DataType, nvals: number, nrefs: number): number => {
  const addr = mem.free;
  const totalSize = 1 + nvals + nrefs;
  mem.free += wordSize * totalSize;
  mem.heap.setUint8(addr, dataType);
  mem.heap.setUint8(addr + 1, nvals);
  mem.heap.setUint8(addr + 2, nrefs);
  return addr;
};

/**
 * Copies, deeply, the node at a certain address. Does not care what type of
 * node it is.
 *
 * This gets stuck for cyclic structures! @todo should it be a shallow copy?
 */
export const clone = (mem: Memory, addr: Address): Address => {
  const node = NodeView.of(mem.heap, addr);
  const dataType = node.dataType();
  const nvals = node.nvals();
  const nrefs = node.nrefs();

  const addr2 = allocate(mem, dataType, nvals, nrefs);
  const node2 = NodeView.of(mem.heap, addr2);

  for (let i = 0; i < nvals; ++i) {
    const val = node.getChild(i);
    node2.setChild(i, val);
  }

  // We'll need to recursively copy the children
  for (let i = 0; i < nrefs; ++i) {
    const ref = clone(mem, node.getChild(i + nvals));
    node2.setChild(i + nvals, ref);
  }

  return addr2;
};

/**
 * Basically memcpy.
 */
export const copy = (mem: Memory, src: Address, dst: Address) => {
  const node = NodeView.of(mem.heap, src);
  for (let i = 0; i < node.size(); ++i) {
    const offset = i * wordSize;
    const data = mem.heap.getFloat64(src + offset);
    mem.heap.setFloat64(dst + offset, data);
  }
};

interface HeapContext {
  strPool: StrPool;
}

/* [NodeView] encapsulates how we access parts of nodes. */
export abstract class NodeView {
  protected readonly heap: DataView;
  readonly addr: Address;

  abstract toString(): string;

  constructor(heap: DataView, addr: Address) {
    this.heap = heap;
    this.addr = addr;
  }

  static getDataType(heap: DataView, addr: Address): DataType {
    return heap.getUint8(addr);
  }

  static of(heap: DataView, addr: Address, ctx?: HeapContext): NodeView {
    const nodeType = NodeView.getDataType(heap, addr);
    return new nodeClass[nodeType](heap, addr, ctx);
  }

  dataType(): DataType {
    return NodeView.getDataType(this.heap, this.addr);
  }

  nvals(): number {
    return this.heap.getUint8(this.addr + 1);
  }

  nrefs(): number {
    return this.heap.getUint8(this.addr + 2);
  }

  /**
   * Size in words.
   */
  size(): number {
    return 1 + this.nvals() + this.nrefs();
  }

  protected childByteOffset(i: number): Address {
    return this.addr + (i + 1) * wordSize;
  }
  getChild(i: number): number {
    return this.heap.getFloat64(this.childByteOffset(i));
  }
  setChild(i: number, val: number): void {
    return this.heap.setFloat64(this.childByteOffset(i), val);
  }

  checkType(type: DataType) {
    if (this.dataType() !== type) {
      const want = DataType[type];
      const got = DataType[this.dataType()];
      throw new NodeTypeError(`Expected ${want}, got ${got}`);
    }
  }
}

class NodeTypeError extends Error {}

/**
 * ┌──────┬──────┐
 * │header│number│
 * └──────┴──────┘
 */
export class Float64View extends NodeView {
  static allocate(mem: Memory): Float64View {
    const addr = allocate(mem, DataType.Float64, 1, 0);
    return new Float64View(mem.heap, addr);
  }

  constructor(heap: DataView, addr: Address) {
    super(heap, addr);
    this.checkType(DataType.Float64);
  }

  toString(): string {
    return `Float64 { ${this.getValue()} }`;
  }

  getValue(): number {
    return this.getChild(0);
  }
  setValue(value: number): Float64View {
    this.setChild(0, value);
    return this;
  }
}

/**
 * ┌──────┬──────┐
 * │header│number│
 * └──────┴──────┘
 */
export class Int64View extends NodeView {
  static allocate(mem: Memory): Int64View {
    const addr = allocate(mem, DataType.Int64, 1, 0);
    return new Int64View(mem.heap, addr);
  }

  constructor(heap: DataView, addr: Address) {
    super(heap, addr);
    this.checkType(DataType.Int64);
  }

  toString(): string {
    return `Int64 { ${this.getValue()} }`;
  }

  getValue(): number {
    return this.getChild(0);
  }
  setValue(value: number): Int64View {
    this.setChild(0, value);
    return this;
  }
}

/**
 * Frame which stores values for identifiers. Variable sized!
 *
 * ┌──────┬────┬───┬────┐
 * │header│var1│...│varn│
 * └──────┴────┴───┴────┘
 */
export class FrameView extends NodeView {
  static allocate(mem: Memory, numVars: number): FrameView {
    const addr = allocate(mem, DataType.Frame, numVars, 0);
    return new FrameView(mem.heap, addr);
  }

  constructor(heap: DataView, addr: Address) {
    super(heap, addr);
    this.checkType(DataType.Frame);
  }

  toString(): string {
    const vars = this.varList();
    const varStrs = vars.map((v) => NodeView.of(this.heap, v).toString()).join("\n");
    return `Frame {
${varStrs}
}`;
  }

  get(i: number): Address {
    return this.getChild(i);
  }
  set(i: number, addr: Address): void {
    return this.setChild(i, addr);
  }

  getVarLoc(i: number): Address {
    return this.childByteOffset(i);
  }

  numVars(): number {
    return this.nvals();
  }

  varList(): Address[] {
    const vars = [];
    for (let i = 0; i < this.numVars(); ++i) {
      vars.push(this.get(i));
    }
    return vars;
  }
}

/**
 * A list of frames. Start searching from the left.
 *
 * ┌──────┬──────┬───┬──────┐
 * │header│frame1│...│framen│
 * └──────┴──────┴───┴──────┘
 */
export class EnvView extends NodeView {
  static allocate(mem: Memory, numFrames: number): EnvView {
    const addr = allocate(mem, DataType.Env, numFrames, 0);
    return new EnvView(mem.heap, addr);
  }

  constructor(heap: DataView, addr: Address) {
    super(heap, addr);
    this.checkType(DataType.Env);
  }

  toString(): string {
    const frames = this.frameList().join(", ");
    return `EnvView { ${frames} }`;
  }

  /* Allocates a new environment node which includes the provided frames. */
  extend(state: Memory, ...newFrames: Address[]): EnvView {
    const totalFrames = this.numFrames() + newFrames.length;
    const ret = EnvView.allocate(state, totalFrames);
    for (let i = 0; i < newFrames.length; ++i) {
      ret.setFrame(i, newFrames[i]);
    }
    for (let i = 0; i < this.numFrames(); ++i) {
      ret.setFrame(newFrames.length + i, this.getFrame(i));
    }
    return ret;
  }

  getFrame(i: number): Address {
    return this.getChild(i);
  }
  setFrame(i: number, addr: Address): void {
    return this.setChild(i, addr);
  }

  numFrames(): number {
    return this.nvals();
  }

  frameList(): Address[] {
    const ret = [];
    for (let i = 0; i < this.numFrames(); ++i) {
      ret.push(this.getFrame(i));
    }
    return ret;
  }
}

/**
 * A call frame. This is used to record where a function should jump back to
 * when it's done.
 *
 * ┌──────┬──┬───┐
 * │header│pc│env│
 * └──────┴──┴───┘
 */
export class CallFrameView extends NodeView {
  static allocate(state: Memory): CallFrameView {
    const addr = allocate(state, DataType.CallFrame, 2, 0);
    return new CallFrameView(state.heap, addr);
  }

  constructor(heap: DataView, addr: Address) {
    super(heap, addr);
    this.checkType(DataType.CallFrame);
  }

  toString(): string {
    return ""; // @todo
  }

  getPc(): Address {
    return this.getChild(0);
  }
  setPc(pc: Address): void {
    this.setChild(0, pc);
  }

  getEnv(): EnvView {
    return new EnvView(this.heap, this.getChild(1));
  }
  setEnv(env: EnvView) {
    this.setChild(1, env.addr);
  }
}

/**
 * A block frame. Used to restore environments.
 *
 * ┌──────┬───┐
 * │header│env│
 * └──────┴───┘
 */
export class BlockFrameView extends NodeView {
  static allocate(state: Memory): BlockFrameView {
    const addr = allocate(state, DataType.BlockFrame, 1, 0);
    return new BlockFrameView(state.heap, addr);
  }

  constructor(heap: DataView, addr: Address) {
    super(heap, addr);
    this.checkType(DataType.BlockFrame);
  }

  toString(): string {
    return ""; // @todo
  }

  getEnv(): EnvView {
    return new EnvView(this.heap, this.getChild(0));
  }
  setEnv(env: EnvView): BlockFrameView {
    this.setChild(0, env.addr);
    return this;
  }
}

/**
 * Represents a function (a closure).
 *
 * ┌──────┬─────┬────┬───┐
 * │header│first│last│env│
 * └──────┴─────┴────┴───┘
 */
export class FnView extends NodeView {
  static allocate(state: Memory): FnView {
    const addr = allocate(state, DataType.Fn, 3, 0);
    return new FnView(state.heap, addr);
  }

  constructor(heap: DataView, addr: Address) {
    super(heap, addr);
    this.checkType(DataType.Fn);
  }

  toString(): string {
    return `Fn { pc: ${this.getPc()}, env: ${this.getEnv()} }`;
  }

  getPc(): Address {
    return this.getChild(0);
  }
  setPc(pc: Address): FnView {
    this.setChild(0, pc);
    return this;
  }

  getLast(): Address {
    return this.getChild(1);
  }
  setLast(pc: Address): FnView {
    this.setChild(1, pc);
    return this;
  }

  getEnv(): EnvView {
    return new EnvView(this.heap, this.getChild(2));
  }
  setEnv(env: EnvView): FnView {
    this.setChild(2, env.addr);
    return this;
  }
}

/**
 * Represents a built-in function.
 *
 * ┌──────┬─────┐
 * │header│fn ID│
 * └──────┴─────┘
 */
export class BuiltinView extends NodeView {
  static allocate(state: Memory): BuiltinView {
    const addr = allocate(state, DataType.Builtin, 1, 0);
    return new BuiltinView(state.heap, addr);
  }

  constructor(heap: DataView, addr: Address) {
    super(heap, addr);
    this.checkType(DataType.Builtin);
  }

  toString(): string {
    const name = BuiltinId[this.getId()];
    return `Builtin { ${name} }`;
  }

  getId(): BuiltinId {
    return this.getChild(0);
  }
  setId(id: BuiltinId): BuiltinView {
    this.setChild(0, id);
    return this;
  }
}

/**
 * Represents a method. Method differ from functions in that there is a "captured"
 * receiver which should be used as a parameter.
 *
 * ┌──────┬────────┬────┐
 * │header│receiver│func│
 * └──────┴────────┴────┘
 */
export class MethodView extends NodeView {
  static allocate(state: Memory): MethodView {
    const addr = allocate(state, DataType.Method, 0, 2);
    return new MethodView(state.heap, addr);
  }

  constructor(heap: DataView, addr: Address) {
    super(heap, addr);
    this.checkType(DataType.Method);
  }

  toString(): string {
    const rcv = NodeView.of(this.heap, this.receiver()).toString();
    const func = this.fn().toString();
    return `Method { receiver: ${rcv}, func: ${func} }`;
  }

  receiver(): Address {
    return this.getChild(0);
  }

  setReceiver(rcv: Address): MethodView {
    this.setChild(0, rcv);
    return this;
  }

  /**
   * Address of the function node.
   */
  fn(): Address {
    return this.getChild(1);
  }
  setFn(func: Address): MethodView {
    this.setChild(1, func);
    return this;
  }
}

/**
 * Represents a boolean.
 *
 * ┌──────┬───────┐
 * │header│0 or 1 │
 * └──────┴───────┘
 */
export class BoolView extends NodeView {
  static allocate(state: Memory): BoolView {
    const addr = allocate(state, DataType.Bool, 1, 0);
    return new BoolView(state.heap, addr);
  }
  static tru(state: Memory): BoolView {
    return BoolView.allocate(state).set(true);
  }
  static fal(state: Memory): BoolView {
    return BoolView.allocate(state).set(false);
  }

  constructor(heap: DataView, addr: Address) {
    super(heap, addr);
    this.checkType(DataType.Bool);
  }

  toString(): string {
    return `Bool { ${this.get()} }`;
  }

  get(): boolean {
    return this.getChild(0) != 0;
  }
  set(b: boolean): BoolView {
    this.setChild(0, b ? 1 : 0);
    return this;
  }
}

/**
 * A string.
 */
export class StringView extends NodeView {
  strPool: StrPool | undefined;

  static allocate(state: Memory): StringView {
    const addr = allocate(state, DataType.String, 1, 0);
    return new StringView(state.heap, addr);
  }
  constructor(heap: DataView, addr: Address, ctx?: HeapContext) {
    super(heap, addr);
    this.checkType(DataType.String);
    this.strPool = ctx?.strPool;
  }
  toString(): string {
    if (this.strPool) {
      const id = this.getId();
      const s = this.strPool.getStr(id);
      if (s === undefined) {
        throw new Error(`String of id ${id} is undefined`); // @todo make better
      }
      return s;
    } else {
      return `String { <opaque> }`;
    }
  }
  getId(): number {
    return this.getChild(0);
  }
  setId(id: number): StringView {
    this.setChild(0, id);
    return this;
  }
}

/**
 * A collection of addresses. Not the same as a slice!
 */
export class TupleView extends NodeView {
  static allocate(state: Memory, n: number): TupleView {
    const addr = allocate(state, DataType.Tuple, 0, n);
    return new TupleView(state.heap, addr);
  }
  constructor(heap: DataView, addr: Address) {
    super(heap, addr);
    this.checkType(DataType.Tuple);
  }
  toString(): string {
    return ""; // @todo
  }
  get(i: number): Address {
    return this.getChild(i);
  }
  set(i: number, data: Address): TupleView {
    this.setChild(i, data);
    return this;
  }
  size(): number {
    return this.nrefs();
  }
}

/**
 * A collection of addresses. Not the same as a slice!
 */
export class StructView extends NodeView {
  static allocate(state: Memory, fieldc: number): StructView {
    const addr = allocate(state, DataType.Struct, 0, fieldc);
    return new StructView(state.heap, addr);
  }
  constructor(heap: DataView, addr: Address) {
    super(heap, addr);
    this.checkType(DataType.Struct);
  }
  toString(): string {
    const fields = [];
    for (let i = 0; i < this.fieldc(); ++i) {
      const field = this.getField(i);
      const fieldStr = NodeView.of(this.heap, field).toString();
      fields.push(fieldStr);
    }
    const fieldsStr = fields.join(", ");
    return `Struct { ${fieldsStr} }`;
  }
  getField(i: number): Address {
    return this.getChild(i);
  }
  setField(i: number, data: Address): StructView {
    this.setChild(i, data);
    return this;
  }
  getFieldLoc(i: number): Address {
    return this.childByteOffset(i);
  }
  fieldc(): number {
    return this.nrefs();
  }
}

export class PointerView extends NodeView {
  static allocate(state: Memory): PointerView {
    const addr = allocate(state, DataType.Pointer, 1, 0);
    return new PointerView(state.heap, addr);
  }
  constructor(heap: DataView, addr: Address) {
    super(heap, addr);
    this.checkType(DataType.Pointer);
  }
  toString(): string {
    const val = this.getValue();
    if (val === -1) {
      return "<nil>";
    }
    return `Pointer ${fmtAddress(this.getValue())}`;
  }
  isNil(): boolean {
    return this.getValue() === -1;
  }
  getValue(): Address {
    return this.getChild(0);
  }
  setValue(addr: Address): PointerView {
    this.setChild(0, addr);
    return this;
  }
}

export const enum LvalueKind {
  Variable = 0x00,
  Deref,
}

export class LvalueView extends NodeView {
  static allocate(state: Memory): LvalueView {
    const addr = allocate(state, DataType.Lvalue, 2, 0);
    return new LvalueView(state.heap, addr);
  }
  constructor(heap: DataView, addr: Address) {
    super(heap, addr);
    this.checkType(DataType.Lvalue);
  }
  toString(): string {
    return "Lvalue";
  }

  getKind(): LvalueKind {
    return this.getChild(0);
  }
  setKind(kind: LvalueKind): LvalueView {
    this.setChild(0, kind);
    return this;
  }
  getLoc(): Address {
    return this.getChild(1);
  }
  setLoc(addr: Address): LvalueView {
    this.setChild(1, addr);
    return this;
  }
}

const nodeClass: Record<DataType, { new (heap: DataView, addr: Address, ctx?: HeapContext): NodeView }> = {
  [DataType.Float64]: Float64View,
  [DataType.Int64]: Int64View,
  [DataType.String]: StringView,
  [DataType.Fn]: FnView,
  [DataType.Builtin]: BuiltinView,
  [DataType.Method]: MethodView,
  [DataType.Bool]: BoolView,
  [DataType.Frame]: FrameView,
  [DataType.Env]: EnvView,
  [DataType.CallFrame]: CallFrameView,
  [DataType.BlockFrame]: BlockFrameView,
  [DataType.Pointer]: PointerView,
  [DataType.Tuple]: TupleView,
  [DataType.Struct]: StructView,
  [DataType.Lvalue]: LvalueView,
};
