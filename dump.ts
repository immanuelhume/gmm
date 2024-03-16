/**
 * A tool to view compiled bytecode - we'll compile and dump the bytecode out.
 * 
 * Usage: ts-node dump.ts myfile.go
 */

import { CharStream, CommonTokenStream } from 'antlr4'
import GoLexer from './antlr/GoLexer'
import GoParser from './antlr/GoParser'
import { readFileSync } from 'fs'
import { Assembler } from './compiler'
import { InstrView, Opcode } from './instructions'
import { fmtAddress } from './util'

const viewFile = (filename: string) => {
  const input = readFileSync(filename).toString()
  const chars = new CharStream(input)
  const lexer = new GoLexer(chars)
  const tokens = new CommonTokenStream(lexer)
  const parser = new GoParser(tokens)
  const tree = parser.prog()

  const ass = new Assembler()
  ass.visit(tree)

  let pc = 0
  const bytecode = ass.bytecode.code()
  while (true) {
    const instr = InstrView.of(bytecode, pc)
    console.log(`${fmtAddress(pc)} : ${instr.toString()}`)
    pc += instr.size
    if (instr.opcode() == Opcode.Done) break;
  }
}

const filename = process.argv[2]
viewFile(filename)
