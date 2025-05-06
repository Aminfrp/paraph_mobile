import ApiCaller from '../../helpers/axios';
import logService from './log';
import refIdGenerator from '../../helpers/refIdGenerator';
import {BUSINESS_CODE, SERVER_URL} from '../../config/APIConfig';
import servicesResponseValidation from '../../modules/validation/apiResponseValidation/servicesResponseValidation';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';

export default async postData => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-getPublicKey';
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
    needAccessToken: true,
    headers: {
      'business-code': BUSINESS_CODE,
      accept: 'application/json',
    },
    data: {
      SSoIdList: [postData.ssoId],
    },
  };

  return ApiCaller(options).post(`${SERVER_URL}api/security/publicKey`);
};

const responseValidation = response => {
  return servicesResponseValidation(response);
};
