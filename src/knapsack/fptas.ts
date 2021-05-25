import { knapsackEvaulate, Knapsack, knapsackEmptySolution } from "./knapsack";
import { sortWithUnsorter, range, append, zip } from "../utils";
import { knapsackSolveDynamic } from "./dynamic";

type TSubRes = { s: number, p: number, it: number[] };

export const knapsackSolveFPTAS = (_ksp: Knapsack, epsilon: number = .1): boolean[] => {
  const ksp: Knapsack = { items: [], maxS: _ksp.maxS };
  const n = _ksp.items.length;
  const pMax = Math.max(..._ksp.items.map(x => x.p));
  const t = Math.floor(
    Math.log2(epsilon * pMax
      / ((1 + epsilon) * n))
  );

  ksp.items = _ksp.items.map(({ p, s }) => ({ p: Math.floor(p * Math.pow(2, -t)), s }));

  const selected = knapsackSolveDynamic(ksp);

  return selected;
};


