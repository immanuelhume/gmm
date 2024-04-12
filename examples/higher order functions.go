func main() {
	var c counter
	if c.n != 0 {
		panic("expected 0, got", c.n)
	}
	exec(c.incr)
	if c.n != 1 {
		panic("expected 1, got", c.n)
	}
}

func exec(f func()) {
	f()
}

type counter struct {
	n int
}

func (c *counter) incr() {
	c.n = c.n + 1
}
