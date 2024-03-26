/**
 * Runs a go file.
 *
 * Usage: ts-node run.ts myfile.go
 */

import { readFileSync } from "fs";
import { compileSrc } from "../src/compiler";
import { InstrView, Opcode } from "../src/instructions";
import { Address, ArrayStack, fmtAddress } from "../src/util";
import {
  BuiltinView,
  EnvView,
  FrameView,
  Global,
  GlobalView,
  MachineState,
  StringView,
  builtinName2Id,
  builtinSymbols,
  globalSymbols,
} from "../src/heapviews";
import { microcode } from "../src/eval";

const run = (filename: string) => {
  const src = readFileSync(filename).toString();
  const { bytecode, srcMap, strPool } = compileSrc(src);
  const heap = new DataView(new ArrayBuffer(1028));
  const mem = { heap, free: 0 };

  // Before initializing the rest of the machine, let's allocate all builtins.
  const builtinAddrs = builtinSymbols.map((builtin) => BuiltinView.allocate(mem).setId(builtinName2Id[builtin]).addr);
  const globalEnv = EnvView.allocate(mem, 1);
  const globalFrame = FrameView.allocate(mem, builtinSymbols.length);
  builtinAddrs.forEach((addr, i) => globalFrame.set(i, addr));
  globalEnv.setFrame(0, globalFrame.addr);

  // We'll also allocate all the strings...
  for (const strId of strPool.ids()) {
    const addr = StringView.allocate(mem).setId(strId).addr;
    strPool.setAddress(strId, addr);
  }

  // And the globals.
  const globals: Record<Global, Address> = {
    [Global.True]: -1,
    [Global.False]: -1,
    [Global.Nil]: -1,
  };
  for (const glob in Global) {
    const kind = Number(glob);
    if (isNaN(kind)) {
      continue;
    }
    const addr = GlobalView.allocate(mem).setKind(kind).addr;
    globals[kind as Global] = addr;
  }

  // Now our globals are initialized, and we are ready to create the machine.
  let state: MachineState = {
    ...mem,

    pc: 0,
    rts: new ArrayStack(),
    os: new ArrayStack(),
    env: globalEnv,

    bytecode,
    srcMap,
    strPool,
    globals,
  };

  const toHexList = (xs: number[]) => xs.map((x) => `${x.toString(16)}`).join(", ");

  while (true) {
    const instr = InstrView.of(bytecode, state.pc);
    const opcode = instr.opcode();
    console.log(
      `\x1b[33m${fmtAddress(state.pc)}\x1b[0m ${instr.toString()}`.padEnd(64, " "),
      toHexList(state.os.toList()).padEnd(64, " "),
      toHexList(state.rts.toList()).padEnd(64, " "),
    );
    if (opcode === Opcode.Done) break;
    microcode[opcode](state);
  }
};

const filename = process.argv[2];
run(filename);
