import {BUSINESS_CODE, SERVER_URL} from '../../config/APIConfig';
import ApiCaller from '../../helpers/axios';
import refIdGenerator from '../../helpers/refIdGenerator';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';
import contractPodServicesResponseValidation from '../../modules/validation/apiResponseValidation/contractPodServicesResponseValidation';

export default async () => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-getAppServerEcdhPublicKey';
  try {
    const response = await fetchJSON();
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

const fetchJSON = () => {
  const options = {
    needAccessToken: true,
    headers: {
      'Accept-Languag': 'fa-IR',
      accept: 'application/json',
      'business-code': BUSINESS_CODE,
    },
  };

  // return ApiCaller(options).get(`${SERVER_URL}api/security/ecdh`);

  return ApiCaller(options)
    .get(`${SERVER_URL}api/security/ecdh`)
    .then(data => {
      console.log('response', data);
      return data;
    });
};

const responseValidation = response => {
  return contractPodServicesResponseValidation(response);
};
