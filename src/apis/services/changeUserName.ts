import ApiCaller, {ApiResponseModel} from '../../helpers/axios';
import {SSO_SERVER_URL} from '../../config/APIConfig';
import refIdGenerator from '../../helpers/refIdGenerator';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';
import {SsoServerResponseModel} from '../../model/ssoServerResponse.model';

const errorMap = {
  conflict_username: 'نام کاربری تکراری',
};

export default async (userName: string) => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-changeUserName';
  try {
    const response = await fetchJSON(userName);
    const data = await responseValidation(response);

    onApiCallingSuccess({params: {}, refId, response}, caller);

    return {
      data,
      hasError: false,
      errorMessage: null,
    };
  } catch (error: any) {
    onApiCallingError({params: {}, refId, error}, caller);

    return Promise.reject({
      data: {
        ...error?.response?.data,
        error: getErrorData(error),
      },
      hasError: true,
      errorMessage: error,
    });
  }
};

const getErrorData = (error: any) => {
  const key: any = errorMap.hasOwnProperty(error?.response?.data?.error);

  if (errorMap.hasOwnProperty(key)) {
    // @ts-ignore
    return errorMap[key];
  }
  return key;
};

const fetchJSON = async (userName: string) => {
  const options = {
    needAccessToken: true,
    podService: true,
    coreService: false,
    headers: {
      'Accept-Language': 'en',
      'Content-Type': 'application/x-www-form-urlencoded',
      accept: 'application/json',
    },
  };

  const response = await ApiCaller(options).post(
    `${SSO_SERVER_URL}users?preferred_username=${userName}`,
    null,
    // {
    //   transformRequest: (data, headers) => {
    //     headers.post['Content-Type'] = options.headers['Content-Type'];
    //     return data;
    //   },
    // },
  );

  return Promise.resolve(response);
};

const responseValidation = (
  response: ApiResponseModel<SsoServerResponseModel>,
) => {
  if (response && response.status >= 200 && response.status < 300) {
    if (response && response.data) {
      return Promise.resolve(response.data);
    } else {
      return Promise.resolve(response.data);
    }
  } else {
    return Promise.reject(response.data);
  }
};
