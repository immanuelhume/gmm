import assert from "assert";
import { fmtAddress } from "./util";
import { ParserRuleContext } from "antlr4";

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
  LoadNameLoc,
  LoadName,
  LoadC,
  LoadStr,
  Push,
  PackTuple,
  Done,
}

/**
 * An interface representing a bytecode array which can be emitted into during
 * compilation.
 */
export interface Emitter {
  code(): DataView;
  /**
   * Reserves [size] bytes, and sets the opcode.
   */
  reserve(opcode: Opcode, size: number, ctx?: ParserRuleContext): number;
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

  abstract toString(): string;
  abstract readonly size: number;

  /**
   * Produces an instance of some subclass of [InstrView], based on the opcode
   * passed in. The return type is [InstrView] though so its uses are limited.
   */
  static of(bytecode: DataView, addr: number): InstrView {
    const opcode = bytecode.getUint8(addr) as Opcode;
    return new opcodeClass[opcode](bytecode, addr);
  }

  static _opcode(bytecode: DataView, addr: number): Opcode {
    return bytecode.getUint8(addr);
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
  static size = 2;
  readonly size = 2;

  static emit(w: Emitter, ctx?: ParserRuleContext): IBinaryOp {
    const pc = w.reserve(Opcode.BinaryOp, IBinaryOp.size, ctx);
    return new IBinaryOp(w.code(), pc);
  }

  toString(): string {
    const sym = binaryOpSyms[this.op()];
    return `BinaryOp ${sym}`;
  }

  constructor(bytecode: DataView, addr: number) {
    super(bytecode, addr);
    assert(this.opcode() === Opcode.BinaryOp);
  }

  op(): BinaryOp {
    return this.bytecode.getUint8(this.addr + 1);
  }
  setOp(op: BinaryOp): IBinaryOp {
    this.bytecode.setUint8(this.addr + 1, op);
    return this;
  }
}

export class IUnaryOp extends InstrView {
  static size = 2;
  readonly size = 2;

  static emit(w: Emitter, ctx?: ParserRuleContext): IUnaryOp {
    const pc = w.reserve(Opcode.UnaryOp, IUnaryOp.size, ctx);
    return new IUnaryOp(w.code(), pc);
  }

  toString(): string {
    const sym = unaryOpSyms[this.op()];
    return `UnaryOp ${sym}`;
  }

  constructor(bytecode: DataView, addr: number) {
    super(bytecode, addr);
    assert(this.opcode() === Opcode.UnaryOp);
  }

  op(): UnaryOp {
    return this.bytecode.getUint8(this.addr + 1);
  }
}

export class ILoadFn extends InstrView {
  static size = 10;
  readonly size = 10;

  static emit(w: Emitter, ctx?: ParserRuleContext): ILoadFn {
    const pc = w.reserve(Opcode.LoadFn, ILoadFn.size, ctx);
    return new ILoadFn(w.code(), pc);
  }

  toString(): string {
    return `LoadFn argc:${this.argc()} pc:${fmtAddress(this.pc())}`;
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
export class ILoadNameLoc extends InstrView {
  static size = 3;
  readonly size = 3;

  static emit(w: Emitter, ctx?: ParserRuleContext): ILoadNameLoc {
    const pc = w.reserve(Opcode.LoadNameLoc, ILoadNameLoc.size, ctx);
    return new ILoadNameLoc(w.code(), pc);
  }

  toString(): string {
    return `LoadNameLoc frame:${this.frame()} offset:${this.offset()}`;
  }

  constructor(bytecode: DataView, addr: number) {
    super(bytecode, addr);
    assert(this.opcode() === Opcode.LoadNameLoc);
  }

  frame(): number {
    return this.bytecode.getUint8(this.addr + 1);
  }
  setFrame(frame: number): ILoadNameLoc {
    this.bytecode.setUint8(this.addr + 1, frame);
    return this;
  }

  offset(): number {
    return this.bytecode.getUint8(this.addr + 2);
  }
  setOffset(offset: number): ILoadNameLoc {
    this.bytecode.setUint8(this.addr + 2, offset);
    return this;
  }
}

/**
 * Looks up the value of an identifier, and pushes it onto OS. For instance,
 * if [fact] is bound a function, then the [LoadName] evaluates to the
 * address for that function.
 *
 * The instruction's layout is identical to [LoadNameLoc].
 *
 * ┌────────┬───────┬────────┐
 * │ opcode │ frame │ offset │
 * └────────┴───────┴────────┘
 *  1        1       1
 */
export class ILoadName extends InstrView {
  static size = 3;
  readonly size = 3;

  static emit(w: Emitter, ctx?: ParserRuleContext): ILoadName {
    const pc = w.reserve(Opcode.LoadName, ILoadName.size, ctx);
    return new ILoadName(w.code(), pc);
  }

  toString(): string {
    return `LoadName frame:${this.frame()} offset:${this.offset()}`;
  }

  constructor(bytecode: DataView, addr: number) {
    super(bytecode, addr);
    assert(this.opcode() === Opcode.LoadName);
  }

  frame(): number {
    return this.bytecode.getUint8(this.addr + 1);
  }
  setFrame(frame: number): ILoadNameLoc {
    this.bytecode.setUint8(this.addr + 1, frame);
    return this;
  }

  offset(): number {
    return this.bytecode.getUint8(this.addr + 2);
  }
  setOffset(offset: number): ILoadNameLoc {
    this.bytecode.setUint8(this.addr + 2, offset);
    return this;
  }
}

export class IGoto extends InstrView {
  static size = 9;
  readonly size = 9;

  static emit(w: Emitter, ctx?: ParserRuleContext): IGoto {
    const pc = w.reserve(Opcode.Goto, IGoto.size, ctx);
    return new IGoto(w.code(), pc);
  }

  toString(): string {
    return `Goto ${fmtAddress(this.where())}`;
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
  readonly size = 2;

  static emit(w: Emitter, ctx?: ParserRuleContext): ICall {
    const pc = w.reserve(Opcode.Call, ICall.size, ctx);
    return new ICall(w.code(), pc);
  }

  toString(): string {
    return `Call argc:${this.argc()}`;
  }

  constructor(bytecode: DataView, addr: number) {
    super(bytecode, addr);
    assert(this.opcode() === Opcode.Call);
  }

  argc(): number {
    return this.bytecode.getUint8(this.addr + 1);
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
  readonly size = 9;

  static emit(w: Emitter, ctx?: ParserRuleContext): IJof {
    const pc = w.reserve(Opcode.Jof, IJof.size, ctx);
    return new IJof(w.code(), pc);
  }

  toString(): string {
    return `Jof ${fmtAddress(this.where())}`;
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
 * ┌──────┬──────┐
 * │opcode│# vars│
 * └──────┴──────┘
 */
export class IAssign extends InstrView {
  static size = 2;
  readonly size = 2;

  static emit(w: Emitter, ctx?: ParserRuleContext): IAssign {
    const pc = w.reserve(Opcode.Assign, IAssign.size, ctx);
    return new IAssign(w.code(), pc);
  }

  toString(): string {
    return `Assign ${this.getCount()}`;
  }

  getCount(): number {
    return this.bytecode.getUint8(this.addr + 1);
  }
  setCount(n: number): IAssign {
    this.bytecode.setUint8(this.addr + 1, n);
    return this;
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
  readonly size = 1;

  static emit(w: Emitter, ctx?: ParserRuleContext): IReturn {
    const pc = w.reserve(Opcode.Return, IReturn.size, ctx);
    return new IReturn(w.code(), pc);
  }

  toString(): string {
    return `Return`;
  }
}

/**
 * Enters a block.
 *
 * ┌──────┬────────────┐
 * │opcode│# local vars│
 * └──────┴────────────┘
 * 1       1
 */
export class IEnterBlock extends InstrView {
  static size = 2;
  readonly size = 2;

  static emit(w: Emitter, ctx?: ParserRuleContext): IEnterBlock {
    const pc = w.reserve(Opcode.EnterBlock, IEnterBlock.size, ctx);
    return new IEnterBlock(w.code(), pc);
  }

  numVars(): number {
    return this.bytecode.getUint8(this.addr + 1);
  }
  setNumVars(n: number): IEnterBlock {
    this.bytecode.setUint8(this.addr + 1, n);
    return this;
  }

  toString(): string {
    return `EnterBlock`;
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

  static emit(w: Emitter, ctx?: ParserRuleContext): IExitBlock {
    const pc = w.reserve(Opcode.ExitBlock, IExitBlock.size, ctx);
    return new IExitBlock(w.code(), pc);
  }

  toString(): string {
    return `ExitBlock`;
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

  static emit(w: Emitter, ctx?: ParserRuleContext): IPop {
    const pc = w.reserve(Opcode.Pop, IPop.size, ctx);
    return new IPop(w.code(), pc);
  }

  toString(): string {
    return `Pop`;
  }
}

export class ILoadC extends InstrView {
  // @todo: we'll need to support all kinds of constants, e.g. numbers (of various types),
  // true, false, strings
  static size = 9;
  readonly size = 9;

  static emit(w: Emitter, ctx?: ParserRuleContext): ILoadC {
    const pc = w.reserve(Opcode.LoadC, ILoadC.size, ctx);
    return new ILoadC(w.code(), pc);
  }

  constructor(bytecode: DataView, addr: number) {
    super(bytecode, addr);
    assert(this.opcode() === Opcode.LoadC);
  }

  toString(): string {
    return `LoadC ${this.val()}`;
  }

  val(): number {
    return this.bytecode.getFloat64(this.addr + 1);
  }
  setVal(val: number): ILoadC {
    this.bytecode.setFloat64(this.addr + 1, val);
    return this;
  }
}

/**
 * Loads a string constant.
 *
 * ┌──────┬─────────┐
 * │opcode│string ID│
 * └──────┴─────────┘
 */
export class ILoadStr extends InstrView {
  static size = 9;
  readonly size = 9;

  static emit(w: Emitter, ctx?: ParserRuleContext): ILoadStr {
    const pc = w.reserve(Opcode.LoadStr, ILoadStr.size, ctx);
    return new ILoadStr(w.code(), pc);
  }

  constructor(bytecode: DataView, addr: number) {
    super(bytecode, addr);
    assert(this.opcode() === Opcode.LoadStr);
  }

  toString(): string {
    return `LoadStr ${this.id()}`;
  }

  id(): number {
    return this.bytecode.getFloat64(this.addr + 1);
  }
  setId(id: number): ILoadStr {
    this.bytecode.setFloat64(this.addr + 1, id);
    return this;
  }
}

export class IPush extends InstrView {
  static size = 9;
  readonly size = 9;

  static emit(w: Emitter, ctx?: ParserRuleContext): IPush {
    const pc = w.reserve(Opcode.Push, IPush.size, ctx);
    return new IPush(w.code(), pc);
  }

  constructor(bytecode: DataView, addr: number) {
    super(bytecode, addr);
    assert(this.opcode() === Opcode.Push);
  }

  toString(): string {
    return `Push ${this.val()}`;
  }

  val(): number {
    return this.bytecode.getFloat64(this.addr + 1);
  }
  setVal(val: number): IPush {
    this.bytecode.setFloat64(this.addr + 1, val);
    return this;
  }
}

/**
 * Packs n items on the OS into a tuple.
 */
export class IPackTuple extends InstrView {
  static size = 9;
  readonly size = 9;

  static emit(w: Emitter, ctx?: ParserRuleContext): IPackTuple {
    const pc = w.reserve(Opcode.PackTuple, IPackTuple.size, ctx);
    return new IPackTuple(w.code(), pc);
  }

  constructor(bytecode: DataView, addr: number) {
    super(bytecode, addr);
    assert(this.opcode() === Opcode.PackTuple);
  }

  toString(): string {
    return `PackTuple ${this.len()}`;
  }

  len(): number {
    return this.bytecode.getFloat64(this.addr + 1);
  }
  setLen(size: number): IPackTuple {
    this.bytecode.setFloat64(this.addr + 1, size);
    return this;
  }
}

export class IDone extends InstrView {
  static size = 1;
  readonly size = 1;

  static emit(w: Emitter, ctx?: ParserRuleContext): IDone {
    const pc = w.reserve(Opcode.Done, IDone.size, ctx);
    return new IDone(w.code(), pc);
  }

  toString(): string {
    return `Done`;
  }
}

/**
 * Map from each opcode (a number) to its class.
 */
const opcodeClass: Record<Opcode, { new (bytecode: DataView, addr: number): InstrView }> = {
  [Opcode.Return]: IReturn,
  [Opcode.Call]: ICall,
  [Opcode.Goto]: IGoto,
  [Opcode.LoadFn]: ILoadFn,
  [Opcode.Assign]: IAssign,
  [Opcode.Jof]: IJof,
  [Opcode.EnterBlock]: IEnterBlock,
  [Opcode.ExitBlock]: IExitBlock,
  [Opcode.Pop]: IPop,
  [Opcode.LoadNameLoc]: ILoadNameLoc,
  [Opcode.LoadName]: ILoadName,
  [Opcode.BinaryOp]: IBinaryOp,
  [Opcode.UnaryOp]: IUnaryOp,
  [Opcode.LoadC]: ILoadC,
  [Opcode.LoadStr]: ILoadStr,
  [Opcode.Push]: IPush,
  [Opcode.PackTuple]: IPackTuple,
  [Opcode.Done]: IDone,
};

/**
 * String representations of each unary operation. Used for debugging.
 */
const unaryOpSyms: Record<UnaryOp, string> = {
  [UnaryOp.Add]: "+",
  [UnaryOp.Sub]: "-",
};

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
  [BinaryOp.Geq]: ">=",
};
