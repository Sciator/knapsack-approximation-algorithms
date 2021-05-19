
/**
 * surround async function (withou params) with setTimout 0
 */
export const delayed = async <T>(task: () => Promise<T>): Promise<T> => {
  return new Promise((r, e) => {
    setTimeout(async () => {
      try {
        const res = await task();
        r(res);
      } catch (error) {
        e(error);
      }
    }, 0);
  });
};

export const sleep = async (ms: number): Promise<never> => {
  return new Promise(r => setTimeout(r, ms));
};

export const sleepWithSkip = (ms: number): { awaiter: Promise<never>, skip: () => void } => {
  let timeout: NodeJS.Timeout;
  let resolve: () => void;
  const awaiter = new Promise<never>(r => { resolve = r as () => void; });
  timeout = setTimeout(resolve, ms);

  const skip = () => {
    clearTimeout(timeout);
    resolve();
  };

  return { awaiter, skip };
};



