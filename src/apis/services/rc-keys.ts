import ApiCaller, {ApiResponseModel} from '../../helpers/axios';
import refIdGenerator from '../../helpers/refIdGenerator';
import qs from 'query-string';
import {POD_SERVER_URL} from '../../config/APIConfig';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';
import {CertificateServerResponseModel} from '../../model/certificateServerResponse.model';
import {RisheGenerateInputModel} from '../../model/risheGenerateInput.model';

export default async (key: string, postData: RisheGenerateInputModel) => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-rc-keys';
  try {
    const response = await fetchJSON(key, postData);
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

const fetchJSON = (key: string, postData: RisheGenerateInputModel) => {
  const options = {
    needAccessToken: true,
    podService: true,
    headers: {
      accept: 'application/json',
    },
    data: qs.stringify(postData),
  };

  return ApiCaller(options).post(
    `${POD_SERVER_URL}srv/encryption/certificates/keys/${key}`,
  );
};

const responseValidation = (
  response: ApiResponseModel<CertificateServerResponseModel>,
) => {
  if (response && response.status >= 200 && response.status < 300) {
    if (response.data.certificate && !response.data.certificate.error_message) {
      return Promise.resolve(response.data);
    } else {
      return Promise.reject(response.data.certificate.error_message);
    }
  } else {
    return Promise.reject(response.data);
  }
};
