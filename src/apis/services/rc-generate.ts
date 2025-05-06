import {SERVER_URL} from '../../config/APIConfig';
import ApiCaller, {ApiResponseModel} from '../../helpers/axios';
import refIdGenerator from '../../helpers/refIdGenerator';
import {CertificateCallbackResponse} from '../../model/certificateCallbackResponse';
import {ParaphResponseModel} from '../../model/paraphResponse.model';
import {RisheGenerateInputModel} from '../../model/risheGenerateInput.model';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';

type PostDataModel = Omit<RisheGenerateInputModel, 'keyId'>;

export default async (keyId: string, postData: PostDataModel) => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-rc-generate';
  try {
    const response = await fetchJSON(keyId, postData);
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

const fetchJSON = async (keyId: string, postData: PostDataModel) => {
  const params = new FormData();

  for (let i in postData) {
    params.append(i, postData[i]);
  }

  const options = {
    needAccessToken: true,
    podService: false,
    headers: {
      accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
    data: params,
  };

  return await ApiCaller(options).post(
    `${SERVER_URL}api/certificate/rishe/csr/${keyId}`,
  );
};

const responseValidation = (
  response: ApiResponseModel<ParaphResponseModel<CertificateCallbackResponse>>,
) => {
  if (response && response.status >= 200 && response.status < 300) {
    if (response.data.body && !response.data.errorMessage) {
      return Promise.resolve(response.data);
    } else {
      return Promise.reject(response.data.errorMessage);
    }
  } else {
    return Promise.reject(response.data);
  }
};
