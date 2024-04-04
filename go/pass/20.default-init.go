func main() {
	var x int
	if x != 0 {
		panic("expected 0, got", x)
	}

	var foo foo
	if foo.x != 0 {
		panic("expected 0, got", foo.bar.y)
	}
	if foo.bar.y != false {
		panic("expected false, got", foo.bar.y)
	}
}

type foo struct {
	bar bar
	x int
}

type bar struct {
	y bool
}
