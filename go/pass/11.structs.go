type Point struct {
	x int64
	y int64
}

type Circle struct {
	center Point
	radius int64
}

func main() {
	p := Point{x: 3, y: 7}
	s := p.x + p.y
	if s != 10 {
		panic("expected 10, got", s)
	}

	c := Circle{center: Point{x: 5, y: 5}, radius: 10}
	d := c.center.x - c.radius
	if d != -5 {
		panic("expected -5, got", d)
	}

	original := Point{x: 1, y: 2}
	moved := translate(original, 3, 4)
	if moved.x != 4 {
		panic("expected 4, got", moved.x)
	}
	if moved.y != 6 {
		panic("expected 6, got", moved.y)
	}

	x := Point{x: 1, y: 0}
	x.y = x.x + 2
	if x.y != 3 {
		panic("expected 3, got", x.y)
	}
}

func translate(p Point, dx int64, dy int64) Point {
	return Point{x: p.x + dx, y: p.y + dy}
}
