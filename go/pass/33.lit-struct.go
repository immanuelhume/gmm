func main() {
	p := struct{
		x float
		y float
	}{ x: 1.0, y: 2.0 }
	if p.x != 1.0 || p.y != 2.0 {
		panic("expected (1.0, 2.0) but got", p)
	}
}
