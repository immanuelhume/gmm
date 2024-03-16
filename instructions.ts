import assert from "assert";
import { fmtAddress } from "./util";

export const enum Opcode {
  BinaryOp = 0x00,
  UnaryOp,
  Return,
  Call,
  Goto,
  LoadFn,
  Assign,
  Jof,
  EnterBlock,
  ExitBlock,
  Pop,
  IdentLoc,
  Ident,
  LoadC,
  Done,
}

/**
 * An interface representing a bytecode array which can be emitted into during
 * compilation.
 */
export interface Emitter {
  code(): DataView;
  reserve(opcode: Opcode, size: number): number;
}

/**
 * Some common functionality for viewing instructions. This helps us keep the
 * "layout" of each instruction encapsulated in one place (rather than randomly
 * accessing different byte offsets directly). Useful for both compiling and
 * executing.
 */
export abstract class InstrView {
  protected readonly bytecode: DataView;
  protected readonly addr: number;

  abstract toString(): string
  abstract readonly size: number

  /**
   * Produces an instance of some subclass of [InstrView], based on the opcode
   * passed in. The return type is [InstrView] though so its uses are limited.
   */
  static of(bytecode: DataView, addr: number): InstrView {
    const opcode = bytecode.getUint8(addr) as Opcode
    return new opcodeClass[opcode](bytecode, addr)
  }

  constructor(bytecode: DataView, addr: number) {
    this.bytecode = bytecode;
    this.addr = addr;
  }

  opcode(): Opcode {
    return this.bytecode.getUint8(this.addr);
  }
}

export const enum UnaryOp {
  Add = 0x00,
  Sub,
}

export const enum BinaryOp {
  Add = 0x00,
  Sub,
  Mul,
  Div,
  Eq,
  Neq,
  L,
  Leq,
  G,
  Geq,
}

export class IBinaryOp extends InstrView {
  static size = 2
  readonly size = 2;

  static emit(w: Emitter): IBinaryOp {
    const pc = w.reserve(Opcode.BinaryOp, IBinaryOp.size)
    return new IBinaryOp(w.code(), pc)
  }

  toString(): string {
    const sym = binaryOpSyms[this.op()]
    return `BinaryOp ${sym}`
  }

  constructor(bytecode: DataView, addr: number) {
    super(bytecode, addr);
    assert(this.opcode() === Opcode.BinaryOp);
  }

  op(): BinaryOp {
    return this.bytecode.getUint8(this.addr + 1)
  }
  setOp(op: BinaryOp) : IBinaryOp {
    this.bytecode.setUint8(this.addr + 1, op)
    return this
  }
}

export class IUnaryOp extends InstrView {
  static size = 2
  readonly size = 2

  static emit(w: Emitter): IUnaryOp {
    const pc = w.reserve(Opcode.UnaryOp, IUnaryOp.size);
    return new IUnaryOp(w.code(), pc);
  }

  toString(): string {
    const sym = unaryOpSyms[this.op()]
    return `UnaryOp ${sym}`
  }

  constructor(bytecode: DataView, addr: number) {
    super(bytecode, addr);
    assert(this.opcode() === Opcode.UnaryOp);
  }

  op(): UnaryOp {
    return this.bytecode.getUint8(this.addr + 1)
  }
}

export class ILoadFn extends InstrView {
  static size = 10;
  readonly size = 10;

  static emit(w: Emitter): ILoadFn {
    const pc = w.reserve(Opcode.LoadFn, ILoadFn.size);
    return new ILoadFn(w.code(), pc);
  }

  toString(): string {
    return `LoadFn argc:${this.argc()} pc:${fmtAddress(this.pc())}`
  }

  constructor(bytecode: DataView, addr: number) {
    super(bytecode, addr);
    assert(this.opcode() === Opcode.LoadFn);
  }

  argc(): number {
    return this.bytecode.getUint8(this.addr + 1);
  }
  setArgc(argc: number): ILoadFn {
    this.bytecode.setUint8(this.addr + 1, argc);
    return this;
  }

  pc(): number {
    return this.bytecode.getFloat64(this.addr + 2);
  }
  setPc(addr: number): ILoadFn {
    this.bytecode.setFloat64(this.addr + 2, addr);
    return this;
  }
}

/**
 * Looks up the *address* of an identifier, i.e. the address of its slot in a
 * frame. We need this to faciliate more flexible assignments.
 *
 * ┌────────┬───────┬────────┐
 * │ opcode │ frame │ offset │
 * └────────┴───────┴────────┘
 *  1        1       1
 */
export class IIdentLoc extends InstrView {
  static size = 3;
  readonly size = 3;

  static emit(w: Emitter): IIdentLoc {
    const pc = w.reserve(Opcode.IdentLoc, IIdentLoc.size);
    return new IIdentLoc(w.code(), pc);
  }

  toString(): string {
    return `IdentLoc frame:${this.frame()} offset:${this.offset()}`
  }

  constructor(bytecode: DataView, addr: number) {
    super(bytecode, addr);
    assert(this.opcode() === Opcode.IdentLoc);
  }

  frame(): number {
    return this.bytecode.getUint8(this.addr + 1);
  }
  setFrame(frame: number): IIdentLoc {
    this.bytecode.setUint8(this.addr + 1, frame);
    return this;
  }

  offset(): number {
    return this.bytecode.getUint8(this.addr + 2);
  }
  setOffset(offset: number): IIdentLoc {
    this.bytecode.setUint8(this.addr + 2, offset);
    return this;
  }
}

/**
 * Looks up the value of an identifier, and pushes it onto OS. For instance,
 * if [fact] is bound a function, then the [LookupIdent] evaluates to the
 * address for that function.
 *
 * The instruction's layout is identical to [IdentLoc].
 *
 * ┌────────┬───────┬────────┐
 * │ opcode │ frame │ offset │
 * └────────┴───────┴────────┘
 *  1        1       1
 */
export class IIdent extends InstrView {
  static size = 3;
  readonly size = 3;

  static emit(w: Emitter): IIdent {
    const pc = w.reserve(Opcode.Ident, IIdent.size);
    return new IIdent(w.code(), pc);
  }

  toString(): string {
    return `Ident frame:${this.frame()} offset:${this.offset()}`
  }

  constructor(bytecode: DataView, addr: number) {
    super(bytecode, addr);
    assert(this.opcode() === Opcode.Ident);
  }

  frame(): number {
    return this.bytecode.getUint8(this.addr + 1);
  }
  setFrame(frame: number): IIdentLoc {
    this.bytecode.setUint8(this.addr + 1, frame);
    return this;
  }

  offset(): number {
    return this.bytecode.getUint8(this.addr + 2);
  }
  setOffset(offset: number): IIdentLoc {
    this.bytecode.setUint8(this.addr + 2, offset);
    return this;
  }
}

export class IGoto extends InstrView {
  static size = 9;
  readonly size = 9

  static emit(w: Emitter): IGoto {
    const pc = w.reserve(Opcode.Goto, IGoto.size);
    return new IGoto(w.code(), pc);
  }

  toString(): string {
    return `Goto ${fmtAddress(this.where())}`
  }

  constructor(bytecode: DataView, addr: number) {
    super(bytecode, addr);
    assert(this.opcode() === Opcode.Goto);
  }

  where(): number {
    return this.bytecode.getFloat64(this.addr + 1);
  }
  setWhere(where: number) {
    this.bytecode.setFloat64(this.addr + 1, where);
  }
}

/**
 * Call a function. There should be [argc] arguments on the operand stack (in
 * reverse order when read from top down).
 *
 * ┌────────┬──────┐
 * │ opcode │ argc │
 * └────────┴──────┘
 *  1        1
 */
export class ICall extends InstrView {
  static size = 2;
  readonly size = 2

  static emit(w: Emitter): ICall {
    const pc = w.reserve(Opcode.Call, ICall.size);
    return new ICall(w.code(), pc);
  }

  toString(): string {
    return `Call argc:${this.argc()}`
  }

  constructor(bytecode: DataView, addr: number) {
    super(bytecode, addr);
    assert(this.opcode() === Opcode.Call);
  }

  argc(): number {
    return this.bytecode.getUint8(this.addr + 1)
  }
  setArgc(argc: number) {
    return this.bytecode.setUint8(this.addr + 1, argc);
  }
}

/**
 * Jump-on-false.
 *
 * ┌────────┬────┐
 * │ opcode │ pc │
 * └────────┴────┘
 *  1        8
 */
export class IJof extends InstrView {
  static size = 9;
  readonly size = 9

  static emit(w: Emitter): IJof {
    const pc = w.reserve(Opcode.Jof, IJof.size);
    return new IJof(w.code(), pc);
  }

  toString(): string {
    return `Jof ${fmtAddress(this.where())}`
  }

  constructor(bytecode: DataView, addr: number) {
    super(bytecode, addr);
    assert(this.opcode() === Opcode.Jof);
  }

  where(): number {
    return this.bytecode.getFloat64(this.addr + 1);
  }
  setWhere(where: number): IJof {
    this.bytecode.setFloat64(this.addr + 1, where);
    return this;
  }
}

/**
 * Assigns a value to some location. Location should be at the top of the
 * stack, and the value right below that.
 *
 * ┌──────┐
 * │opcode│
 * └──────┘
 */
export class IAssign extends InstrView {
  static size = 1;
  readonly size = 1

  static emit(w: Emitter): IAssign {
    const pc = w.reserve(Opcode.Assign, IAssign.size);
    return new IAssign(w.code(), pc);
  }

  toString(): string {
    return `Assign`
  }
}

/**
 * Returns. The return value, if any, will be at the top of the stack.
 *
 * ┌──────┐
 * │opcode│
 * └──────┘
 */
export class IReturn extends InstrView {
  static size = 1;
  readonly size = 1

  static emit(w: Emitter): IReturn {
    const pc = w.reserve(Opcode.Return, IReturn.size);
    return new IReturn(w.code(), pc);
  }

  toString(): string {
    return `Return`
  }
}

/**
 * Enters a block.
 *
 * ┌──────┐
 * │opcode│
 * └──────┘
 */
export class IEnterBlock extends InstrView {
  static size = 1;
  readonly size = 1;

  static emit(w: Emitter): IEnterBlock {
    const pc = w.reserve(Opcode.EnterBlock, IEnterBlock.size);
    return new IEnterBlock(w.code(), pc);
  }

  toString(): string {
    return `EnterBlock`
  }
}

/**
 * Exits a block.
 *
 * ┌──────┐
 * │opcode│
 * └──────┘
 */
export class IExitBlock extends InstrView {
  static size = 1;
  readonly size = 1;

  static emit(w: Emitter): IExitBlock {
    const pc = w.reserve(Opcode.ExitBlock, IExitBlock.size);
    return new IExitBlock(w.code(), pc);
  }

  toString(): string {
    return `ExitBlock`
  }
}

/**
 * Pops one item from the operand stack.
 *
 * ┌──────┐
 * │opcode│
 * └──────┘
 */
export class IPop extends InstrView {
  static size = 1;
  readonly size = 1;

  static emit(w: Emitter): IPop {
    const pc = w.reserve(Opcode.Pop, IPop.size);
    return new IPop(w.code(), pc);
  }

  toString(): string {
    return `Pop`
  }
}

export class ILoadC extends InstrView {
  static size = 9;
  readonly size = 9;

  static emit(w: Emitter): ILoadC {
    const pc = w.reserve(Opcode.LoadC, ILoadC.size);
    return new ILoadC(w.code(), pc);
  }

  toString(): string {
    return `LoadC ${this.val()}`
  }

  val(): number {
    return this.bytecode.getFloat64(this.addr + 1)
  }
  setVal(val: number) : ILoadC {
    this.bytecode.setFloat64(this.addr + 1, val)
    return this
  }
}

export class IDone extends InstrView {
  static size = 1
  readonly size = 1

  static emit(w: Emitter): IDone {
    const pc = w.reserve(Opcode.Done, IDone.size);
    return new IDone(w.code(), pc);
  }

  toString(): string {
    return `Done`
  }
}

/**
 * Map from each opcode (a number) to its class.
 */
const opcodeClass: Record<Opcode, { new(bytecode: DataView, addr: number): InstrView }> = {
  [Opcode.Return]: IReturn,
  [Opcode.Call]: ICall,
  [Opcode.Goto]: IGoto,
  [Opcode.LoadFn]: ILoadFn,
  [Opcode.Assign]: IAssign,
  [Opcode.Jof]: IJof,
  [Opcode.EnterBlock]: IEnterBlock,
  [Opcode.ExitBlock]: IExitBlock,
  [Opcode.Pop]: IPop,
  [Opcode.IdentLoc]: IIdentLoc,
  [Opcode.Ident]: IIdent,
  [Opcode.BinaryOp]: IBinaryOp,
  [Opcode.UnaryOp]: IUnaryOp,
  [Opcode.LoadC]: ILoadC,
  [Opcode.Done]: IDone,
}

/**
 * String representations of each unary operation. Used for debugging.
 */
const unaryOpSyms: Record<UnaryOp, string> = {
  [UnaryOp.Add]: "+",
  [UnaryOp.Sub]: "-"
}

/**
 * String representations of each binary operation. Used for debugging.
 */
const binaryOpSyms: Record<BinaryOp, string> = {
  [BinaryOp.Add]: "+",
  [BinaryOp.Sub]: "-",
  [BinaryOp.Mul]: "*",
  [BinaryOp.Div]: "/",
  [BinaryOp.Eq]: "==",
  [BinaryOp.Neq]: "!=",
  [BinaryOp.L]: "<",
  [BinaryOp.Leq]: "<=",
  [BinaryOp.G]: ">",
  [BinaryOp.Geq]: ">="
}

