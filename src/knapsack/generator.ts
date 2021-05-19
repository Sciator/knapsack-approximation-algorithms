import { sort, range, randInt, shuffle, reverse, shuffleSwap, shuffleTeleport, zip } from "../utils";
import { Knapsack } from "./knapsack";


export type TKnapsackGenerateInitialSorting =
  /** totaly random */
  "random" |
  /** preserve w1 <= w2 iff c1 <= w2 */
  "same" |
  /** preserve w1 <= w2 iff c1 >= w2 */
  "reversed"
  ;
export const KnapsackGenerateInitialSortingAll: TKnapsackGenerateInitialSorting[] = [
  "random", "same", "reversed",
];
export type TKnapsackRandomizingType =
  "swap" |
  "teleport"
  ;
export const KnapsackRandomizingTypeAll: TKnapsackRandomizingType[] = [
  "swap", "teleport",
];
export type TKnapsackGenerateOptions = {
  elements?: number,
  maxS?: number,
  maxP?: number,
  initialSorting?: TKnapsackGenerateInitialSorting,
  randomness?: {
    type: TKnapsackRandomizingType,
    value: number,
  },
  ksS?: number,
};

export class KnapsackGenerator {
  public static defaults: Required<TKnapsackGenerateOptions> = {
    elements: 1_000,
    maxP: 10_000,
    maxS: 10_000,
    initialSorting: "same",
    randomness: {
      type: "teleport",
      value: .1,
    },
    ksS: .2,
  };

  // todo: jen funkce bez třídy
  public static generate(options?: TKnapsackGenerateOptions): Knapsack {
    const { elements, maxP, maxS, randomness, initialSorting, ksS }
      = { ...this.defaults, ...options };

    const sizes = sort(
      range(elements)
        .map(() => randInt(1, maxS + 1))
    );
    let profits = range(elements)
      .map(() => randInt(1, maxP + 1))
      ;
    // todo: initialSorting
    if (initialSorting === "same")
      profits = sort(profits);
    else if (initialSorting === "reversed")
      profits = sort(profits).reverse();

    if (randomness.value !== 0) {
      switch (randomness.type) {
        case "teleport":
          profits = shuffleTeleport(profits, Math.floor(randomness.value * elements));
          break;
        case "swap":
          profits = shuffleSwap(profits, Math.floor((randomness.value * elements) ** 2));
          break;
      }
    }
    const SSum = sizes.reduce((a, b) => a + b, 0);

    const maxKsS = randInt(
      SSum * ksS)
      ;

    return {
      items: zip(sizes, profits).map(([s, p]) => ({ p, s })).reverse(),
      maxS: maxKsS,
    };
  }
}
