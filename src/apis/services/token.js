import {RadApiCaller} from '../../helpers/axios';
import radServicesResponseValidation from '../../modules/validation/apiResponseValidation/radServicesResponseValidation';
import {RAD_SERVER_URL} from '../../config/APIConfig';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';
import refIdGenerator from '../../helpers/refIdGenerator';

export default async postData => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-token';
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
  let fileData = new FormData();
  fileData.append('businessClientId', postData.businessClientId);
  fileData.append('keyId', postData.keyId);
  fileData.append('mobile', postData.mobile);
  fileData.append('code', postData.code);

  const options = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: fileData,
  };

  return RadApiCaller(options).post(
    `${RAD_SERVER_URL}api/cms/users/authorize/token`,
  );
};

const responseValidation = response => {
  return radServicesResponseValidation(response);
};
