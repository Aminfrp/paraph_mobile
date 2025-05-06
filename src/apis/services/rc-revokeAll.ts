import ApiCaller, {ApiResponseModel} from '../../helpers/axios';
import refIdGenerator from '../../helpers/refIdGenerator';
import {BUSINESS_CODE, SERVER_URL} from '../../config/APIConfig';
import getUpdateServiceResponseValidation from '../../modules/validation/apiResponseValidation/getUpdateServiceResponseValidation';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';
import {AppServerResponseModel} from '../../model/appServerResponse.model';

export default async () => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-rc-revokeAll';
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
    needAccessToken: true,
    headers: {
      accept: 'application/json',
      'business-code': BUSINESS_CODE,
    },
  };

  return ApiCaller(options).get(`${SERVER_URL}api/security/certificate/revoke`);
};

const responseValidation = (
  response: ApiResponseModel<AppServerResponseModel>,
) => {
  return getUpdateServiceResponseValidation(response);
};
