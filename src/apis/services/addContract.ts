import ApiCaller, {ApiResponseModel} from '../../helpers/axios';
import {BUSINESS_CODE, SERVER_URL} from '../../config/APIConfig';
import ServicesResponseValidation from '../../modules/validation/apiResponseValidation/servicesResponseValidation';
import refIdGenerator from '../../helpers/refIdGenerator';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';
import {ContactServiceInputModel} from '../../model/contactServiceInput.model';
import {AppServerResponseModel} from '../../model/appServerResponse.model';

export default async (postData: Partial<ContactServiceInputModel>) => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-addContract';
  try {
    const params = JSON.stringify(postData);

    const response = await fetchJSON(params);
    const data = await responseValidation(response);

    onApiCallingSuccess({params: {}, refId, response}, caller);

    return {
      data,
      hasError: false,
      errorMessage: null,
    };
  } catch (error) {
    onApiCallingError({params: {}, refId, error}, caller);
    // @ts-ignore
    const errorData = error && error.response && error.response.data;
    return Promise.reject({
      data: errorData,
      hasError: true,
      errorMessage: error,
    });
  }
};

const fetchJSON = (postData: string) => {
  const options = {
    needAccessToken: true,
    headers: {
      'business-code': BUSINESS_CODE,
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
    data: postData,
  };

  return ApiCaller(options).post(`${SERVER_URL}api/contract/submit`, postData);
};

const responseValidation = (
  response: ApiResponseModel<AppServerResponseModel>,
) => {
  return ServicesResponseValidation(response);
};
