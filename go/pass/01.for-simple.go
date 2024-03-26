func main() {
	x := 0
	for x != 10 {
		x = x+1
	}
	if x != 10 {
		panic("expected 10, got", x)
	}
}
