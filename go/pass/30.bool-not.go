func main() {
    a := true
    b := !a
    if b {
        panic("expected false, got", b)
    }
}
