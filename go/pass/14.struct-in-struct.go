type Point struct {
	x int
	y int
}

type Line struct {
	start Point
	end   Point
}

func length(line Line) int {
	return line.end.x - line.start.x + line.end.y - line.start.y
}

func main() {
	line := Line{start: Point{x: 0, y: 0}, end: Point{x: 3, y: 4}}
	if length(line) != 7 {
		panic("expected 7, got", length(line))
	}
}
