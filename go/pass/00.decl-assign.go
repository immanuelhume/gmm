func main() {
	x := 1
	y := x + 1
	if y != 2 {
		panic("expected 2, got ", y)
	}
}
