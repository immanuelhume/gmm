func main() {
	ch := make(chan point)
	p := point{ x: 1.0, y: 3.0 }
	go func() {
		ch <- p
	}()
	got := <-ch
	if got.neq(p) {
		panic("expected (1.0, 3.0), got", got)
	}
}

type point struct {
	x float
	y float
}

func (p point) neq(rhs point) bool {
	return (p.x != rhs.x) || (p.y != rhs.y)
}
