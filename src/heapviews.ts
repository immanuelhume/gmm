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

import assert from "assert";
import { Address, Stack, StrPool } from "./util";

interface Memory {
  heap: DataView;
  free: number;
}

interface Registers {
  pc: number;
  rts: Stack<Address>;
  os: Stack<Address>;
  env: EnvView;
}

/**
 * State machine, at run time.
 */
export interface MachineState extends Memory, Registers {
  bytecode: DataView;
  srcMap: Map<number, number>;
  strPool: StrPool;
  globals: Record<Global, Address>;
}

/**
 * These are data types used at runtime, i.e. the different kinds of nodes we
 * find in memory. They don't necessarily correspond to JS or Go data types.
 * */
export enum DataType {
  Float64 = 0x00,
  Int64,
  Channel,
  String,
  Fn,
  Builtin,
  Global,
  Frame,
  Env,
  CallFrame,
  BlockFrame,
  Pointer,
  Tuple,
}

/**
 * Global values, which should eventually appear as singletons in memory.
 */
export enum Global {
  True = 0x00,
  False,
  Nil,
}

export const globalSymbols: Record<Global, string> = {
  [Global.True]: "true",
  [Global.False]: "false",
  [Global.Nil]: "nil",
};

export const enum BuiltinId {
  Debug = 0x00,
  Panic,
  New,
}
export const builtinSymbols = ["dbg", "panic", "new"]; // need a list for deterministic order
export const builtinName2Id: Record<string, BuiltinId> = {
  dbg: BuiltinId.Debug,
  panic: BuiltinId.Panic,
  new: BuiltinId.New,
};
export const builtinId2Name: Record<BuiltinId, string> = {
  [BuiltinId.Debug]: "dbg",
  [BuiltinId.Panic]: "panic",
  [BuiltinId.New]: "new",
};

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

  protected childByteOffset(i: number): Address {
    return this.addr + (i + 1) * wordSize;
  }
  getChild(i: number): number {
    return this.heap.getFloat64(this.childByteOffset(i));
  }
  setChild(i: number, val: number): void {
    return this.heap.setFloat64(this.childByteOffset(i), val);
  }

  // getBoolChild(i: boolean): boolean {
  //   return this.heap.get
  // }

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
  setValue(value: number): void {
    this.setChild(0, value);
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
    const addr = allocate(mem, DataType.Frame, 0, numVars);
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
    return this.nrefs();
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
    const addr = allocate(mem, DataType.Env, 0, numFrames);
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
    return this.nrefs();
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
    // The PC is a literal value (it's an offset of the bytecode) but the env
    // is a child (it's a pointer to an environment node).
    const addr = allocate(state, DataType.CallFrame, 1, 1);
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
    // The PC is a literal value (it's an offset of the bytecode) but the env
    // is a child (it's a pointer to an environment node).
    const addr = allocate(state, DataType.BlockFrame, 0, 1);
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
 * ┌──────┬──┬───┐
 * │header│pc│env│
 * └──────┴──┴───┘
 */
export class FnView extends NodeView {
  static allocate(state: Memory): FnView {
    const addr = allocate(state, DataType.Fn, 1, 1);
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
    const name = builtinId2Name[this.getId()];
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
 * Represents a global.
 *
 * ┌──────┬─────────┐
 * │header│global ID│
 * └──────┴─────────┘
 */
export class GlobalView extends NodeView {
  static allocate(state: Memory): GlobalView {
    const addr = allocate(state, DataType.Global, 1, 0);
    return new GlobalView(state.heap, addr);
  }

  constructor(heap: DataView, addr: Address) {
    super(heap, addr);
    this.checkType(DataType.Global);
  }

  toString(): string {
    const repr = globalSymbols[this.getKind()];
    return `Global { ${repr} }`;
  }

  getKind(): Global {
    return this.getChild(0);
  }
  setKind(kind: Global): GlobalView {
    this.setChild(0, kind);
    return this;
  }

  isBoolean(): boolean {
    const kind = this.getKind();
    return kind === Global.True || kind === Global.False;
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

export class PointerView extends NodeView {
  // @todo
  static allocate(state: Memory): PointerView {
    const addr = allocate(state, DataType.Pointer, 0, 1);
    return new PointerView(state.heap, addr);
  }
  constructor(heap: DataView, addr: Address) {
    super(heap, addr);
    this.checkType(DataType.Pointer);
  }
  toString(): string {
    return "";
  }
  get(i: number): Address {
    return this.getChild(i);
  }
  set(i: number, data: Address): PointerView {
    this.setChild(i, data);
    return this;
  }
  dereference(i: number): Address {
    return this.get(this.get(i));
  }
}
class ChannelView extends NodeView {
  // @todo
  toString(): string {
    return "";
  }
}

const nodeClass: Record<DataType, { new (heap: DataView, addr: Address, ctx?: HeapContext): NodeView }> = {
  [DataType.Float64]: Float64View,
  [DataType.Int64]: Int64View,
  [DataType.Channel]: ChannelView,
  [DataType.String]: StringView,
  [DataType.Fn]: FnView,
  [DataType.Builtin]: BuiltinView,
  [DataType.Global]: GlobalView,
  [DataType.Frame]: FrameView,
  [DataType.Env]: EnvView,
  [DataType.CallFrame]: CallFrameView,
  [DataType.BlockFrame]: BlockFrameView,
  [DataType.Pointer]: PointerView,
  [DataType.Tuple]: TupleView,
};
