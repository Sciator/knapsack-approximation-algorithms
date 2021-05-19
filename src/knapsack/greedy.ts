import { knapsackEvaulate, Knapsack, knapsackEmptySolution } from "./knapsack";
import { sortWithUnsorter } from "../utils";

export const knapsackSolveGreedy = (_ksp: Knapsack): boolean[] => {
  const [kspItemsSorted, unsorter] = sortWithUnsorter(_ksp.items, (x, y) => (y.p / y.s) - (x.p / x.s));

  const ksp: Knapsack = { items: kspItemsSorted, maxS: _ksp.maxS };
  const len = ksp.items.length;

  let itemsSelected = knapsackEmptySolution(ksp);

  for (let i = 0; i < len; i++) {
    itemsSelected[i] = true;
    const { overflow } = knapsackEvaulate(ksp, itemsSelected);
    if (overflow) {
      itemsSelected[i] = false;
      // todo: store profit from previous iteration
      const { profit } = knapsackEvaulate(ksp, itemsSelected);
      const alterItems = knapsackEmptySolution(ksp);
      alterItems[i] = true;
      const { overflow: overflowAlter, profit: profitAlter } = knapsackEvaulate(ksp, alterItems);
      if (!overflowAlter && profitAlter >= profit)
        itemsSelected = alterItems;
    }
  }

  const unsortedResult = unsorter(itemsSelected);

  return unsortedResult;
};


