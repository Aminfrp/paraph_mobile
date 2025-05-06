import {SERVER_URL} from '../../config/APIConfig';
import ApiCaller, {ApiResponseModel} from '../../helpers/axios';
import refIdGenerator from '../../helpers/refIdGenerator';
import {AuthorizeServiceInput} from '../../model/authorizeServiceInput';
import {ParaphResponseModel} from '../../model/paraphResponse.model';
import {RadServerResponseModel} from '../../model/radServerResponse.model';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';
import radServicesResponseValidation from '../../modules/validation/apiResponseValidation/radServicesResponseValidation';
import servicesResponseValidation from '../../modules/validation/apiResponseValidation/servicesResponseValidation';

type AuthorizeResponse = {
  type: string;
  identity: string;
  expires_in: number;
  codeLength: number;
  sent_before: boolean;
};

export default async (postData: Partial<AuthorizeServiceInput>) => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-authorize';
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

const fetchJSON = (postData: Partial<AuthorizeServiceInput>) => {
  const data = {
    keyId: postData.keyId,
    scope: postData.scope,
    response_type: 'code',
    identityType: 'phone_number',
  };

  return ApiCaller().post(
    `${SERVER_URL}api/auth/authorize/${postData.mobile}`,
    data,
  );
};

const responseValidation = (
  response: ApiResponseModel<ParaphResponseModel<AuthorizeResponse>>,
) => {
  return servicesResponseValidation(response);
};
