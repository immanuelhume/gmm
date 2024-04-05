parser grammar GoParser ;

options { tokenVocab = GoLexer ; }

// The toplevel is not a sequence of statements, but declarations only!
prog : (topLevelDecl eos)* ;

stmt : decl
	| returnStmt
	| forStmt
	| breakStmt
	| continueStmt
	| ifStmt
	| goStmt
	| sendStmt
	| block
	| simpleStmt
	;

simpleStmt : assignment | shortVarDecl | exprStmt ;

// [defer] statements would be good to add

ifStmt : 'if' cond=expr cons=block ('else' alt)? ;

alt : ifStmt | block ;

sendStmt : channel=expr '<-' rhs=expr ;

breakStmt : BREAK ;
continueStmt : CONTINUE ;

goStmt : 'go' primaryExpr ; // [primaryExpr] has to be a function call

assignment : lhs=lvalueList '=' rhs=exprList ;

lvalueList : lvalue (',' lvalue)* ;
lvalue : lname | field; // we'll define this properly in the future
lname : WORD ; // a name which appears on LHS
lnameList : lname (',' lname)* ;
field : base=primaryExpr '.' last=WORD ;

forStmt : 'for' (condition | forClause | rangeClause) block ;

condition : expr ;

forClause : init=simpleStmt? ';' cond=condition? ';' post=simpleStmt? ;

rangeClause : ( lvalueList '=' | lnameList ':=' ) 'range' expr ;

exprStmt : expr ;

returnStmt : 'return' exprList? ;

expr : primaryExpr
	| unaryOp expr
	| lhs=expr mulOp rhs=expr
	| lhs=expr addOp rhs=expr
	| lhs=expr relOp rhs=expr
	| lhs=expr logicalOp rhs=expr
	;

exprList : expr (',' expr)* ;

primaryExpr : lit
	| name
	| 'new' '(' type ')' // this always supercedes function calls
	| fn=primaryExpr args
	| base=primaryExpr selector
	;

selector : '.' name ;

args : '(' (arg (',' arg)* | arg?) ','? ')';
arg : expr | type ; // functions like [make] take in types as params...

block : '{' (stmt eos)* '}' ;

unaryOp : '-' | '+' | '<-' ;

logicalOp : '||' | '&&' ;
relOp : '==' | '!=' | '<' | '<=' | '>' | '>=' ;
mulOp : '*' | '/' ;
addOp : '+' | '-' ;

shortVarDecl : lhs=lnameList ':=' rhs=exprList ;

topLevelDecl : decl | funcDecl | methodDecl ;
methodDecl : 'func' '(' rcvName=name '*'? rcvType=typeName ')' methodName=name signature funcBody ;
decl : varDecl | typeDecl ;
typeDecl : 'type' name type ;
varDecl : 'var' name type ('=' expr)? ;

funcDecl : 'func' name signature funcBody ;
signature : '(' params ')' funcResult ;
funcBody : block ;
funcResult : type? | '(' type? ')' | '(' type (',' type)* ')' ;

litFunc : 'func' signature funcBody ;

params : param (',' param)* ','? | param? ;
param : name type ;

type : typeName | typeLit ;
typeName : WORD ;
typeLit : structType | channelType ; // exclude pointer types for now - we probably won't need them

channelType : 'chan' elementType ;
elementType : type ;

structType : 'struct' '{' (fieldDecl eos)* '}' ;
fieldDecl : name type ;

name : WORD ;
nameList : name (',' name)* ;

lit : number | litStr | litNil | litBool | litFunc | litStruct ;

litNil : NIL ;
litStr : LIT_STR ;
litBool : TRUE | FALSE ;

litStruct : (structType | typeName) '{' keyedElems '}' ;
keyedElems : keyedElem (',' keyedElem)* ','? ;
keyedElem : lname ':' expr ;

number : INT | FLOAT ;

eos : EOS | EOF ;
