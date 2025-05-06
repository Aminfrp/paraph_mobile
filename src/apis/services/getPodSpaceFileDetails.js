import ApiCaller from '../../helpers/axios';
import refIdGenerator from '../../helpers/refIdGenerator';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';

export default async url => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-getPodSpaceFileDetails';
  try {
    const response = await fetchJSON(url);
    const data = await responseValidation(response);
    onApiCallingSuccess({params: {}, refId, response}, caller);

    return Promise.resolve({
      data,
      errorMessage: null,
      hasError: false,
    });
  } catch (error) {
    onApiCallingError({params: {}, refId, error}, caller);
    return Promise.reject({
      data: null,
      hasError: true,
      errorMessage: error,
    });
  }
};

const fetchJSON = url => {
  const options = {
    needAccessToken: true,
    podService: true,
  };

  return ApiCaller(options).get(`${url}/detail`);
};

const responseValidation = response => {
  if (response && response.data && response.data.status === 200) {
    return Promise.resolve(response.data.result);
  }
  return Promise.reject({errorMessage: 'فایل یافت نشد.'});
};
