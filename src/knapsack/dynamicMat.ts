import { knapsackEvaulate, Knapsack, knapsackEmptySolution } from "./knapsack";
import { sortWithUnsorter, range } from "../utils";

// todo: is working ?
export const knapsackSolveDynamicMat = (ksp: Knapsack): boolean[] => {
  const { items } = ksp;
  const n = ksp.items.length;
  const w = ksp.maxS;

  const mat = range(n + 1).map(() => range(w + 1).map(x => 0));


  for (let i = 0; i < n; i++) {
    const { s: currSize, p } = ksp.items[i];
    for (let size = 1; size <= w; size++) {
      const maxProfitPrev = mat[i][size];
      let maxProfitCurr = 0;

      if (size >= currSize) {
        const remainingCapacity = size - currSize;
        maxProfitCurr = mat[i][remainingCapacity] + p;
      }

      mat[i + 1][size] = Math.max(maxProfitPrev, maxProfitCurr);
    }
  }

  const selected = knapsackEmptySolution(ksp);

  for (let i = n, j = w; i > 0; i--) {
    if (mat[i][j] > mat[i - 1][j]) {
        selected[i - 1] = true;
        j -= items[i - 1].s;
    }
}

  return selected;
};


