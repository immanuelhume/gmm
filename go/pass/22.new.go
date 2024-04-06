type point struct {
	x int
	y int
}

func main() {
	p := new(point)
	p.x = 3
	p.y = 7
	sum := p.x + p.y
	if sum != 10 {
		panic("expected 10, got", sum)
	}
}
