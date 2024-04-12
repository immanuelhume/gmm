type counter struct {
	n int
}

func (c *counter) incr() {
	c.n = c.n + 1
}

func (c *counter) incrN(n int) {
	c.n = c.n + n
}

func main() {
	var c counter
	if c.n != 0 {
		panic("expected 0, got", c)
	}
	c.incr()
	if c.n != 1 {
		panic("expected 1, got", c)
	}
	c.incrN(7)
	if c.n != 8 {
		panic("expected 8, got", c)
	}
}
