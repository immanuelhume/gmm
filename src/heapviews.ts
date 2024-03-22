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
import { Address, Stack } from "./util";

/**
 * State machine, at run time.
 */
export interface MachineState {
  bytecode: DataView;
  pc: number;
  rts: Stack<Address>;
  os: Stack<Address>;
  env: EnvView;
  heap: DataView;
  free: number;
  globals: Record<Global, Address>;
}

/**
 * These are data types used at runtime, i.e. the different kinds of nodes we
 * find in memory. They don't necessarily correspond to JS or Go data types.
 * */
export const enum DataType {
  Float64 = 0x00,
  Int64,
  Channel,
  String,
  Fn,
  Frame,
  Env,
  CallFrame,
  BlockFrame,
  Pointer,
}

/**
 * Global values, which should eventually appear as singletons in memory.
 */
const enum Global {
  True,
  False,
  Nil,
}

/* Each word is a Float64. So 8 bytes. */
const wordSize = 8;

/**
 * Allocates some memory, ensuring that the first byte is set to the provided
 * data type. We don't export this! So all allocation should happen within this
 * module.
 *
 * @param state    Runtime machine state.
 * @param dataType The type of this node.
 * @param nvals    Number of values (numbers in and of themselves)
 * @param nrefs    Number of references (addresses of other nodes)
 *
 * @return Address of the newly allocated node.
 */
const allocate = (state: MachineState, dataType: DataType, nvals: number, nrefs: number): number => {
  const addr = state.free;
  const totalSize = 1 + nvals + nrefs;
  state.free += wordSize * totalSize;
  state.heap.setUint8(addr, dataType);
  state.heap.setUint8(addr + 1, nvals);
  state.heap.setUint8(addr + 2, nrefs);
  return addr;
};

/**
 * Copies, deeply, the node at a certain address. Does not care what type of
 * node it is.
 */
export const clone = (state: MachineState, addr: Address): Address => {
  const node = new NodeView(state.heap, addr);
  const dataType = node.dataType();
  const nvals = node.nvals();
  const nchil = node.nrefs();

  const addr2 = allocate(state, dataType, nvals, nchil);
  const node2 = new NodeView(state.heap, addr2);

  for (let i = 0; i < nvals; ++i) {
    const val = node.getChild(i);
    node2.setChild(i, val);
  }

  // We'll need to recursively copy the children
  for (let i = 0; i < nchil; ++i) {
    const child = clone(state, node.getChild(i + nvals));
    node2.setChild(i + nvals, child);
  }

  return addr2;
};

/* [NodeView] encapsulates how we access parts of nodes. */
export class NodeView {
  protected readonly heap: DataView;
  readonly addr: Address;

  constructor(heap: DataView, addr: Address) {
    this.heap = heap;
    this.addr = addr;
  }

  static getDataType(heap: DataView, addr: Address): DataType {
    return heap.getUint8(addr);
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

  checkType(type: DataType) {
    assert(this.dataType() === type);
  }
}

/**
 * ┌──────┬──────┐
 * │header│number│
 * └──────┴──────┘
 */
export class Float64View extends NodeView {
  static allocate(state: MachineState): Float64View {
    const addr = allocate(state, DataType.Float64, 1, 0);
    return new Float64View(state.heap, addr);
  }

  constructor(heap: DataView, addr: Address) {
    super(heap, addr);
    this.checkType(DataType.Float64);
  }

  getValue(): number {
    return this.getChild(0);
  }
  setValue(value: number): void {
    this.setChild(0, value);
  }
}

/**
 * ┌──────┬──────┐
 * │header│number│
 * └──────┴──────┘
 */
export class Int64View extends NodeView {
  static allocate(state: MachineState): Int64View {
    const addr = allocate(state, DataType.Int64, 1, 0);
    return new Int64View(state.heap, addr);
  }

  constructor(heap: DataView, addr: Address) {
    super(heap, addr);
    this.checkType(DataType.Int64);
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
  static allocate(state: MachineState, numVars: number): FrameView {
    const addr = allocate(state, DataType.Frame, 0, numVars);
    return new FrameView(state.heap, addr);
  }

  constructor(heap: DataView, addr: Address) {
    super(heap, addr);
    this.checkType(DataType.Frame);
  }

  get(i: number): Address {
    return this.getChild(i);
  }
  set(i: number, addr: Address): void {
    return this.setChild(i, addr);
  }

  numVars(): number {
    return this.nrefs();
  }
}

/**
 * A list of frames. Start searching from the left.
 *
 * ┌──────┬──────┬───┬──────┐
 * │header│frame1│...│framen│
 * └──────┴──────┴───┴──────┘
 */
class EnvView extends NodeView {
  static allocate(state: MachineState, numFrames: number): EnvView {
    const addr = allocate(state, DataType.Frame, 0, numFrames);
    return new EnvView(state.heap, addr);
  }

  constructor(heap: DataView, addr: Address) {
    super(heap, addr);
    this.checkType(DataType.Frame);
  }

  /* Allocates a new environment node which includes the provided frames. */
  extend(state: MachineState, ...newFrames: Address[]): EnvView {
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
  static allocate(state: MachineState): CallFrameView {
    // The PC is a literal value (it's an offset of the bytecode) but the env
    // is a child (it's a pointer to an environment node).
    const addr = allocate(state, DataType.CallFrame, 1, 1);
    return new CallFrameView(state.heap, addr);
  }

  constructor(heap: DataView, addr: Address) {
    super(heap, addr);
    this.checkType(DataType.CallFrame);
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
 * Represents a function (a closure).
 *
 * ┌──────┬──┬───┐
 * │header│pc│env│
 * └──────┴──┴───┘
 */
export class FnView extends NodeView {
  static allocate(state: MachineState): FnView {
    const addr = allocate(state, DataType.Fn, 1, 1);
    return new FnView(state.heap, addr);
  }

  constructor(heap: DataView, addr: Address) {
    super(heap, addr);
    this.checkType(DataType.Fn);
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
