parser grammar GoParser ;

options { tokenVocab = GoLexer ; }

// The toplevel is not a sequence of statements, but declarations only!
prog : (decl eos)* ;

stmt : decl
	| returnStmt
	| forStmt
	| ifStmt
	| goStmt
	| breakStmt
	| continueStmt
	| sendStmt
	| block
	| simpleStmt
	;

simpleStmt : assignment | shortVarDecl | exprStmt ;

// [defer] statements would be good to add

ifStmt : 'if' cond=expr cons=block ('else' alt) ;

alt : ifStmt | block ;

sendStmt : channel=expr '<-' rhs=expr ;

breakStmt : BREAK ;
continueStmt : CONTINUE ;

goStmt : 'go' primaryExpr ; // [primaryExpr] has to be a function call

assignment : lhs=lvalue '=' rhs=expr ;

lvalue : ident ; // we'll expand this as the project progresses

forStmt : 'for' (condition | forClause | rangeClause) block ;

condition : expr ;

forClause : init=simpleStmt? ';' cond=condition? ';' post=simpleStmt? ;

rangeClause : ( exprList '=' | identList ':=' ) 'range' expr ;

exprStmt : expr ;

returnStmt : 'return' expr? ;

expr : primaryExpr | unaryOp expr | lhs=expr binaryOp rhs=expr ;
exprList : expr (',' expr)* ;

primaryExpr : ident 
	| lit
	| fn=primaryExpr args
	| base=primaryExpr selector
	;

selector : '.' ident ;

args : '(' arg (',' arg)* ','? | ')';
arg : expr | type ; // functions like [make] take in types as params...

block : '{' (stmt eos)* '}' ;

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
typeLit : structType | channelType ; // exclude pointer types for now - we probably won't need them

channelType : 'chan' elementType ;
elementType : type ;

structType : 'struct' '{' (fieldDecl eos)* '}' ;
fieldDecl : ident type ;

ident : WORD ;
identList : ident (',' ident)* ;

lit : number | litStr | litNil | litFunc ;

litNil : NIL ;
litStr : LIT_STR ;

number : INT | FLOAT ;

eos : EOS | EOF ;
