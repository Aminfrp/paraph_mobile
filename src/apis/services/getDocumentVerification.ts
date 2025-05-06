import axios from 'axios';
import {createRef} from 'react';
import ApiCaller, {ApiResponseModel} from '../../helpers/axios';
import {BUSINESS_CODE, SERVER_URL} from '../../config/APIConfig';
import refIdGenerator from '../../helpers/refIdGenerator';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';
import {AppServerResponseModel} from '../../model/appServerResponse.model';
import {RefObjModel} from '../../model/refObj.model';

export const getDocVerificationCancelTokenSource: RefObjModel<any> =
  createRef();

getDocVerificationCancelTokenSource.current = axios.CancelToken.source();

export default async (documentHash: string) => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-getDocumentVerification';
  try {
    const response = await fetchJSON(documentHash);
    const data = await responseValidation(response);
    onApiCallingSuccess({params: {}, refId, response}, caller);

    return {
      data,
      hasError: false,
      errorMessage: null,
    };
  } catch (error: any) {
    onApiCallingError({params: {}, refId, error}, caller);

    return Promise.reject({
      data: error.response.data,
      hasError: true,
      errorMessage: error,
    });
  }
};

const fetchJSON = (documentHash: string) => {
  const options = {
    needAccessToken: true,
    headers: {
      'business-code': BUSINESS_CODE,
      'Accept-Languag': 'fa-IR',
      accept: 'application/json',
    },
  };

  return ApiCaller(options).get(
    `${SERVER_URL}api/contract/verify/${documentHash}`,
    {
      cancelToken: getDocVerificationCancelTokenSource.current.token,
    },
  );
};

const responseValidation = (
  response: ApiResponseModel<AppServerResponseModel>,
) => {
  if (response && response.status >= 200 && response.status < 300) {
    if (
      response &&
      response.data &&
      response.data.statusCode === 'OK' &&
      response.data.message === 'hash verified'
    ) {
      return Promise.resolve(response.data);
    } else {
      return Promise.reject(response.data.errorMessage);
    }
  } else {
    return Promise.reject(response.data.statusCode);
  }
};
