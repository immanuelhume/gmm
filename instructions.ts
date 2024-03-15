import assert from "assert"

export const enum Opcode {
  BinaryOp = 0x00,
  UnaryOp,
  Return,
  Call,
  Goto,
  LoadFn,
  LookupIdent,
  Assign,
  Jof,
  EnterBlock,
  ExitBlock,
}

export interface Emitter {
  code(): DataView
  reserve(opcode: Opcode, size: number): number
}

abstract class InstrView {
  protected readonly bytecode: DataView
  protected readonly addr: number

  constructor(bytecode: DataView, addr: number) {
    this.bytecode = bytecode
    this.addr = addr
  }

  opcode(): Opcode {
    return this.bytecode.getUint8(this.addr)
  }
}

export class LoadFn extends InstrView {
  static size = 10

  static emit(w: Emitter): LoadFn {
    const pc = w.reserve(Opcode.LoadFn, LoadFn.size)
    return new LoadFn(w.code(), pc)
  }

  constructor(bytecode: DataView, addr: number) {
    super(bytecode, addr)
    assert(this.opcode() === Opcode.LoadFn)
  }

  getArgc(): number {
    return this.bytecode.getUint8(this.addr + 1)
  }

  setArgc(argc: number): LoadFn {
    this.bytecode.setUint8(this.addr + 1, argc)
    return this
  }

  getPc(): number {
    return this.bytecode.getFloat64(this.addr + 2)
  }

  setPc(addr: number): LoadFn {
    this.bytecode.setFloat64(this.addr + 2, addr)
    return this
  }
}

export class IdentLoc extends InstrView {
  static size = 3

  static emit(w: Emitter): IdentLoc {
    const pc = w.reserve(Opcode.LookupIdent, IdentLoc.size)
    return new IdentLoc(w.code(), pc)
  }

  constructor(bytecode: DataView, addr: number) {
    super(bytecode, addr)
    assert(this.opcode() === Opcode.LookupIdent)
  }

  getFrame(): number {
    return this.bytecode.getUint8(this.addr + 1)
  }
  setFrame(frame: number): IdentLoc {
    this.bytecode.setUint8(this.addr + 1, frame)
    return this
  }

  getOffset(): number {
    return this.bytecode.getUint8(this.addr + 2)
  }
  setOffset(offset: number): IdentLoc {
    this.bytecode.setUint8(this.addr + 2, offset)
    return this
  }
}

export class Goto extends InstrView {
  static size = 9

  static emit(w: Emitter): Goto {
    const pc = w.reserve(Opcode.Goto, Goto.size)
    return new Goto(w.code(), pc)
  }

  constructor(bytecode: DataView, addr: number) {
    super(bytecode, addr)
    assert(this.opcode() === Opcode.Goto)
  }

  getWhere(): number {
    return this.bytecode.getFloat64(this.addr + 1)
  }

  setWhere(where: number) {
    this.bytecode.setFloat64(this.addr + 1, where)
  }
}

export class Call extends InstrView {
  static size = 2
  static emit(w: Emitter): Call {
    const pc = w.reserve(Opcode.Call, Call.size)
    return new Call(w.code(), pc)
  }
  constructor(bytecode: DataView, addr: number) {
    super(bytecode, addr)
    assert(this.opcode() === Opcode.Call)
  }
  setArgc(argc: number) {
    return this.bytecode.setUint8(this.addr + 1, argc)
  }
}

export class Jof extends InstrView {
  static size = 9

  static emit(w: Emitter): Jof {
    const pc = w.reserve(Opcode.Jof, Jof.size)
    return new Jof(w.code(), pc)
  }

  constructor(bytecode: DataView, addr: number) {
    super(bytecode, addr)
    assert(this.opcode() === Opcode.Jof)
  }
  setWhere(where: number): Jof {
    this.bytecode.setFloat64(this.addr + 1, where)
    return this
  }
  getWhere(): number {
    return this.bytecode.getFloat64(this.addr + 1)
  }
}

export class Assign extends InstrView {
  static size = 1

  static emit(w: Emitter): Assign {
    const pc = w.reserve(Opcode.Assign, Assign.size)
    return new Assign(w.code(), pc)
  }
}

export class Return extends InstrView {
  static size = 1

  static emit(w: Emitter): Return {
    const pc = w.reserve(Opcode.Return, Return.size)
    return new Return(w.code(), pc)
  }
}

export class EnterBlock extends InstrView {
  static size = 1

  static emit(w: Emitter): EnterBlock {
    const pc = w.reserve(Opcode.EnterBlock, EnterBlock.size)
    return new EnterBlock(w.code(), pc)
  }
}

export class ExitBlock extends InstrView {
  static size = 1

  static emit(w: Emitter): ExitBlock {
    const pc = w.reserve(Opcode.ExitBlock, ExitBlock.size)
    return new ExitBlock(w.code(), pc)
  }
}
