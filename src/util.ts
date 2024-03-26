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

export class Bijection<X, Y> {
  private x2y = new Map<X, Y>();
  private y2x = new Map<Y, X>();

  set(x: X, y: Y) {
    this.x2y.set(x, y);
    this.y2x.set(y, x);
  }

  y(x: X): Y | undefined {
    return this.x2y.get(x);
  }

  x(y: Y): X | undefined {
    return this.y2x.get(y);
  }

  xs(): X[] {
    return [...this.x2y.keys()];
  }

  ys(): Y[] {
    return [...this.y2x.keys()];
  }
}

export class StrPool {
  private map = new Bijection<string, number>();
  private id = 0; // should increase monotonically
  private addrs = new Map<number, Address>(); // map from string ID to its address in the heap

  ids(): number[] {
    return this.map.ys();
  }

  add(s: string): number {
    const existing = this.map.y(s);
    if (existing !== undefined) {
      return existing;
    }
    this.map.set(s, this.id);
    this.id++;
    return this.id - 1;
  }

  getStr(id: number): string | undefined {
    return this.map.x(id);
  }

  getAddress(id: number): Address | undefined {
    return this.addrs.get(id);
  }
  setAddress(id: number, addr: Address): void {
    this.addrs.set(id, addr);
  }
}
