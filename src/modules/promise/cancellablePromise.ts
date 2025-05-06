// Our function to cancel promises receives a promise and return the same one and a cancel function
export default <T>(promiseToCancel: Promise<T>) => {
  let cancel;
  const promise = new Promise((resolve, reject) => {
    cancel = reject;
    promiseToCancel.then(resolve).catch(reject);
  });
  return {promise, cancel};
};
