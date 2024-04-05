func main() {
	var mu Mutex
	mu.Lock()
	mu.Unlock()
	mu.Lock()
}
