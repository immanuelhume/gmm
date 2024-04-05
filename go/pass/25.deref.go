func main() {
	x := new(int)
	*x = 3
	if *x != 3 {
		panic("expected 3, got", *x)
	}
}