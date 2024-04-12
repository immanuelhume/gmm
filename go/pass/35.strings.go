func main() {
	x := "hello"
	y := "world"
	z := "hello"
	c := "helloworld"

	if !(x == z) {
		panic("expected true, got false")
	}

	if (x != z) {
		panic("expected true, got false")
	}

	if (x+y) != c {
		panic("expected helloworld, got ", x+y)
	}

}