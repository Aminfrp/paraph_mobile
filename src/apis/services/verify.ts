import {SERVER_URL} from '../../config/APIConfig';
import ApiCaller, {ApiResponseModel} from '../../helpers/axios';
import refIdGenerator from '../../helpers/refIdGenerator';
import {ParaphResponseModel} from '../../model/paraphResponse.model';
import {VerifyServiceInputModel} from '../../model/verifyServiceInput.model';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';
import servicesResponseValidation from '../../modules/validation/apiResponseValidation/servicesResponseValidation';

export type VerifyResponse = {
  access_token: string;
  device_uid: string;
  id_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
  expires_in: number;
};

export default async (postData: VerifyServiceInputModel) => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-verify';
  try {
    const response = await fetchJSON(postData);
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

const fetchJSON = (postData: VerifyServiceInputModel) => {
  const data = {
    keyId: postData.keyId,
    otp: postData.otp,
  };

  return ApiCaller().post(
    `${SERVER_URL}api/auth/verify/${postData.mobile}`,
    data,
  );
};

const responseValidation = (
  response: ApiResponseModel<ParaphResponseModel<VerifyResponse>>,
) => {
  return servicesResponseValidation(response);
};
