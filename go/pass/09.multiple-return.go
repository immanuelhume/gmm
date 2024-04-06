func main() {
	a, b, c, d, e := math(7, 3), 11+2
	if a != 10 {
		panic("expected 10, got", a)
	}
	if b != 4 {
		panic("expected 4, got", b)
	}
	if c != 21 {
		panic("expected 21, got", c)
	}
	if d != 2 {
		panic("expected 2, got", d)
	}
	if e != 13 {
		panic("expected 13, got", e)
	}
}

func math(x int, y int) (int, int, int, int) {
	return sumAndDiff(x, y), mulAndDiv(x, y)
}

func sumAndDiff(x int, y int) (int, int) {
	return x + y, x - y
}

func mulAndDiv(x int, y int) (int, int) {
	return x*y, x/y
}
