import ApiCaller from '../../helpers/axios';
import convertJsonToQueryString from '../../helpers/convertJsonToQueryString';
import refIdGenerator from '../../helpers/refIdGenerator';
import {BUSINESS_CODE, SERVER_URL} from '../../config/APIConfig';
import contractPodServicesResponseValidation from '../../modules/validation/apiResponseValidation/contractPodServicesResponseValidation';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';

export default async postData => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-getContactByPhoneNumber';
  try {
    const response = await fetchJSON(postData);

    const data = await responseValidation(response);

    onApiCallingSuccess({params: {}, refId, response}, caller);

    return {
      data: data?.result,
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
  const options = {
    needAccessToken: true,
    headers: {
      'business-code': BUSINESS_CODE,
      accept: 'application/json',
    },
  };

  return ApiCaller(options).get(
    `${SERVER_URL}api/contact/all?${convertJsonToQueryString(postData)}`,
  );
};

const responseValidation = response => {
  return contractPodServicesResponseValidation(response);
};
