type Speaker struct {
    volume int
}

func (s Speaker) Increase() int {
    return s.volume + 1
}

func (s Speaker) WithVolume(volume int) Speaker {
	s2 := Speaker{ volume: volume }
    return s2
}

func main() {
    speaker := Speaker{volume: 5}
    incr := speaker.Increase
	increasedVolume := incr()
    if increasedVolume != 6 {
        panic("expected 6, got", increasedVolume)
    }
    speaker = speaker.WithVolume(10)
    if speaker.volume != 10 {
        panic("expected 10, got", speaker.volume)
    }
}
