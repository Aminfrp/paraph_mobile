import ApiCaller from '../../helpers/axios';
import qs from 'query-string';
import {POD_SERVER_URL} from '../../config/APIConfig';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';
import refIdGenerator from '../../helpers/refIdGenerator';

export default async (
  postData = {
    algorithm: 'ecdh',
    keySize: '1024',
    keyFormat: 'pem',
    identifier: 'test',
  },
) => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-getPodEcdhPublicKey';
  try {
    const response = await fetchJSON(postData);
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

const fetchJSON = postData => {
  const options = {
    needAccessToken: true,
    podService: true,
    // coreService: true,
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: qs.stringify(postData),
  };

  return ApiCaller(options).post(
    `${POD_SERVER_URL}srv/encryption/keys/users/publicKey`,
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
