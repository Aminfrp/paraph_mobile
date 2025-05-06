import ApiCaller, {ApiResponseModel} from '../../helpers/axios';
import refIdGenerator from '../../helpers/refIdGenerator';
import {BUSINESS_CODE, SERVER_URL} from '../../config/APIConfig';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';
import {AppServerResponseModel} from '../../model/appServerResponse.model.ts';

export default async () => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-checkRootCertificateServicesStability';
  try {
    const response = await fetchJSON();
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

const fetchJSON = () => {
  const options = {
    headers: {
      'Content-Type': 'application/json',
      'business-code': BUSINESS_CODE,
    },
    needAccessToken: true,
  };

  return ApiCaller(options).get(`${SERVER_URL}api/business/state/rishe`);
};

const responseValidation = (
  response: ApiResponseModel<AppServerResponseModel>,
) => {
  if (response && response.status >= 200 && response.status < 300) {
    if (
      response &&
      response.data &&
      response.data.statusCode === 'OK' &&
      response.data.errorMessage === null &&
      response.data
    ) {
      return Promise.resolve(response.data.body);
    }
  }
  return Promise.reject(response.data);
};
