parser grammar GoParser ;

options { tokenVocab = GoLexer ; }

prog : stmt* ;

stmt : (decl 
	| shortVarDecl 
	| assignment 
	| returnStmt 
	| forStmt 
	| goStmt 
	| breakStmt 
	| continueStmt 
	| sendStmt
	| exprStmt 
	) eos ;

sendStmt : channel=expr '<-' rhs=expr ;

breakStmt : BREAK ;
continueStmt : CONTINUE ;

goStmt : 'go' primaryExpr ; // [primaryExpr] has to be a function call

assignment : lhs=expr '=' rhs=expr ;

forStmt : 'for' (condition) block ;

condition : expr ;

exprStmt : expr ;

returnStmt : 'return' expr ;

expr : primaryExpr | unaryOp expr | expr binaryOp expr ;

primaryExpr : ident | lit | primaryExpr args ;

args : '(' arg (',' arg)* ','? | arg? ')';
arg : expr | type ; // functions like [make] take in types as params...

block : '{' stmt* '}' ;

unaryOp : '-' | '+' | '<-' ;

binaryOp : logicalOp | relOp | numericOp  ;
logicalOp : '||' | '&&' ;
relOp : '==' | '!=' | '<' | '<=' | '>' | '>=' ;
numericOp : '+' | '-' | '*' | '/' ;

shortVarDecl : ident ':=' expr ;

decl : funcDecl | varDecl | typeDecl ;
typeDecl : 'type' ident type ;
varDecl : 'var' ident type ('=' expr)? ;

funcDecl : 'func' ident signature funcBody ;
signature : '(' params ')' type? ;
funcBody : block ;

litFunc : 'func' signature funcBody ;

params : param (',' param)* ','? | param? ;
param : ident typeName ;

type : typeName | typeLit ;
typeName : ident ;
typeLit : structType | channelType | pointerType ;

channelType : 'chan' elementType ;
elementType : type ;

pointerType : '*' baseType ;
baseType : type ;

structType : 'struct' '{' (fieldDecl eos)* '}' ;
fieldDecl : ident type ;

ident : WORD ;

lit : number | litStr | litNil | litFunc;

litNil : NIL ;
litStr : LIT_STR ;

number : INT | FLOAT ;

eos : EOS | EOF ;
