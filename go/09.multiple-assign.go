func main() {
	var x int
	var y int
	x, y = 3, 7
	if x+y != 10 {
		panic("expected 10, got", x+y)
	}

	a, b := 2, 5
	if a+b != 7 {
		panic("expected 7, got", a+b)
	}
}
