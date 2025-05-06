import ApiCaller from '../../helpers/axios';
import refIdGenerator from '../../helpers/refIdGenerator';
import {BUSINESS_CODE, SERVER_URL} from '../../config/APIConfig';
import contractPodServicesResponseValidation from '../../modules/validation/apiResponseValidation/contractPodServicesResponseValidation';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';

export default async postData => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-signContractById';
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

const fetchJSON = ({id, description}) => {
  const options = {
    headers: {
      // 'Content-Type': 'application/x-www-form-urlencoded',
      'business-code': BUSINESS_CODE,
      'Content-Type': 'text/plain',
    },
    needAccessToken: true,
  };

  return ApiCaller(options).post(
    `${SERVER_URL}api/contract/sign/${id}`,
    description,
  );
};

const responseValidation = response => {
  return contractPodServicesResponseValidation(response);
};
