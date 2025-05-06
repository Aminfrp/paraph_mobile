import ApiCaller from '../../helpers/axios';
import {CLIENT_ID, RAD_SERVER_URL} from '../../config/APIConfig';
import refIdGenerator from '../../helpers/refIdGenerator';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';

export default async productId => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-getProductById';
  try {
    const response = await fetchJSON(productId);
    const data = await responseValidation(response);
    onApiCallingSuccess({params: {}, refId, response}, caller);

    return {
      data,
      hasError: false,
      errorMessage: null,
    };
  } catch ({error, errorCatch}) {
    onApiCallingError({params: {}, refId, error}, caller);

    return Promise.reject({
      data: null,
      hasError: true,
      errorMessage: error,
    });
  }
};

const fetchJSON = productId => {
  const options = {
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      'Client-Id': CLIENT_ID,
    },
    needAccessToken: false,
  };

  return ApiCaller(options).get(
    `${RAD_SERVER_URL}api/core/products/enable/${productId}`,
  );
};

const responseValidation = response => {
  if (response && response.data && response.data.hasError === false) {
    return Promise.resolve(response.data.result);
  } else {
    return Promise.reject(response.data.message);
  }
};
