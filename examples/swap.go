func main() {
    x, y := 1, 2
    dbg("x, y is", x, y)
    y, x := x, y
    dbg("x, y is", x, y)
}
