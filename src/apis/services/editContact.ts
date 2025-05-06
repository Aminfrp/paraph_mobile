import ApiCaller, {ApiResponseModel} from '../../helpers/axios';
import {BUSINESS_CODE, SERVER_URL} from '../../config/APIConfig';
import loadContactServicesResponseValidation from '../../modules/validation/apiResponseValidation/loadContactServicesResponseValidation';
import refIdGenerator from '../../helpers/refIdGenerator';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';
import {ContactServiceInputModel} from '../../model/contactServiceInput.model.ts';
import {AppServerResponseModel} from '../../model/appServerResponse.model.ts';

export default async (dataRaw: Partial<ContactServiceInputModel>) => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-editContact';
  try {
    const response = await fetchJSON(dataRaw);
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

const fetchJSON = (postData: Partial<ContactServiceInputModel>) => {
  const options = {
    headers: {
      'business-code': BUSINESS_CODE,
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
    needAccessToken: true,
  };

  return ApiCaller(options).put(`${SERVER_URL}api/contact/`, postData);
};

const responseValidation = (
  response: ApiResponseModel<AppServerResponseModel>,
) => {
  return loadContactServicesResponseValidation(response);
};
