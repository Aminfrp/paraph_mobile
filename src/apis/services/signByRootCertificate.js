import ApiCaller from '../../helpers/axios';
import {BUSINESS_CODE, SERVER_URL} from '../../config/APIConfig';
import ServicesResponseValidation from '../../modules/validation/apiResponseValidation/servicesResponseValidation';
import refIdGenerator from '../../helpers/refIdGenerator';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';

export default async postData => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-signByRootCertificate';
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
      data: error.response.data,
      hasError: true,
      errorMessage: error,
    });
  }
};

const fetchJSON = postData => {
  let formData = new FormData();
  formData.append('sign', postData.sign);
  formData.append('publicKey', postData.public);

  const options = {
    headers: {
      'business-code': BUSINESS_CODE,
      'Content-Type': 'multipart/form-data',
    },
    needAccessToken: true,
    data: formData,
  };

  return ApiCaller(options).post(
    `${SERVER_URL}api/contract/sign/${postData.id}/cert`,
  );
};

const responseValidation = response => {
  return ServicesResponseValidation(response);
};
