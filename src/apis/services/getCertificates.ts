import {SERVER_URL} from '../../config/APIConfig';
import ApiCaller, {ApiResponseModel} from '../../helpers/axios';
import refIdGenerator from '../../helpers/refIdGenerator';
import {CertificateModel} from '../../model/certificateList.model';
import {ParaphResponseModel} from '../../model/paraphResponse.model';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';

type ResponseTypeModel = ParaphResponseModel<CertificateModel[]>;

export default async () => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-certificate-list';
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
    podService: false,
    headers: {
      accept: 'application/json',
    },
  };

  return ApiCaller(options).get(
    `${SERVER_URL}api/certificate/rishe/certificates`,
  );
};

const responseValidation = (response: ApiResponseModel<ResponseTypeModel>) => {
  if (response && response.status >= 200 && response.status < 300) {
    return Promise.resolve(response.data.body);
  } else {
    return Promise.reject(response.data);
  }
};
