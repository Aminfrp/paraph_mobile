import {SERVER_URL} from '../../config/APIConfig';
import ApiCaller, {ApiResponseModel} from '../../helpers/axios';
import refIdGenerator from '../../helpers/refIdGenerator';
import {ParaphResponseModel} from '../../model/paraphResponse.model';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';
import servicesResponseValidation from '../../modules/validation/apiResponseValidation/servicesResponseValidation';
import debugLogger from '../../helpers/debugLogger';

export default async (certificate: string) => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-revokeByCertificate';

  try {
    const response = await fetchJSON(certificate);
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

const fetchJSON = (certificate: string) => {
  const options = {
    needAccessToken: true,
    podService: false,
    headers: {
      accept: 'application/json',
    },
  };
  const certificateEncode = encodeURIComponent(certificate);
  debugLogger('certificateEncode', certificateEncode);
  return ApiCaller(options).delete(
    `${SERVER_URL}api/certificate/rishe/revoke/certificate?certificate=${certificateEncode}`,
  );
};

const responseValidation = (
  response: ApiResponseModel<ParaphResponseModel<string>>,
) => {
  return servicesResponseValidation(response);
};
