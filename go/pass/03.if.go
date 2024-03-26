func main() {
	x := 1
	if x == 2 {
		x = 1
	} else if x == 1 {
		x = 3
	} else {
		x = 2
	}
	if x != 3 {
		panic("expected 3, got", x)
	}
}
