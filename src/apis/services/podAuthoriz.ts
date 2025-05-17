import {ApiResponseModel, RadApiCaller} from '../../helpers/axios';
import radServicesResponseValidation from '../../modules/validation/apiResponseValidation/radServicesResponseValidation';
import {RAD_SERVER_URL} from '../../config/APIConfig';
import refIdGenerator from '../../helpers/refIdGenerator';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';
import {AuthorizeServiceInput} from '../../model/authorizeServiceInput';
import {RadServerResponseModel} from '../../model/radServerResponse.model';

export default async (postData: Partial<AuthorizeServiceInput>) => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-authorize';
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

const fetchJSON = (postData: Partial<AuthorizeServiceInput>) => {
  let fileData = new FormData();
  fileData.append('businessClientId', postData.businessClientId);
  fileData.append('keyId', postData.keyId);
  fileData.append('mobile', postData.mobile);
  fileData.append('scope', postData.scope);
  postData.loginAsUserId &&
    fileData.append('loginAsUserId', postData.loginAsUserId);

  const options = {
    headers: {
      'Content-Type': 'multipart/form-data',
      Accept: 'multipart/form-data',
    },
    data: fileData,
  };

  return RadApiCaller(options).post(`${RAD_SERVER_URL}api/cms/users/authorize`);
};

const responseValidation = (
  response: ApiResponseModel<RadServerResponseModel>,
) => {
  return radServicesResponseValidation(response);
};
