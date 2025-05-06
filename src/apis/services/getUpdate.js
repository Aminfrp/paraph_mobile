import ApiCaller from '../../helpers/axios';
import {SERVER_URL} from '../../config/APIConfig';
import getUpdateServiceResponseValidation from '../../modules/validation/apiResponseValidation/getUpdateServiceResponseValidation';
import refIdGenerator from '../../helpers/refIdGenerator';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';

export default async (version, type) => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-getUpdate';

  try {
    const response = await fetchJSON(version, type);
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
      errorMessage: error.response.data.errorMessage,
    });
  }
};

const fetchJSON = (version, type) => {
  const options = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      accept: 'application/json',
      version,
    },
  };
  return ApiCaller(options).get(`${SERVER_URL}api/client/${type}/version`);
  // return ApiCaller(options).get(
  //   `http://contract-qc.pod.ir/api/client/${type}/version`,
  // );
};

const responseValidation = response => {
  return getUpdateServiceResponseValidation(response);
};
