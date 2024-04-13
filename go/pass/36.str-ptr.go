func main() {
	s := new(string)
	if *s != "" {
		panic("expected empty string, got ", s)
	}

	t := "foobar"
	*s = "qux"
	if *s != "qux" {
		panic("expected qux, got ", *s)
	}
	if t != "foobar" {
		panic("expected foobar, got ", t)
	}
}
