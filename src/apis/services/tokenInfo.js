import ApiCaller from '../../helpers/axios';
import convertJsonToQueryString from '../../helpers/convertJsonToQueryString';
import refIdGenerator from '../../helpers/refIdGenerator';
import {SSO_SERVER_URL} from '../../config/APIConfig';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';

export default async postData => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-tokenInfo';
  try {
    const response = await fetchJSON(postData);
    const data = await responseValidation(response);
    onApiCallingSuccess({params: {}, refId, response}, caller);

    return {
      data,
      hasError: false,
      errorMessage: null,
    };
  } catch (error) {
    onApiCallingError({params: {}, refId, error}, caller);

    return Promise.reject({
      data: null,
      hasError: true,
      errorMessage: error,
    });
  }
};

const fetchJSON = postData => {
  const options = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      // authorization: BASIC_AUTH,
      accept: 'application/json',
    },
  };

  return ApiCaller(options).post(
    `${SSO_SERVER_URL}oauth2/token/info?${convertJsonToQueryString(postData)}`,
    null,
    {
      transformRequest: (data, headers) => {
        headers.post['Content-Type'] = options.headers['Content-Type'];
        return headers;
      },
    },
  );
};

const responseValidation = response => {
  const customError = ['زمان دسترسی شما پایان یافت!'];

  if (response && response.status >= 200 && response.status < 300) {
    if (response.data && response.data.active === true) {
      return Promise.resolve(response.data);
    } else {
      return Promise.reject(customError);
    }
  }
  return Promise.reject(response.data);
};
