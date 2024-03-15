export interface Stack<T> {
  push: (t: T) => void
  pop: () => T
  forEach: <S>(f: (t: T) => S) => void
}

export type Address = number
