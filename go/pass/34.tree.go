func main() {
	var u node
	var v node
	var w node

	u.val, v.val, w.val = 1, 2, 3
	u.left, u.right = &v, &w

	sum := u.sum()
	if sum != 6 {
		panic("expected 6, got", sum)
	}
}

type node struct {
	val   int
	left  *node
	right *node
}

func (n *node) sum() int {
	if (n == nil) {
		return 0
	}
	return n.val + n.left.sum() + n.right.sum()
}
