  __ _ _ __ ___  _ __ ___  
 / _` | '_ ` _ \| '_ ` _ \ 
| (_| | | | | | | | | | | |
 \__, |_| |_| |_|_| |_| |_|
 |___/                     

Go minus minus. A stack-based virtual machine for a small subset of Go.

This project was built with NodeJS 21.7 and Antlr 4.12. To run locally,

    git clone git@github.com:immanuelhume/gmm
    npm i
    npm run runall # run all test cases

Antlr4 is not required unless you modify the parser or lexer. Its output is
checked into this repository at antlr/.

To run individual files, use

    npm run run path/to/file.go

A live editor is available at https://immanuelhume.github.io/gmm. It is able to
load the examples in the examples/ folder.

To do anything meaningful we'll have to print things to the console. The hello
world example looks like this:

    func main() {
        dbg("Hello world")
    }

We have a dbg builtin instead of Go's fmt library; dbg behaves exactly like
JavaScript's console.log. This was mainly a development aid.

The panic function helps us check if things are running properly. Like dbg, it
prints a message but then terminates the program.

    func swap() {
        x, y := 1, 2
        y, x := 2, 1
        if x != 2 || y != 1 {
            panic("expected x, y to be 2, 1 but got", x, y)
        }
    }
