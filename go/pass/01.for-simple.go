func main() {
	x := 0
	for x != 5 {
		x = x + 1
	}
	if x != 5 {
		panic("expected 5, got", x)
	}
}
