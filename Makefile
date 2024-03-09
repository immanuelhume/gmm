parser:
	antlr4 -Dlanguage=TypeScript -visitor -o antlr GoLexer.g4 GoParser.g4
