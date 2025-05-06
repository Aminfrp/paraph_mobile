import axios from 'axios';
import {createRef} from 'react';
import ApiCaller, {ApiResponseModel} from '../../helpers/axios';
import ServicesResponseValidation from '../../modules/validation/apiResponseValidation/servicesResponseValidation';
import {BUSINESS_CODE, SERVER_URL} from '../../config/APIConfig';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';
import refIdGenerator from '../../helpers/refIdGenerator';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';
import {RefObjModel} from '../../model/refObj.model';
import {AppServerResponseModel} from '../../model/appServerResponse.model';

export const getUserProfileCancelTokenSource: RefObjModel<any> = createRef();

getUserProfileCancelTokenSource.current = axios.CancelToken.source();

export default async (userSSOID?: number) => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-getUserProfile';

  try {
    const response = await fetchJSON(userSSOID);
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

const fetchJSON = (userSSOID?: number) => {
  const options = {
    needAccessToken: true,
    headers: {
      'business-code': BUSINESS_CODE,
      'Accept-Languag': 'fa-IR',
      accept: 'application/json',
    },
  };

  return userSSOID
    ? ApiCaller(options).get(
        `${SERVER_URL}api/security/userProfile/id/${userSSOID}`,
        {
          cancelToken: getUserProfileCancelTokenSource.current.token,
        },
      )
    : ApiCaller(options).get(`${SERVER_URL}api/security/userProfile`, {
        cancelToken: getUserProfileCancelTokenSource.current.token,
      });
};

const responseValidation = (
  response: ApiResponseModel<AppServerResponseModel>,
) => {
  return ServicesResponseValidation(response);
};
