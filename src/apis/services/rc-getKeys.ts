import ApiCaller, {ApiResponseModel} from '../../helpers/axios';
import refIdGenerator from '../../helpers/refIdGenerator';
import {POD_SERVER_URL} from '../../config/APIConfig';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';
import {AppServerResponseModel} from '../../model/appServerResponse.model';

export default async (key: string) => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-rc-getKeys';

  try {
    const response = await fetchJSON(key);
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

const fetchJSON = (key: string) => {
  const options = {
    needAccessToken: true,
    podService: true,
    coreService: false,
    headers: {
      accept: 'application/json',
    },
  };

  return ApiCaller(options).get(
    `${POD_SERVER_URL}srv/encryption/certificates/keys/${key}`,
  );
};

const responseValidation = (
  response: ApiResponseModel<AppServerResponseModel>,
) => {
  if (response && response.status >= 200 && response.status < 300) {
    return Promise.resolve(response.data);
  } else {
    return Promise.reject(response.data);
  }
};
