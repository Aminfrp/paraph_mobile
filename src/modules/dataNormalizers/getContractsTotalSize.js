export default (payload, initialTotalSize) => {
  return property => {
    {
      return payload &&
        payload.data &&
        payload.data[Object.keys(payload.data)[0]]
        ? payload.data[Object.keys(payload.data)[0]][0][property]
        : initialTotalSize;
    }
  };
};
