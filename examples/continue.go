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

	y, i := 0, 0
	for ; i != 5; i = i + 1 {
		if y == 3 {
			continue
		}
		y = y + 1
	}
	if y != 3 {
		panic("expected 3, got", y)
	}
}
