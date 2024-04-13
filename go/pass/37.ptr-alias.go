func main() {
	x := new(int)
	y := x

	if *y != 0 {
		panic("expected 0, got ", *y)
	}
	*x = 1
	if *y != 1 {
		panic("expected 1, got ", *y)
	}
}
