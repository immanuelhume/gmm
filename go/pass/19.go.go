func main() {
	go work("goroutine")
	work("main")
}

func work(s string) {
	for i := 0; i < 3; i = i + 1 {
		dbg(i, "hello", s)
	}
	dbg("bye", s)
}
