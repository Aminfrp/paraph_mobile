export default data => {
  return (
    (data &&
      data.length > 0 &&
      data.filter(el => {
        if (!el.draftStateDtos.find(i => i.draftStateTypeId === 2)) {
          return el;
        }
      })) ||
    []
  );
};
