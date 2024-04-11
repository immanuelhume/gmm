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
already checked into this repository at antlr/.

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

The go/pass/ folder contains test cases which are meant to pass. The go/fail
folder holds the opposite. Check them to see the full set of features.

Gmm has three primitive data types: int, float, and string. Ints and floats are
64 bit. These three types (along with pointers) are the only primitive types
in gmm. Other "primitives" like channels and mutexes are data structures
implemented on top of these types.

Note: the parser is not very sophisticated, and certain one-liners are invalid.
This is a purely cosmetic issue and does not affect runtime. These, although
valid in actual Go, will not parse here:

    func main() { dbg("hello world") }

    type node struct { val int; left *node; right *node }

Instead, please place things things between braces in their own lines, like so:

    func main() {
        dbg("hello world")
    }

    type node struct {
        val   int
        left  *node
        right *node
    }

