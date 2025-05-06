export default (response: any) => {
  if (response && response.status >= 200 && response.status < 300) {
    if (
      response &&
      response.data &&
      response.data.statusCode === 'OK' &&
      response.data.body &&
      response.data.errorMessage === null
    ) {
      return Promise.resolve(response.data.body);
    } else {
      return Promise.reject(response.errorMessage);
    }
  } else {
    return Promise.reject(response.statusCode);
  }
};
