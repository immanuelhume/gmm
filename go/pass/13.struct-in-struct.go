type Inner struct {
    a int
}

type Outer struct {
    inner Inner
}

func main() {
    o := Outer{inner: Inner{a: 42}}
    if o.inner.a != 42 {
        panic("expected 42, got", o.inner.a)
    }
}
