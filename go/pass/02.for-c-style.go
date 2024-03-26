func main() {
	x := 0
	for i := 0; i != 7; i = i + 1 {
		x = x + 1
	}
	if x != 7 {
		panic("expected 7, got", x)
	}

	x = 0
	for ; x != 5; x = x + 1 {
	}
	if x != 5 {
		panic("expected")
	}
}
