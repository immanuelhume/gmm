export interface Stack<T> {
  push: (t: T) => void;
  pop: () => T;
  peek: () => T;
  forEach: <S>(f: (t: T) => S) => void;
  toList: () => T[];
}

export class ArrayStack<T> implements Stack<T> {
  private xs: T[];
  constructor() {
    this.xs = [];
  }
  push = (t: T) => this.xs.push(t);
  pop = () => {
    const ret = this.xs.pop();
    if (ret === undefined) throw new Error("Tried to pop from empty stack");
    return ret;
  };
  peek = () => this.xs[this.xs.length - 1];
  forEach = <S>(f: (t: T) => S) => this.xs.forEach(f);
  toString = (): string => this.xs.toString();
  toList = () => [...this.xs]; // return a shallow copy
}

export type Address = number;

export const fmtAddress = (addr: Address, len: number = 3) => {
  const hexstr = addr.toString(16);
  const padded = hexstr.padStart(len, "0");
  return `0x${padded}`;
};
