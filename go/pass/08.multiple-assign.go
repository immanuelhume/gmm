func main() {
	x, y := 7, 3
	if x-y != 4 {
		panic("expected 4, got", x-y)
	}

	a, b := 5, 2
	if a-b != 3 {
		panic("expected 3, got", a-b)
	}

    b, a := a, b
    if a != 2 || b != 5 {
        panic("expected (2, 5), got", a, b)
    }
}
