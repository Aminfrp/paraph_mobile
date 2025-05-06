import {GenerateNamadServiceInputModel} from '../../model/generateNamadServiceInput.model';
import refIdGenerator from '../../helpers/refIdGenerator';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';
import {BUSINESS_CODE, SERVER_URL} from '../../config/APIConfig';
import ApiCaller from '../../helpers/axios';

export default async (
  keyId: string,
  postData: GenerateNamadServiceInputModel,
): Promise<{data: any; hasError: boolean; errorMessage: any}> => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-Generate-Namad-Certificate';

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
    // @ts-ignore
    onApiCallingError({params: {keyId, postData}, refId, error}, caller);
    return Promise.reject({
      data: error,
      hasError: true,
      errorMessage: error,
    });
  }
};

const fetchJSON = (keyId: string, postData: GenerateNamadServiceInputModel) => {
  let formData = new FormData();
  formData.append('keyId', keyId);
  // formData.append('shahabCode', postData?.shahabCode);
  formData.append('csr', postData?.csr);
  formData.append('address', postData?.address);
  formData.append('email', postData?.email);

  const options = {
    needAccessToken: true,
    headers: {
      'business-code': BUSINESS_CODE,
      'Content-Type': 'multipart/form-data',
    },
    data: formData,
  };

  return ApiCaller(options).post(`${SERVER_URL}api/certificate/namad/csr`);
};

const responseValidation = (response: any) => {
  if (response && response.status >= 200 && response.status < 300) {
    if (response?.data?.body?.namadCertificate?.certificate) {
      return Promise.resolve(response.data?.body);
    } else {
      return Promise.reject(response?.data?.body);
    }
  } else {
    return Promise.reject(response.data);
  }
};
