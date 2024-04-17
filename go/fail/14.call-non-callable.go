func main() {
	ch := make(chan int)
	go 1()
	n := <-ch
}

