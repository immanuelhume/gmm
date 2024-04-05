lexer grammar GoLexer ;

INT : [0-9]+ -> mode(NLSEMI);

FLOAT : ('.' INT | INT '.' | INT '.' INT) -> mode(NLSEMI);

LIT_STR : '"' ~["]* '"' -> mode(NLSEMI);

TRUE : 'true' -> mode(NLSEMI);
FALSE : 'false' -> mode(NLSEMI);

VAR : 'var' ;
RETURN : 'return' -> mode(NLSEMI) ;
FUNC : 'func' ;
TYPE : 'type' ;
STRUCT : 'struct' ;
FOR : 'for' ;
CHAN : 'chan' ;
NIL : 'nil' -> mode(NLSEMI) ;
GO : 'go' ;
BREAK : 'break' -> mode(NLSEMI) ;
CONTINUE : 'continue' -> mode(NLSEMI) ;
IF : 'if' ;
ELSE : 'else' ;
RANGE : 'range' ;

NEW : 'new' ;
MAKE : 'make' ;

PERIOD : '.' ;
COLON : ':' ;

L_BRACE : '{' ;
R_BRACE : '}' -> mode(NLSEMI) ;
L_PAREN : '(' ;
R_PAREN : ')' -> mode(NLSEMI) ;

COMMA : ',' ;
SEMI : ';' ;

ASSIGN : '=' ;
WALRUS : ':=' ;

MINUS : '-' ;
PLUS : '+' ;
DIV : '/' ;

RCV : '<-' ;

LOGICAL_OR : '||' ;
LOGICAL_AND : '&&' ;

EQ : '==' ;
NEQ : '!=' ;
LESS : '<' ;
LEQ : '<=' ;
GREATER : '>' ;
GEQ : '>=' ;

STAR: '*' ;
AMPERSAND : '&' ;

WORD : LETTER (LETTER | UNICODE_DIGIT)* -> mode(NLSEMI) ;

fragment LETTER: UNICODE_LETTER | '_' ;
fragment UNICODE_DIGIT: [\p{Nd}] ;
fragment UNICODE_LETTER: [\p{L}] ;

WS : [ \t\r\n]+ -> skip ;

mode NLSEMI ; // the goal of [NLSEMI] is to check if the statement terminates, and if so, emit [EOS] token (end-of-statement)

NLSEMI_WS : [ \t] -> skip ;
EOS : ([\r\n]+) -> mode(DEFAULT_MODE) ; // technically, ';' should trigger an EOS also
OTHER : -> mode(DEFAULT_MODE), skip ;
