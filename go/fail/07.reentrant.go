func main() {
	var mu Mutex
	mu.Unlock()
	mu.Lock()
	mu.Lock()
}
