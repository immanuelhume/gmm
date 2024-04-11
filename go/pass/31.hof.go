func main() {
    f := getF()
    exec(f)
}

func exec(f func()) {
    f()
}

func getF() func() {
    f := func() {
        dbg("hello from f")
    }
    return f
}
