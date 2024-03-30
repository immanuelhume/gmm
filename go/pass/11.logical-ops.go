func main() {
	x, y := 0, 0
	for i := 0; i < 3; i = i+1 {
		x = x+1
		y = y+2
	}
	if x != 3 || y != 6 {
		panic("Expected (3, 6), got", x, y)
	}
	if x == 3 && y == 6 {
	} else {
		panic("Expected (3, 6), got", x, y)
	}
}
