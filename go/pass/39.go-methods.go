func main() {
	var u node
	var v node
	var w node

	u.val, v.val, w.val = 1, 2, 3
	u.left, u.right = &v, &w

	res := make(chan int)
	go u.sum(res)

	x := <-res

    if x != 6 {
        panic("expected 6, got", x)
    }
}

type node struct {
	val   int
	left  *node
	right *node
}

func (n *node) sum(ch chan int) int {
	if n == nil {
		ch <- 0
		return 0
	}
	cl := make(chan int)
	cr := make(chan int)
	go n.left.sum(cl)
	go n.right.sum(cr)
	l := <-cl
	r := <-cr
    sum := n.val + l + r 
	ch <- sum
	return sum
}

