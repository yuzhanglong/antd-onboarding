export const delay = (timeout: number, cb: () => any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      cb();
      resolve(true);
    }, timeout);
  });
};
