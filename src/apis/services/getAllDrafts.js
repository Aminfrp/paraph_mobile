import ApiCaller from '../../helpers/axios';
import convertJsonToQueryString from '../../helpers/convertJsonToQueryString';
import refIdGenerator from '../../helpers/refIdGenerator';
import contractPodServicesResponseValidation from '../../modules/validation/apiResponseValidation/contractPodServicesResponseValidation';
import {BUSINESS_CODE, SERVER_URL} from '../../config/APIConfig';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';

export default async postData => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-getAllDrafts';
  try {
    const response = await fetchJSON(postData);
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

const fetchJSON = postData => {
  const {...params} = postData;

  const options = {
    headers: {
      'Content-Type': 'application/json',
      'business-code': BUSINESS_CODE,
    },
    needAccessToken: true,
  };

  return ApiCaller(options).get(
    `${SERVER_URL}api/draft/?${convertJsonToQueryString(params)}`,
  );
};

const responseValidation = response => {
  return contractPodServicesResponseValidation(response);
};
