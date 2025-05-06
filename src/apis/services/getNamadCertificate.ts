import ApiCaller, {ApiResponseModel} from '../../helpers/axios';
import refIdGenerator from '../../helpers/refIdGenerator';
import {BUSINESS_CODE, SERVER_URL} from '../../config/APIConfig';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';
import {AppServerResponseModel} from '../../model/appServerResponse.model';

export default async () => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-namadGetKeys';

  try {
    const response = await fetchJSON();
    onApiCallingSuccess({refId, response}, caller);

    const data = await responseValidation(response);
    return {
      data,
      hasError: false,
      errorMessage: null,
    };
  } catch (error) {
    onApiCallingError({refId, error}, caller);

    return Promise.reject({
      data: null,
      hasError: true,
      errorMessage: error,
    });
  }
};

const fetchJSON = () => {
  const options = {
    needAccessToken: true,
    headers: {
      accept: 'application/json',
      'business-code': BUSINESS_CODE,
    },
  };

  return ApiCaller(options).get(`${SERVER_URL}api/certificate/namad`);
};

const responseValidation = (
  response: ApiResponseModel<AppServerResponseModel>,
) => {
  if (response && response.status >= 200 && response.status < 300) {
    if (response && response.data) {
      return Promise.resolve(response.data);
    } else {
      return Promise.reject(response.data.errorMessage);
    }
  } else {
    return Promise.reject(response.data);
  }
};
