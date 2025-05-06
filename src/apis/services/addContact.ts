import ApiCaller, {ApiResponseModel} from '../../helpers/axios';
import {BUSINESS_CODE, SERVER_URL} from '../../config/APIConfig';
import contactPodServicesResponseValidation from '../../modules/validation/apiResponseValidation/contactPodServicesResponseValidation';
import refIdGenerator from '../../helpers/refIdGenerator';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';
import {ContactServiceInputModel} from '../../model/contactServiceInput.model';
import {AppServerResponseModel} from '../../model/appServerResponse.model';

export default async (dataRaw: Partial<ContactServiceInputModel>[]) => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-addContact';
  try {
    const params = JSON.stringify(dataRaw);
    const response = await fetchJSON(params);
    const data = await responseValidation(response);

    onApiCallingSuccess({params: {}, refId, response}, caller);

    const statusCode = response.data.statusCode;
    const savedGroupContactStatus = response.data.body;

    return {
      data,
      hasError: false,
      errorMessage: null,
      statusCode,
      savedGroupContactStatus,
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

const fetchJSON = (postData: string) => {
  const options = {
    headers: {
      'business-code': BUSINESS_CODE,
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
    needAccessToken: true,
  };

  return ApiCaller(options).post(`${SERVER_URL}api/contact/add/`, postData);
};

const responseValidation = (
  response: ApiResponseModel<AppServerResponseModel>,
) => {
  return contactPodServicesResponseValidation(response);
};
