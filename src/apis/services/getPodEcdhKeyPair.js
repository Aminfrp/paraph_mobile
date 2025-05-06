import ApiCaller from '../../helpers/axios';
import {POD_SERVER_URL} from '../../config/APIConfig';
import refIdGenerator from '../../helpers/refIdGenerator';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';

export default async postData => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-getPodEcdhKeyPairs';
  try {
    const {keyFormat, identifier} = postData;
    const response = await fetchJSON(keyFormat, identifier);
    const data = await responseValidation(response);
    onApiCallingSuccess({params: {}, refId, response}, caller);

    return Promise.resolve({
      data,
      hasError: false,
      errorMessage: null,
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

const fetchJSON = (keyFormat, identifier) => {
  const options = {
    needAccessToken: true,
    podService: true,
    // coreService: true,
    headers: {
      'Accept-Languag': 'fa-IR',
      accept: 'application/json',
    },
  };

  return ApiCaller(options).get(
    `${POD_SERVER_URL}srv/encryption/keys/identifier/${identifier}?keyFormat=${keyFormat}`,
  );
};

const responseValidation = response => {
  if (response && response.status >= 200 && response.status < 300) {
    if (response && response.data) {
      return Promise.resolve(response.data);
    } else {
      return Promise.reject(response.data);
    }
  } else {
    return Promise.reject(response.data);
  }
};
