type Point struct {
	x float
	y float
}

func (lhs Point) dot(rhs Point) float {
	return lhs.x*rhs.x + lhs.y*rhs.y
}

func main() {
	p1 := Point{x: 2, y: 3}
	p2 := Point{x: 7, y: 5}
	d := p1.dot(p2)
	if d != 29 {
		panic("expected 29, got", d)
	}
}
