import ApiCaller, {ApiResponseModel} from '../../helpers/axios';
import ssoIdResponseValidation from '../../modules/validation/apiResponseValidation/ssoIdResponseValidation';
import {SSO_SERVER_URL} from '../../config/APIConfig';
import refIdGenerator from '../../helpers/refIdGenerator';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';
import {SsoServerResponseModel} from '../../model/ssoServerResponse.model.ts';

export default async () => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-ssoId';
  try {
    const response = await fetchJSON();
    const data = await responseValidation(response);
    onApiCallingSuccess({params: {}, refId, response}, caller);

    return {
      data: data?.data,
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
      accept: 'application/json',
    },
    needAccessToken: true,
    podService: true,
  };

  return ApiCaller(options).get(`${SSO_SERVER_URL}users`);
};

const responseValidation = (
  response: ApiResponseModel<SsoServerResponseModel>,
) => {
  return ssoIdResponseValidation(response);
};
