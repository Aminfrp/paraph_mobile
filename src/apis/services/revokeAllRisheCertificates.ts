import refIdGenerator from '../../helpers/refIdGenerator';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';
import {BUSINESS_CODE, SERVER_URL} from '../../config/APIConfig';
import ApiCaller, {ApiResponseModel} from '../../helpers/axios';
import rcKeysServicesResponseValidation from '../../modules/validation/apiResponseValidation/rcKeysServicesResponseValidation';
import onApiCallingStart from '../../modules/apiCaller/onApiCallingStart';
import {CertificateServerResponseModel} from '../../model/certificateServerResponse.model';

export default async () => {
  const refId = refIdGenerator();
  const caller = 'revokeAllRootCertificateCertificates';

  try {
    onApiCallingStart(caller);
    const response = await fetchJSON();
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
      data: null,
      hasError: true,
      errorMessage: error,
    });
  }
};

const fetchJSON = () => {
  const options = {
    needAccessToken: true,
    headers: {
      'business-code': BUSINESS_CODE,
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  return ApiCaller(options).get(
    `${SERVER_URL}api/certificate/rishe/revoke/all`,
  );
};

const responseValidation = (
  response: ApiResponseModel<CertificateServerResponseModel>,
) => {
  return rcKeysServicesResponseValidation(response);
};
