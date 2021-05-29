# How to start
*(this repository contains results including graph messages. see **Results** and **Conclusion** at end of this readme)*

0) have [node](https://nodejs.org/) and [yarn](https://yarnpkg.com/getting-started/install) installed for running calculations and [python](https://www.python.org/) with [jupyter](https://jupyter.org/) to display results
0) call `yarn install` (this will download dependencies)
0) start calculations with `yarn start`
   - this will start adding data into `data.json` file. For new measurements is renaming or deleting old `data.json` file recommended.
0) after all calculations done run all cells inside `visualize.ipynb` with jupyter notebook (for simple usage use vscode with python extension)


# instance generator
- generates squence of n profits as random values p<sub>i</sub> and sizes s<sub>i</sub> from \<0, max<sub>p</sub>\> where n is number of target elements/items
- sorts s<sub>i</sub>
- depending on sort setting:
  - `random` does nothing (p<sub>i</sub> will remain randomly sorted)
  - `same` will sort p<sub>i</sub> in same manner as s<sub>i</sub> (this means if s<sub>i</sub> >= s<sub>i+1</sub> then p<sub>i</sub> >= p<sub>i+1</sub>)
  - `reversed` will sort p<sub>i</sub> in reversed way than 'same' option
- p<sub>i</sub> is shuffled based on randomise value in proportion. shuffle selects randomiseValue*n times random element and swaps position with different element. If randomise type is teleport than both elements to swap is randomly selected and if randomise type is swap then only neighbor elements are swaped.
- pair s<sub>i</sub>, p<sub>i</sub> is considered one item i<sub>i</sub>

# settings

- tries: number - how many instances will single scenario have
- elementsStarting: number - minimal elements in instance
- elementsMax: number - maximal elements in instance
- maxksS: number[] - max size of knapsack S 
- ramdomnessValues: number[] - randomnesses used for generating instances

- workersCountOverride: number - number of workers, if 0 number of machine virtual cores is used
- timeoutMs: number - maximum time (in ms) to solve single instance. If solving excedes this time, calculation of this instance will be considered fail and process will be killed.
- minimalSuccessTries: number - minimum sucessfull tries for next calculations of given algorithm to occur (e.g. bruteforce algorithm will fail to calculate most of it's instances with 10 elements, so program will not try to calculate instances with 11 elements using bruteforce)

# Results
results are stored inside `data.json` file. Calcualtion was done in approx. 24h with parameters:
```
const tries = 300;
const elementsStarting = 10;
const elementsMax = 200;
const maxksS = [10];
const ramdomnessValues = [.05, .1, .2];

// if 0 cpu count is used
const workersCountOverride = 14;
const timeoutMs = .25 * 1_000;
const minimalSuccessTries = .95;

```
with:
```
CPU: Intel i9-9900K (3.6GHz 8/16 cores, aircooled benchmarked max 4.7GHz)
DDR: 32GB DDR4 3200MHz CL 16 HypreX FURY series
```
(PC was used for light work during measurement)

# Conclusion

All visualization for `data.json` in this repo is present in `images` folder. Visualisation uses averages for results with same generator settings. 
Shorcuts: BF - bruteforce, DR - dynamic, GR - greedy, FPx - FPTAS with omega = x(from .1 to 1)

:warning: for profit calculations best results is used. So it's posible that results will not be relative to real optimum if wasn't find by any algorithm :warning:

From time graph there is visible that slowest algorithm is bruteforce, after bruteforce other algorithms are noticeably faster from dynamic as slowest to fptas with higher omega as faster algorithm. fastest algorithm is greedy with almost no dependency on size of instance at all.
Also we can see that instances generated with reversed randomness type is fastest to solve followed by random and same.
We can se that best profit has dynamic algorithm (optimum). Closest to omptimum is fptas with lowest omega. In almost all cases greedy is worst algorithm with exception in cases where item with big profit has low size where can perform sometimes better tha fpat with high omega.

By this calculation we can make conclusion that best results is given by slowest algortihm and vice versa. Algorithms can be sorted (with greedy algorithm exception):

- *Best profit*
- Dynamic
- fptas low omega
- fptas high omega
- greedy
- *Fastest*

# Zadání
1. Naprogramujte FPTAS pro problém batohu (pseudokód je součástí prezentace na mých stránkách) 
2. Porovnejte délky běhu algoritmu pro různé hodnoty epsilon a různé délky vstupu (vhodně zvolte) 
    s běžnou variantou řešenou pomocí dynamického programování (pro nalezení optimálního řešení).
3. Výsledky vhodně okomentujte a interpretujte ve formě grafů.

# Todo:
- [ ] building
- [ ] move settings from code to json