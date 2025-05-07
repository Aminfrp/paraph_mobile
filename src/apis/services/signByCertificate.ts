import {BUSINESS_CODE, SERVER_URL} from '../../config/APIConfig';
import ApiCaller, {ApiResponseModel} from '../../helpers/axios';
import refIdGenerator from '../../helpers/refIdGenerator';
import {AppServerResponseModel} from '../../model/appServerResponse.model';
import {SignByCertificateInputModel} from '../../model/signByCertificateInput.model';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';
import ServicesResponseValidation from '../../modules/validation/apiResponseValidation/servicesResponseValidation';

export default async (postData: SignByCertificateInputModel) => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-signByCertificate';
  try {
    const response: ApiResponseModel<AppServerResponseModel> = await fetchJSON(
      postData,
    );
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
      data: error.response.data,
      hasError: true,
      errorMessage: error,
    });
  }
};

const fetchJSON = (postData: SignByCertificateInputModel) => {
  let formData = new FormData();
  formData.append('sign', postData.sign);
  formData.append('certType', postData.certType);
  formData.append('keyId', postData.keyId);

  const options = {
    headers: {
      'business-code': BUSINESS_CODE,
      'Content-Type': 'multipart/form-data',
    },
    needAccessToken: true,
    data: formData,
  };
  return ApiCaller(options).post(
    `${SERVER_URL}api/contract/sign/${postData.id}/cert`,
  );
};

const responseValidation = (
  response: ApiResponseModel<AppServerResponseModel>,
) => {
  return ServicesResponseValidation(response);
};
