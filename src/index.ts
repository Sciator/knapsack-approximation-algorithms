import { TKnapsackGenerateOptions, KnapsackGenerator, KnapsackGenerateInitialSortingAll, KnapsackRandomizingTypeAll } from "./knapsack/generator";
import { EAlg, TProcessArgs, TProcesRes, algs } from "./process";
import { range, sleepWithSkip, shuffle, average, median, zip, reducerFlat, runWithTimeAsync } from "./utils";
import { fork, ChildProcess } from "child_process";
import * as os from "os";
import { Knapsack } from "./knapsack/knapsack";
import { JSONFile } from "./jsonFile";
try {
  os.setPriority(os.constants.priority.PRIORITY_HIGH);
} catch {
  console.warn("start with elevated privileges to have increased process priority");
}
const cpuCount = os.cpus().length;


//#region settings

const tries = 1_000;
const startingElements = 3;
const maxElements = 200;
const maxksS = [1];
const ramdomnessValues = [.05, .1, .2];

// if 0 cpu count is used
const workersCountOverride = 12;
const timeoutMs = .2 * 1_000;
const minimalSuccessTries = .99;

//#region settings

const workersCount = workersCountOverride || cpuCount;

// number of logical cpu availeble

type TSeqProps = { min: number, max: number, avg: number, med: number, qty: number };

type TBatch = { ksp: Knapsack, res: { alg: EAlg, res: { profit: number, time: number } | undefined | null }[] }[];
type TBatchAnalyzed = {
  alg: EAlg, res: {
    sucessTries: number, profitDif: {
      /** fixed = current-best */
      fixed: TSeqProps,
      /** proportional = current/best */
      proportional: TSeqProps,
    }, time: TSeqProps,
  }
}[];


const fileData = new JSONFile<{
  tries: number,
  generatorSettings: TKnapsackGenerateOptions,
  results: TBatchAnalyzed
}>("data");

const analyzeSeq = (arr: number[]): TSeqProps =>
({
  min: Math.min(...arr), max: Math.max(...arr),
  avg: average(arr), med: median(arr),
  qty: arr.length,
})
  ;

const batchCreate = (genProps: TKnapsackGenerateOptions, tries: number, alg: EAlg[]): TBatch =>
  range(tries)
    .map(() => KnapsackGenerator.generate(genProps))
    .map(ksp => ({ ksp, res: alg.map((name) => ({ alg: name, res: undefined })) }))
  ;

const batchRun = async (batch: TBatch)
  : Promise<void> => {
  const workers: ChildProcess[] = [];

  const queue = shuffle(
    batch
      .map(({ ksp, res }) =>
        res.map((subres) => ({ ksp, subres })))
      .reduce(...reducerFlat())
  );

  const workerCreateAt = (i: number) => {
    const process = fork("./bin/process.js", [], { silent: true, });
    const priority = os.constants.priority.PRIORITY_HIGH;
    const pid = process.pid;
    // tslint:disable-next-line: no-empty
    try { os.setPriority(pid, priority); } catch { }


    workers[i] = process;
  };

  await Promise.all(range(workersCount).map(async i => {
    const getWorker = () => workers[i];
    workerCreateAt(i);

    while (queue.length) {
      const task = queue.pop();
      getWorker().send([task.subres.alg, task.ksp] as TProcessArgs);

      const { awaiter: sleepAwaiter, skip: skipSleep } = sleepWithSkip(timeoutMs);

      let done = false;
      const listener = (res: TProcesRes) => {
        done = true;
        task.subres.res = res.res;
        skipSleep();
      };

      getWorker().on("message", listener);

      await sleepAwaiter;

      getWorker().removeListener("message", listener);

      if (!done) {
        getWorker().kill();
        task.subres.res = null;
        workerCreateAt(i);
      }
    }
    getWorker().kill();
  })
  );
};

const batchAnalyze = (batch: TBatch, algs: EAlg[]): TBatchAnalyzed => {
  const subres = batch.map(({ res }) => {
    const filtered = res
      .map(({ res: _ }) => _)
      .filter(_ => _)
      ;
    if (!filtered.length) return null;
    const profitBest = Math.max(...filtered.map(_ => _.profit));
    return res.filter(({ res: _ }) => _)
      .map(({ alg, res: { profit, time } }) =>
      ({
        alg, res: {
          time, profitDif: {
            fixed: profitBest - profit, proportional:
              (profitBest === 0) ? 1
                : (profit === 0) ? null
                  : profitBest / profit
            ,
          },
        },
      }))
      ;
  }).filter(_ => _).reduce((a, b) => a.concat(b), []);

  return algs.map((alg) => {
    const filtered = subres.filter(({ alg: _ }) => _ === alg).map(({ res }) => res);
    const sucessTries = filtered.length;
    const time = analyzeSeq(filtered.map(x => x.time));
    const profitDif = ({
      fixed: analyzeSeq(filtered.map(({ profitDif: { fixed } }) => fixed)),
      proportional: analyzeSeq(filtered.map(({ profitDif: { proportional } }) => proportional).filter(_ => _)),
    });

    return ({ alg, res: { sucessTries, time, profitDif } });
  }
  );
};

const batchAnalyzedSave = (results: TBatchAnalyzed, generatorSettings: TKnapsackGenerateOptions, tries: number) => {
  fileData.write({ tries, generatorSettings, results });
};

const batchMakeOptions = (...generators: ((bo: TKnapsackGenerateOptions) => TKnapsackGenerateOptions[])[]) => {
  let allBactchesOptions: TKnapsackGenerateOptions[] = ([{ ...KnapsackGenerator.defaults, randomness: { ...KnapsackGenerator.defaults.randomness } }] as TKnapsackGenerateOptions[])
  generators.forEach(generator => {
    allBactchesOptions = allBactchesOptions.map(bo => generator(bo).map(generated => ({ ...bo, ...generated }))).reduce(...reducerFlat());
  });
  return allBactchesOptions;
}

(async () => {
  const allBactchesOptions = batchMakeOptions(
    () => range(startingElements, maxElements).map(x => ({ elements: x })),
    () => maxksS.map(ksS => ({ ksS })),
    () => KnapsackGenerateInitialSortingAll.map(initialSorting => ({ initialSorting })),
    () => ramdomnessValues.map(randomnessVal => ({ randomness: { value: randomnessVal, type: undefined as any } })),
    bo => KnapsackRandomizingTypeAll.map(randomnessType => ({
      randomness: { ...bo.randomness, type: randomnessType },
    })),
  );

  let algorithmsMaxElmCalculated = algs.map(({ name }) => ({ name, max: startingElements - 1 }));

  for (const batchOptions of allBactchesOptions) {
    algorithmsMaxElmCalculated = algorithmsMaxElmCalculated
      .filter(({ max, name }) => max + 3 >= batchOptions.elements);
    const batch = batchCreate(batchOptions, tries, algorithmsMaxElmCalculated.map(({ name }) => name));

    const [time] = await runWithTimeAsync(() =>
      batchRun(batch)
    );

    const analyzed = batchAnalyze(batch, algorithmsMaxElmCalculated.map(({ name }) => name));
    batchAnalyzedSave(analyzed, batchOptions, tries);

    analyzed.forEach(({ alg, res: { sucessTries } }) => {
      if (sucessTries < tries * minimalSuccessTries) return;
      const algMaxCalc = algorithmsMaxElmCalculated
        .find(({ name }) => name === alg);
      algMaxCalc.max = Math.max(batchOptions.elements, algMaxCalc.max);
    });


    const timeStr = time.toString(10).padStart(7, " ");
    const elmStr = batchOptions.elements.toString(10).padStart(4, " ");
    const algStr = algorithmsMaxElmCalculated.map(x => x.name).join(", ");
    console.log(`batch done in ${timeStr} with elms ${elmStr} with algs ${algStr}`);
  }
})();


