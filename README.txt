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

To run individual files, use

    npm run run path/to/file.go

A live editor is available at https://immanuelhume.github.io/gmm. It is able to
load the examples in the examples/ folder.

The hello world example looks like this:

    func main() {
        dbg("Hello world")
    }

We have a dbg builtin instead of Go's fmt library; dbg behaves exactly like
JavaScript's console.log.

