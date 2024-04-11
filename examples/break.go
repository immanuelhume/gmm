func main() {
	x := 0
	for i := 1; i != 4; i = i + 1 {
		for j := 1; j != 4; j = j + 1 {
			if i == j {
				break
			}
			x = x + 1
		}
	}
	if x != 3 {
		panic("expected 3, got", x)
	}

	x = 0
	for x != 5 {
		if x == 4 {
			break
		}
		x = x + 1
	}
	if x != 4 {
		panic("expected 4, got", x)
	}
}
