import { range } from "../utils";
import { knapsackEvaulate, Knapsack, knapsackEmptySolution } from "./knapsack";

export const subOne = (arr: boolean[]): void => {
  const len = arr.length;
  let lastTrue = len - 1;
  while (lastTrue !== -1 && arr[lastTrue] === false) {
    lastTrue--;
  }
  if (lastTrue !== -1)
    arr[lastTrue] = false;
  for (lastTrue++; lastTrue < len; lastTrue++) {
    arr[lastTrue] = true;
  }
};

export const knapsackSolveBruteforce = (ksp: Knapsack): boolean[] => {
  const len = ksp.items.length;
  const itemsSelected = knapsackEmptySolution(ksp).map(() => true);

  let bestProfit = 0;
  let bestItems = knapsackEmptySolution(ksp);

  while (itemsSelected.some(x => x)) {
    const { firstOverflowIndex, profit, overflow } = knapsackEvaulate(ksp, itemsSelected);
    if (overflow) {
      for (let i = firstOverflowIndex + 1; i < len; i++) {
        itemsSelected[i] = false;
      }
    } else if (bestProfit < profit) {
      bestProfit = profit;
      bestItems = itemsSelected.slice();
    }
    subOne(itemsSelected);
  }
  return bestItems;
};


