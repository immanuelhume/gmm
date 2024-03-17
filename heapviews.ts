/**
 * Memory model:
 *
 * - Everything is represented as a "node" on the heap
 * - Each node consists of >= 1 words
 * - Each word is 64 bits
 *
 * - The first word of each node is a metadata block
 *   ┌──────────────────┬─────────────┬───┐
 *   │data type (8 bits)│size (8 bits)│...│
 *   └──────────────────┴─────────────┴───┘
 *   - The size refers to no. of words in this node including the metadata
 *     block
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
 * data type.
 *
 * @param state    Runtime machine state.
 * @param dataType The type of this node.
 * @param size     Number of words to allocate.
 *
 * @return Address of the newly allocated node.
 */
const allocate = (state: MachineState, dataType: DataType, size: number): number => {
  const addr = state.free;
  state.free += wordSize * size;
  state.heap.setUint8(addr, dataType);
  state.heap.setUint8(addr + 1, size);
  return addr;
};

/* [NodeView] encapsulates how we access parts of nodes. */
export class NodeView {
  protected readonly heap: DataView;
  readonly addr: Address;

  protected constructor(heap: DataView, addr: Address) {
    this.heap = heap;
    this.addr = addr;
  }

  static getDataType(heap: DataView, addr: Address): DataType {
    return heap.getUint8(addr);
  }

  dataType(): DataType {
    return NodeView.getDataType(this.heap, this.addr);
  }

  size(): number {
    return this.heap.getUint8(this.addr + 1);
  }

  protected childByteOffset(i: number): Address {
    return this.addr + (i + 1) * 8;
  }

  protected getChild(i: number): number {
    return this.heap.getFloat64(this.childByteOffset(i));
  }

  protected setChild(i: number, value: number): void {
    this.heap.setFloat64(this.childByteOffset(i), value);
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
    const addr = allocate(state, DataType.Float64, 2);
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
    const addr = allocate(state, DataType.Int64, 2);
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
    const addr = allocate(state, DataType.Frame, numVars + 1);
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
    return this.size() - 1;
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
    const addr = allocate(state, DataType.Frame, numFrames + 1);
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
    return this.size() - 1;
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
    const addr = allocate(state, DataType.CallFrame, 3);
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
    const addr = allocate(state, DataType.Fn, 3);
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
