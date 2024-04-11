func incr(x *int) {
	*x = *x + 1
}

func main() {
	x := 0
	incr(&x)
	if x != 1 {
		panic("expected 1, got", x)
	}
	incr(&x)
	if x != 2 {
		panic("expected 2, got", x)
	}
}