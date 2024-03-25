/**
 * A tool to view compiled bytecode - we'll compile a go source file and dump
 * the bytecode out.
 *
 * Usage: ts-node dump.ts myfile.go
 */

import { readFileSync } from "fs";
import { compileSrc } from "../src/compiler";
import { InstrView, Opcode } from "../src/instructions";
import { fmtAddress } from "../src/util";

const dumpfile = (filename: string) => {
  const src = readFileSync(filename).toString();
  const bytecode = compileSrc(src);
  let pc = 0;
  while (true) {
    const instr = InstrView.of(bytecode, pc);
    console.log(`${fmtAddress(pc)} : ${instr.toString()}`);
    pc += instr.size;
    if (instr.opcode() == Opcode.Done) break;
  }
};

const filename = process.argv[2];
dumpfile(filename);
