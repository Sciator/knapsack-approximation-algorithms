import { range } from "../utils";

export type KnapsackItem = { s: number, p: number };
export type Knapsack = {
  /** always sorted from highest s to lower */
  items: KnapsackItem[],
  maxS: number,
};

export const knapsackEvaulate = (ksp: Knapsack, selected: boolean[]) => {
  const kspItems = ksp.items;
  const kspItemsLen = ksp.items.length;
  const kspMaxS = ksp.maxS;

  let overflow = false;
  let s = 0;
  let firstOverflowIndex = -1;
  let profit = 0;

  for (let i = 0; i < kspItemsLen; i++) {
    const isSelected = selected[i];
    if (isSelected) {
      const it = kspItems[i];
      s += it.s;
      profit += it.p;
      if (s > kspMaxS && !overflow) {
        overflow = true;
        firstOverflowIndex = i;
      }
    }
  }

  if (overflow)
    profit = 0;
  const freeSize = overflow
    ? 0
    : ksp.maxS - s
    ;

  return {
    overflow,
    profit,
    firstOverflowIndex,
    Size: {
      free: freeSize,
      used: s,
    },
  };
};

export const knapsackEmptySolution = (ksp: Knapsack) => range(ksp.items.length).map(() => false);
