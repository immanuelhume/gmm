/**
 * Runs a go file.
 *
 * Usage: ts-node run.ts myfile.go
 */

import { readFileSync } from "fs";
import { compileSrc } from "../src/compiler";
import { InstrView, Opcode } from "../src/instructions";
import { ArrayStack, fmtAddress } from "../src/util";
import { BuiltinView, EnvView, FrameView, MachineState, builtinName2Id, builtins } from "../src/heapviews";
import { microcode } from "../src/eval";

const run = (filename: string) => {
  const src = readFileSync(filename).toString();
  const bytecode = compileSrc(src);
  const heap = new DataView(new ArrayBuffer(1028));
  const mem = { heap, free: 0 };

  // Before initializing the rest of the machine, let's allocate all builtins.
  const builtinAddrs = builtins.map((builtin) => BuiltinView.allocate(mem).setId(builtinName2Id[builtin]).addr);
  const globalEnv = EnvView.allocate(mem, 1);
  const globalFrame = FrameView.allocate(mem, builtins.length);
  builtinAddrs.forEach((addr, i) => globalFrame.set(i, addr));
  globalEnv.setFrame(0, globalFrame.addr);

  // Now our globals are initialized, and we are ready to create the machine.
  let state: MachineState = {
    ...mem,
    bytecode,
    pc: 0,
    rts: new ArrayStack(),
    os: new ArrayStack(),
    env: globalEnv,
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
