func main() {
	x := new(int)
	*x = 3
	if *x != 3 {
		panic("expected 3, got", *x)
	}

	f := foo{x: new(int)}
	if *f.x != 0 {
		panic("expected 0, got", *f.x)
	}
	*f.x = 3
	if *f.x != 3 {
		panic("expected 3, got", *f.x)
	}
}

type foo struct {
	x *int
}
