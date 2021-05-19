import { range } from "./array";

export const randInt: {
  (maxExcluded: number): number;
  (minIncluded: number, maxExcluded: number): number;
} = (a: number, b?: number): number => {
  if (b === undefined)
    return Math.floor(Math.random() * a);
  else
    return Math.floor(Math.random() * (b - a)) + a;
};

export const shuffle = <T>(arr: T[]): T[] => {
  const newArr: T[] = [];
  let len = 0;
  for (const i of arr) {
    newArr.splice(randInt(++len), 0, i);
  }
  return newArr;
};

export const shuffleTeleport = <T>(arr: T[], qty: number): T[] => {
  const newArr = arr.slice();
  const len = arr.length;
  range(qty).forEach(() => {
    const i1 = randInt(len);
    const i2 = randInt(len);
    const tmp = newArr[i1];
    newArr[i1] = newArr[i2];
    newArr[i2] = tmp;
  });
  return newArr;
};

export const shuffleSwap = <T>(arr: T[], swaps: number): T[] => {
  const newArr: T[] = [...arr];
  const swap = (i: number) => {
    const val = newArr[i];
    newArr[i] = newArr[i + 1];
    newArr[i + 1] = val;
  };
  range(swaps)
    .map(() => randInt(arr.length - 1))
    .forEach(x => swap(x))
    ;
  return newArr;
};

