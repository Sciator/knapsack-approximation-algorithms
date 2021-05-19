
export const zip: {
  <T1>(arg1: T1[]): [T1][],
  <T1, T2>(arg1: T1[], arg2: T2[]): [T1, T2][],
  <T1, T2, T3>(arg1: T1[], arg2: T2[], arg3: T3[]): [T1, T2, T3][],
  <T1, T2, T3, T4>(arg1: T1[], arg2: T2[], arg3: T3[], arg4: T4[]): [T1, T2, T3, T4][],
  <T1, T2, T3, T4, T5>(arg1: T1[], arg2: T2[], arg3: T3[], arg4: T4[], arg5: T5[]): [T1, T2, T3, T4, T5][],
} = (...args: any) =>
    range(Math.max(...args.map((x: any[]) => x.length)))
      .map(i => args.map((x: any[]) => x[i]))
  ;


export const range: {
  (size: number): number[];
  (min: number, max: number): number[];
} = (n: number, m?: number): number[] => {
  if (!m)
    return [...new Array(n).keys()];
  return [...new Array(m - n).keys()].map(x => x + n);
};

export type TComparatorResult = number /* -1 | 0 | 1 */;
export const sort: {
  (arr: number[], comparator?: (a: number, b: number) => TComparatorResult): number[];
  <T>(arr: T[], comparator: (a: T, b: T) => TComparatorResult): T[];
} = <T>(arr: T[], comparator?: (a: T, b: T) => TComparatorResult): T[] => {
  if (arr.length === 0) return [];
  const newArr = [...arr];
  if (typeof arr[0] === "number") {
    (newArr as any[]).sort(comparator || ((a: number, b: number) => a - b));
  } else {
    newArr.sort(comparator);
  }
  return newArr;
};

/** returns sorted array with function that reverse sorting */
export const sortWithUnsorter = <T>(
  arr: T[], comparator: (a: T, b: T) => TComparatorResult)
  : [T[], <TT>(x: TT[]) => TT[]] => {

  const sortedWithPrevIndex =
    sort(arr.map((item, index) => ({ item, index })),
      (x, y) => comparator(x.item, y.item));

  const arrSorted = sortedWithPrevIndex.map(({ item }) => item);
  const unsortingIndexes = sortedWithPrevIndex.map(({ index }) => index);

  // todo: can have better time complexity (usage of findIndex)
  const unsorter = <TT>(xx: TT[]) => range(xx.length).map(x => xx[unsortingIndexes.findIndex(y => y === x)]);

  return [arrSorted, unsorter];
};


export const reverse = <T>(arr: T[]): T[] => {
  const newArr: T[] = [];
  for (const i of arr) {
    newArr.splice(0, 0, i);
  }
  return newArr;
};


/** creates copy of array with added elements */
export const append = <T>(arr: T[], ...items: T[]): T[] => {
  const newArr = arr.slice();
  newArr.push(...items);
  return newArr;
};

export const median = (values: number[]): number => {
  if (!values.length) return 0;
  const sorted = sort(values);
  const half = Math.floor(sorted.length / 2);

  return (sorted.length % 2)
    ? sorted[half]
    : ((sorted[half - 1] + sorted[half]) / 2)
    ;
};

export const average = (values: number[]): number => {
  if (!values.length) return 0;
  const sum = values.reduce((a, b) => a + b, 0);
  return sum / values.length;
};

/**
 * flattens one level of array
 * @example
 * [[1,2], [3, 4]].reduce(...reducerFlat())
 */
export const reducerFlat = (): [<T>(a: T[], b: T[]) => T[], []] => {
  return [<T>(a: T[], b: T[]) => a.concat(b), []];
};
