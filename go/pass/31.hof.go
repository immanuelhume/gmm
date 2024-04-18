func main() {
    f := getF()
    got := exec(f)
    if got != 2 {
        panic("expected 2, got", got)
    }
}

func exec(f func() int) int {
    return f()
}

func getF() func() {
    a := 1
    f := func() int {
        return a+1
    }
    return f
}
