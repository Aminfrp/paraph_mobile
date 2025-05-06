import ApiCaller, {ApiResponseModel} from '../../helpers/axios';
import refIdGenerator from '../../helpers/refIdGenerator';
import qs from 'query-string';
import {POD_SERVER_URL} from '../../config/APIConfig';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';
import {PairsModel} from '../../model/pairs.model';
import {AppServerResponseModel} from '../../model/appServerResponse.model';
import {CertificateServerResponseModel} from '../../model/certificateServerResponse.model';

type QueryStringDataModel = {
  publicKey: string;
};

export default async (queryStringData: QueryStringDataModel) => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-rc-define';
  try {
    const response = await fetchJSON(queryStringData);
    const data = await responseValidation(response);
    onApiCallingSuccess({params: {}, refId, response}, caller);

    return Promise.resolve({
      data,
      hasError: false,
      errorMessage: null,
    });
  } catch (error) {
    onApiCallingError({params: {}, refId, error}, caller);

    return Promise.reject({
      data: null,
      hasError: true,
      errorMessage: error,
    });
  }
};

const fetchJSON = (queryStringData: QueryStringDataModel) => {
  const options = {
    needAccessToken: true,
    podService: true,
    // coreService: true,
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: qs.stringify(queryStringData),
  };

  return ApiCaller(options).post(`${POD_SERVER_URL}srv/encryption/keys/define`);
};

const responseValidation = (
  response: ApiResponseModel<CertificateServerResponseModel>,
) => {
  if (response && response.status >= 200 && response.status < 300) {
    return Promise.resolve(response.data);
  } else {
    return Promise.reject(response.data);
  }
};
