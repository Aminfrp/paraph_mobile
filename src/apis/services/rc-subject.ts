import ApiCaller, {ApiResponseModel} from '../../helpers/axios';
import logService from './log';
import refIdGenerator from '../../helpers/refIdGenerator';
import {POD_SERVER_URL} from '../../config/APIConfig';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';
import {AppServerResponseModel} from '../../model/appServerResponse.model';
import {RisheGenerateInputModel} from '../../model/risheGenerateInput.model';
import {CertificateServerResponseModel} from '../../model/certificateServerResponse.model';

type PostDataModel = Omit<RisheGenerateInputModel, 'keyId'>;
type ResponseModel = ApiResponseModel<
  Exclude<CertificateServerResponseModel, {csrSubject: any}>
>;

export default async (keyId: string, postData: PostDataModel) => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-subject';
  try {
    await logService('info', {params: {keyId, postData}, refId});

    const response = await fetchJSON(keyId, postData);
    const data: Exclude<AppServerResponseModel, {csrSubject: any}> =
      await responseValidation(response);
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

const fetchJSON = (keyId: string, postData: PostDataModel) => {
  let formData = new FormData();
  let i: keyof PostDataModel;
  for (i in postData) {
    formData.append(i, postData[i]);
  }

  const options = {
    needAccessToken: true,
    podService: true,
    headers: {
      accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
    data: formData,
  };

  return ApiCaller(options).post(
    `${POD_SERVER_URL}srv/encryption/certificates/keys/${keyId}/subject`,
  );
};

const responseValidation = (response: ResponseModel) => {
  if (response && response.status >= 200 && response.status < 300) {
    return Promise.resolve(response.data);
  } else {
    return Promise.reject(response.data);
  }
};
