import ApiCaller from '../../helpers/axios';
import ServicesResponseValidation from '../../modules/validation/apiResponseValidation/servicesResponseValidation';
import {BUSINESS_CODE, SERVER_URL} from '../../config/APIConfig';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';
import refIdGenerator from '../../helpers/refIdGenerator';

export default async () => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-getUserProfileWithToken';

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

const fetchJSON = userSSOID => {
  const options = {
    needAccessToken: true,
    headers: {
      'business-code': BUSINESS_CODE,
      'Accept-Languag': 'fa-IR',
      accept: 'application/json',
    },
  };

  return ApiCaller(options).get(`${SERVER_URL}api/security/userProfile/`);
};

const responseValidation = response => {
  return ServicesResponseValidation(response);
};
