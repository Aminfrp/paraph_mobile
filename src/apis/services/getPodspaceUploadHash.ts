import ApiCaller, {ApiResponseModel} from '../../helpers/axios';
import {BUSINESS_CODE, SERVER_URL} from '../../config/APIConfig';
import podspaceUploadHashValidation from '../../modules/validation/apiResponseValidation/podspaceUploadHashValidation';
import refIdGenerator from '../../helpers/refIdGenerator';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';

export default async () => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-getPodspaceUploadHash';
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
      data: null,
      hasError: true,
      errorMessage: error,
    });
  }
};

const fetchJSON = () => {
  const options = {
    needAccessToken: true,
    headers: {
      'business-code': BUSINESS_CODE,
      'Accept-Languag': 'fa-IR',
      accept: 'application/json',
    },
  };

  return ApiCaller(options).get(`${SERVER_URL}api/file/uploadlink`);
};

const responseValidation = (response: ApiResponseModel<any>) => {
  return podspaceUploadHashValidation(response);
};
