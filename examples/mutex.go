func main() {
	var mu Mutex
	mu.Lock()
	go func() {
		mu.Unlock()
	}()
	mu.Lock()
}
