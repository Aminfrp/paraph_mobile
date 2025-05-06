import refIdGenerator from '../../helpers/refIdGenerator';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';
import {BUSINESS_CODE, SERVER_URL} from '../../config/APIConfig';
import ApiCaller, {ApiResponseModel} from '../../helpers/axios';
import {AppServerResponseModel} from '../../model/appServerResponse.model';

export default async (keyId: string) => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-revokeNamad';

  try {
    const response: ApiResponseModel<AppServerResponseModel> = await fetchJSON(
      keyId,
    );
    onApiCallingSuccess({params: {}, refId, response}, caller);
    const data = await responseValidation(response);

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

const fetchJSON = (keyId: string) => {
  const options = {
    needAccessToken: true,
    headers: {
      accept: 'application/json',
      'business-code': BUSINESS_CODE,
      'Content-Type': 'application/json',
    },
  };

  return ApiCaller(options).delete(
    `${SERVER_URL}api/certificate/namad/revoke/${keyId}?certificateType&revokeReason=Mistake_Info`,
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
