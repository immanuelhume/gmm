func main() {
	x := 1
	x = incr(x)
	if x != 2 {
		panic("expected 2, got", x)
	}
	x = incr(x)
	if x != 3 {
		panic("expected 3, got", x)
	}
	dbg("final value is", x)
}

func incr(x int) int {
	return x + 1
}
