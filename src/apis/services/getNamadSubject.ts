import refIdGenerator from '../../helpers/refIdGenerator';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';
import {BUSINESS_CODE, SERVER_URL} from '../../config/APIConfig';
import ApiCaller, {ApiResponseModel} from '../../helpers/axios';
import {NamadSubjectInputModel} from '../../model/namadSubjectInput.model';
import {AppServerResponseModel} from '../../model/appServerResponse.model';

export default async (
  keyId: string,
  postData: NamadSubjectInputModel,
): Promise<any> => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-NamadSubject';

  try {
    const response = await fetchJSON(keyId, postData);
    onApiCallingSuccess({params: {keyId, postData}, refId, response}, caller);
    const data = await responseValidation(response);

    return {
      data,
      hasError: false,
      errorMessage: null,
    };
  } catch (error) {
    onApiCallingError({params: {keyId, postData}, refId, error}, caller);

    return Promise.reject({
      data: error,
      hasError: true,
      errorMessage: error,
    });
  }
};

const fetchJSON = (keyId: string, postData: NamadSubjectInputModel) => {
  let rawData = JSON.stringify({
    keyId: keyId,
    // "shahabCode": postData?.shahabCode,
    email: postData?.email,
    jsonFormat: false,
  });

  const options = {
    needAccessToken: true,
    headers: {
      accept: 'application/json',
      'business-code': BUSINESS_CODE,
      'Content-Type': 'application/json',
    },
    data: rawData,
  };

  return ApiCaller(options).post(`${SERVER_URL}api/certificate/namad/subject`);
};

const responseValidation = (
  response: ApiResponseModel<AppServerResponseModel>,
) => {
  if (response && response.status >= 200 && response.status < 300) {
    return Promise.resolve(response.data);
  } else {
    return Promise.reject(response.data);
  }
};
