func main() {
	x := fact(6)
	if x != 720 {
		panic("expected 720, got", x)
	}
}

func fact(n int) int {
	if n == 0 {
		return 1
	}
	return n * fact(n-1)
}
