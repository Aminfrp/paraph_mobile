export default () => {
  let refId = 'client-';
  let j;
  let i;

  for (j = 0; j < 32; j++) {
    if (j === 8 || j === 12 || j === 16 || j === 20) {
      refId += '-';
    }
    i = Math.floor(Math.random() * 16)
        .toString(16)
        .toUpperCase();

    refId += i;
  }

  return refId;
};
