/* A scratchpad to test the parser */

import { CharStream, CommonTokenStream } from 'antlr4'
import GoLexer from './antlr/GoLexer'
import GoParser from './antlr/GoParser'
import { readFileSync } from 'fs'

import { Assembler } from './compiler'

const input = readFileSync("scratch.go").toString()
const chars = new CharStream(input)
const lexer = new GoLexer(chars)
const tokens = new CommonTokenStream(lexer)
const parser = new GoParser(tokens)
parser.buildParseTrees = true
const tree = parser.prog()

console.log(tree.toStringTree(parser.ruleNames, parser))

const compiler = new Assembler()
compiler.visit(tree)
