func main() {
	outer := make(chan chan int)
	inner := make(chan int)

	go func() {
		outer <- inner
	}()

	inner2 := <- outer

	go func() {
		inner2 <- 3
	}()

	got := <-inner2
	if got != 3 {
		panic("expected 3, got", got)
	}
}
