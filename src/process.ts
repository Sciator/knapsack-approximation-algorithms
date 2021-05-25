import { Knapsack, knapsackEvaulate } from "./knapsack/knapsack";
import { knapsackSolveBruteforce } from "./knapsack/bruteforce";
import { knapsackSolveGreedy } from "./knapsack/greedy";
import { knapsackSolveDynamic } from "./knapsack/dynamic";
import { knapsackSolveDynamicMat } from "./knapsack/dynamicMat";
import { knapsackSolveFPTAS } from "./knapsack/fptas";
import { runWithTime } from "./utils/common";

export enum EAlg { "BF" = "BF", "GR" = "GR", "DR" = "DR", "DM" = "DM", "FP.1" = "FP.1", "FP.2" = "FP.2", "FP.5" = "FP.5", "FP.9" = "FP.9", "FP1" = "FP1", }

export const algs: { name: EAlg, fnc: (ksp: Knapsack) => boolean[] }[] = [
  { name: EAlg.BF, fnc: knapsackSolveBruteforce },
  { name: EAlg.GR, fnc: knapsackSolveGreedy },
  { name: EAlg.DR, fnc: knapsackSolveDynamic },
  { name: EAlg.DM, fnc: knapsackSolveDynamicMat },
  { name: EAlg["FP.1"], fnc: (ksp: Knapsack) => knapsackSolveFPTAS(ksp, .1) },
  { name: EAlg["FP.2"], fnc: (ksp: Knapsack) => knapsackSolveFPTAS(ksp, .2) },
  { name: EAlg["FP.5"], fnc: (ksp: Knapsack) => knapsackSolveFPTAS(ksp, .5) },
  { name: EAlg["FP.9"], fnc: (ksp: Knapsack) => knapsackSolveFPTAS(ksp, .9) },
  { name: EAlg.FP1, fnc: (ksp: Knapsack) => knapsackSolveFPTAS(ksp, 1) },
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
