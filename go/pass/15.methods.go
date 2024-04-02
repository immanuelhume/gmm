type Point struct {
	x float
	y float
}

func (p Point) dot() float {
	return p.x*p.x + p.y*p.y
}

func main() {
	p := Point{x: 2, y: 3}
	d := p.dot()
	if d != 13 {
		panic("expected 13, got", d)
	}
}