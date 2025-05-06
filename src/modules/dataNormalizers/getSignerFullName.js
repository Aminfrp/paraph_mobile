export default data => {
  if (data) {
    if (data.family_name) {
      return data.family_name;
    } else if (data.preferred_username) {
      return data.preferred_username;
    } else return data.given_name;
  }
  return '';
};
