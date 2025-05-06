import {SERVER_URL} from '../../config/APIConfig';
import ApiCaller, {ApiResponseModel} from '../../helpers/axios';
import refIdGenerator from '../../helpers/refIdGenerator';
import {HandshakeServiceInputModel} from '../../model/handshakeServiceInput.model';
import {ParaphResponseModel} from '../../model/paraphResponse.model';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';
import servicesResponseValidation from '../../modules/validation/apiResponseValidation/servicesResponseValidation';

export type HandShakeResponse = {
  algorithm: string;
  expires_in: number;
  keyFormat: string;
  keyId: string;
  publicKey: string;
  client: {
    id: number;
    accessTokenExpiryTime: number;
    otpCodeExpiryTime: number;
    refreshTokenExpiryTime: number;
    active: boolean;
    autoLoginAs: boolean;
    limitedLoginAs: boolean;
    loginAsDepositEnabled: boolean;
    signupEnabled: boolean;
    twoFAEnabled: boolean;
    roles: string[];
    allowedGrantTypes: string[];
    allowedRedirectUris: string[];
    allowedScopes: string[];
    client_id: string;
    loginUrl: string;
    url: string;
    name: string;
    supportNumber: string;
  };
};

export default async (postData: HandshakeServiceInputModel) => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-handshake';

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

const fetchJSON = async (postData: HandshakeServiceInputModel) => {
  const data = {
    device_client_ip: '1.1.1.1',
    device_uid: postData.device_uid,
    device_type: 'Mobile Phone',
  };

  const options = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };

  return ApiCaller(options).post(`${SERVER_URL}api/auth/handshake`, data);
};

const responseValidation = (
  response: ApiResponseModel<ParaphResponseModel<HandShakeResponse>>,
) => {
  return servicesResponseValidation(response);
};
