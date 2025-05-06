import ApiCaller, {ApiResponseModel} from '../../helpers/axios';
import refIdGenerator from '../../helpers/refIdGenerator';
import {POD_SERVER_URL} from '../../config/APIConfig';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';
import {CertificateServerResponseModel} from '../../model/certificateServerResponse.model';

type ResponseTypeModel = Partial<CertificateServerResponseModel> & {
  certificates: any;
};

export default async () => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-rc-keys';
  try {
    const response = await fetchJSON();
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

const fetchJSON = () => {
  const options = {
    needAccessToken: true,
    podService: true,
    headers: {
      accept: 'application/json',
    },
  };

  return ApiCaller(options).get(
    `${POD_SERVER_URL}srv/encryptiontst/certificates/user`,
  );
};

const responseValidation = (response: ApiResponseModel<ResponseTypeModel>) => {
  if (response && response.status >= 200 && response.status < 300) {
    if (response.data.certificates) {
      return Promise.resolve(response.data.certificates);
    } else {
      return Promise.reject(response.data);
    }
  } else {
    return Promise.reject(response.data);
  }
};
