
export const formatString = (str: string, args: number[]): string => {
  const split = str.split(/(%)([0-9]*)([idxXc])/);
  let curI = 0;
  while (curI < split.length && args.length) {
    const curStr = split[curI];
    if (curStr === "%") {
      const padding = Number.parseInt(split[curI + 1], 10) || 0;
      const style = split[curI + 2] as "i" | "d" | "x" | "X" | "c";
      let formatedRes: string;
      const num = args.pop();
      switch (style) {
        case "x":
          formatedRes = num.toString(16);
          break;
        case "X":
          formatedRes = num.toString(16);
          formatedRes = formatedRes.toUpperCase();
          break;
        case "c":
          formatedRes = String.fromCharCode(num);
          break;
        case "d":
        case "i":
          formatedRes = num.toString();
          break;
        default:
          curI++;
          continue;
      }
      formatedRes = formatedRes.padStart(padding, " ");
      split.splice(curI, 3, formatedRes);
    }
    curI++;
  }
  return split.join("");
};

export const isBoolean = (obj: any) => {
  return obj === true || obj === false;
};

/** helper function for throwing errors inside expressions */
export const throwReturn = <T>(msg: string): T => {
  throw new Error(msg);
};

export const unless = (cond: () => boolean) => ({
  do: (body: () => void) => {
    while (!cond()) {
      body();
    }
  },
});

export const runWithTime = <T, TArgs extends any[]>(fnc: (...args: TArgs) => T, ...args: TArgs): [number, T] => {
  const t1 = Date.now();
  const res = fnc(...args);
  const t2 = Date.now();
  return [t2 - t1, res];
};

