func foo() int64 {
	var x int64 = 123
	var y int64
	return x + 1
}

func bar(key string, val string) string {
	a := 1
	return "foo"
}

func baz(key string) {
	a := bar(key, key)
	i := 0

	for i < 10 {
		i = i + 1
		break
	}

	var c chan string
	var p Point

	go bar(key, key)

	ch = make(chan string)
	ch <- "hello world"

	<-ch

	s := p.x + p.y

	if s > 9 {
	} else if s > 8 {
	} else {
		fmt.Println("peko peko")
	}
}

type Point struct {
	x float64
	y float64
}

type IpAddr float32
