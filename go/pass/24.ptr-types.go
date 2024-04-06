func main() {
	var c *int
	if c != nil {
		panic("expected nil, got", c)
	}
	c = new(int)
	if c == nil {
		panic("expected an int, got nil")
	}
}
