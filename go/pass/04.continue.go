func main() {
	x := 0
	for i := 0; i != 3; i = i + 1 {
		x = x + 1
		continue
		i = i + 1
	}
	if x != 3 {
		panic("expected 3, got", x)
	}
}
