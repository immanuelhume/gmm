type Counter struct {
    count int
}

func (c Counter) Increment() int {
    return c.Add(1)
}

func (c Counter) Add(value int) int {
    return c.count + value
}

func main() {
    counter := Counter{count: 1}
    result := counter.Increment()
    if result != 2 {
        panic("expected 2, got", result)
    }
}
