func main() {
	x := "hello"
	y := "world"
	z := "hello"
	c := "helloworld"

	if !(x == z) {
		panic("expected true, got false")
	}

	if !(x == "hello") {
		panic("expected hello, got ", x)
	}

	if (x != z) {
		panic("expected hello, got ", x)
	}

	if (x+y) != c {
		panic("expected helloworld, got ", x+y)
	}

	if (x + y + x) != (c + z) {
		panic("expected helloworldhello, got ", x+y+x)
	}

}