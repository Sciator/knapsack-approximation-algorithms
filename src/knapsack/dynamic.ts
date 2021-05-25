import { knapsackEvaulate, Knapsack, knapsackEmptySolution } from "./knapsack";
import { sortWithUnsorter, range, append } from "../utils";

type TSubRes = { s: number, p: number, it: number[] };

export const knapsackSolveDynamic = (ksp: Knapsack): boolean[] => {
  const { items } = ksp;
  const n = ksp.items.length;
  const w = ksp.maxS;

  const subRes: TSubRes[] = [{ it: [], p: 0, s: 0 }];

  items.map(({ p, s }, i) => {
    const subResNew: TSubRes[] = [];

    subRes.forEach(({ it: subIt, s: subS, p: subP }) => {
      const nextS = subS + s;
      if (nextS > w) return;
      subResNew.push({ it: append(subIt, i), p: subP + p, s: nextS });
    });

    // todo: use filter instead of for
    const removeDominated = (subRes1: TSubRes[], subRes2: TSubRes[]) => {
      subRes1.forEach(({ p: p1, s: s1 }) => {
        for (let i2 = subRes2.length; i2--;) {
          const { p: p2, s: s2 } = subRes2[i2];
          if (p2 <= p1 && s2 >= s1)
            subRes2.splice(i2, 1);
        }
      });
    };

    // const [subresPrev, subresCurr] = [subRes.length, subResNew.length];

    removeDominated(subRes, subResNew);
    removeDominated(subResNew, subRes);

    // console.log(`total: = ${subRes.length + subResNew.length} removed prev: ${(subresPrev - subRes.length)} curr: ${(subresCurr - subResNew.length)}`);

    subRes.push(...subResNew);
  });

  subRes.sort(({ p: p1 }, { p: p2 }) => p2 - p1);

  const selected = range(n).map(() => false);
  const selectedIndexes = subRes[0].it;
  selectedIndexes.forEach(i => selected[i] = true);

  return selected;
};


