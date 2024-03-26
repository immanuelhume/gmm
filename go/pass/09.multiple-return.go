func main() {
	a, b := sumAndDiff(7, 3)
	if a != 10 {
		panic("expected 10, got", a)
	}
	if b != 4 {
		panic("expected 4, got", b)
	}
}

func sumAndDiff(x int, y int) (int, int) {
	return x + y, x - y
}
