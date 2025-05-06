import ApiCaller, {ApiResponseModel} from '../../helpers/axios';
import {BUSINESS_CODE, SERVER_URL} from '../../config/APIConfig';
import contractPodServicesResponseValidation from '../../modules/validation/apiResponseValidation/contractPodServicesResponseValidation';
import refIdGenerator from '../../helpers/refIdGenerator';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';
import {AppServerResponseModel} from '../../model/appServerResponse.model.ts';

export default async (id: number) => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-getContractById';

  try {
    const response = await fetchJSON(id);
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

const fetchJSON = (id: number) => {
  const options = {
    headers: {
      'Content-Type': 'application/json',
      'business-code': BUSINESS_CODE,
    },
    needAccessToken: true,
  };

  return ApiCaller(options).get(`${SERVER_URL}api/contract/${id}`);
};

const responseValidation = (
  response: ApiResponseModel<AppServerResponseModel>,
) => {
  return contractPodServicesResponseValidation(response);
};
