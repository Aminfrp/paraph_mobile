export default data => {
  return (
    data &&
    data
      .map(item => {
        return item.contractStateDTOs
          .map(i => i)
          .sort((a, b) => b.submitTime - a.submitTime)[0];
      })
      .sort((a, b) => b.submitTime - a.submitTime)
  );
};
