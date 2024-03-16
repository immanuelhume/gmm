export interface Stack<T> {
  push: (t: T) => void;
  pop: () => T;
  peek: () => T;
  forEach: <S>(f: (t: T) => S) => void;
}

export type Address = number;

export const fmtAddress = (addr: Address, len: number = 4) => {
  const hexstr = addr.toString(16);
  const padded = hexstr.padStart(len, "0");
  return `0x${padded}`;
};
