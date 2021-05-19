import { Knapsack, knapsackEvaulate } from "./knapsack/knapsack";
import { knapsackSolveBruteforce } from "./knapsack/bruteforce";
import { knapsackSolveGreedy } from "./knapsack/greedy";
import { knapsackSolveDynamic } from "./knapsack/dynamic";
import { knapsackSolveDynamicMat } from "./knapsack/dynamicMat";
import { knapsackSolveFPTAS } from "./knapsack/fptas";
import { runWithTime } from "./utils/common";

export enum EAlg { "BF" = "BF", "GR" = "GR", "DR" = "DR", "DM" = "DM", "FP" = "FP", }

export const algs: { name: EAlg, fnc: (ksp: Knapsack) => boolean[] }[] = [
  { name: EAlg.BF, fnc: knapsackSolveBruteforce },
  { name: EAlg.GR, fnc: knapsackSolveGreedy },
  { name: EAlg.DR, fnc: knapsackSolveDynamic },
  { name: EAlg.DM, fnc: knapsackSolveDynamicMat },
  { name: EAlg.FP, fnc: knapsackSolveFPTAS },
];

export type TProcessArgs = [
  EAlg,
  Knapsack,
];

export type TProcesRes = {
  res: { time: number, profit: number }
};


const run: (...args: TProcessArgs) => TProcesRes = (eAlg: EAlg, ksp: Knapsack) => {
  const alg = algs.find(({ name }) => name === eAlg).fnc;

  const res = (_ksp => {
    const [time, selected] = runWithTime(alg, _ksp);
    const { profit } = knapsackEvaulate(_ksp, selected);
    return { time, profit };
  })(ksp);

  return ({ res });
};

process.on("message", (args: TProcessArgs) => {
  const res = run(...args);
  process.send(res);
});
