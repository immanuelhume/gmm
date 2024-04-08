func main() {
	ch := make(chan int)

	go func(ch chan int) {
		ch <- 3
	}(ch)
	x := <-ch
	if x != 3 {
		panic("expected 3, got", x)
	}

	go func() {
		ch <- 7
	}()
	x := <-ch
	if x != 7 {
		panic("expected 7, got", x)
	}
}
