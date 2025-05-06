import {SERVER_URL} from '../../config/APIConfig';
import * as keyStorage from '../../constants/keyStorage';
import {setAsyncStorage} from '../../helpers/asyncStorage';
import ApiCaller, {ApiResponseModel} from '../../helpers/axios';
import refIdGenerator from '../../helpers/refIdGenerator';
import {ParaphResponseModel} from '../../model/paraphResponse.model';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';
import servicesResponseValidation from '../../modules/validation/apiResponseValidation/servicesResponseValidation';

type RefreshTokenResponse = {
  access_token: string;
  device_uid: string;
  id_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
  expires_in: number;
};

export default async (postData: {refresh_token: string}) => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-refreshToken';

  try {
    const response = await fetchJSON(postData);

    const data = await responseValidation(response);

    if (data) {
      await setAsyncStorage('text', keyStorage.ACCESS_TOKEN, data.access_token);
      await setAsyncStorage(
        'text',
        keyStorage.REFRESH_TOKEN,
        data.refresh_token,
      );
      await setAsyncStorage('object', keyStorage.EXPIRES_TOKEN_TIME, {
        data: data.expires_in,
        date: new Date().getTime(),
      });
    }

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

const fetchJSON = async (postData: {refresh_token: string}) => {
  return ApiCaller().post(`${SERVER_URL}api/auth/refresh_token`, {
    refresh_token: postData.refresh_token,
  });
};

const responseValidation = (
  response: ApiResponseModel<ParaphResponseModel<RefreshTokenResponse>>,
) => {
  return servicesResponseValidation(response);
};
