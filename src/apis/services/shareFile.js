import ApiCaller from '../../helpers/axios';
import refIdGenerator from '../../helpers/refIdGenerator';
import {BUSINESS_CODE, SERVER_URL} from '../../config/APIConfig';
import ServicesResponseValidation from '../../modules/validation/apiResponseValidation/servicesResponseValidation';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';

export default async postData => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-shareFile';
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
      fileHash: postData.fileHash,
      persons: postData.person,
    },
  };

  return ApiCaller(options).post(`${SERVER_URL}api/file/share`);
};

const responseValidation = response => {
  return ServicesResponseValidation(response);
};
