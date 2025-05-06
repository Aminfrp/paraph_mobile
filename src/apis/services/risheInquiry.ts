import {SERVER_URL} from '../../config/APIConfig';
import ApiCaller, {ApiResponseModel} from '../../helpers/axios';
import refIdGenerator from '../../helpers/refIdGenerator';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';

type ResponseTypeModel = {
  keyId: string;
  requestId: string;
  certificate: string;
};

export default async (key: string, requestId: string) => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-rc-inquiry';
  try {
    const response = await fetchJSON(key, requestId);
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
      data: error,
      hasError: true,
      errorMessage: error,
    });
  }
};

const fetchJSON = (key: string, requestId: string) => {
  const options = {
    needAccessToken: true,
    podService: false,
    headers: {
      accept: 'application/json',
    },
  };

  return ApiCaller(options).get(
    `${SERVER_URL}api/certificate/rishe/inquiry/${key}?requestId=${requestId}`,
  );
};

const responseValidation = (response: ApiResponseModel<any>) => {
  if (response && response.status >= 200 && response.status < 300) {
    if (response.data) {
      return Promise.resolve(response.data.body);
    } else {
      return Promise.reject(response.data.errorMessage);
    }
  } else {
    return Promise.reject(response.data);
  }
};
