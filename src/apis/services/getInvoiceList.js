import ApiCaller from '../../helpers/axios';
import {BUSINESS_CODE, CLIENT_ID, RAD_SERVER_URL} from '../../config/APIConfig';
import convertJsonToQueryString from '../../helpers/convertJsonToQueryString';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';
import refIdGenerator from '../../helpers/refIdGenerator';

export default async postData => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-getInvoiceList';
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
  const options = {
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      'Client-Id': CLIENT_ID,
      'business-code': BUSINESS_CODE,
    },
    needAccessToken: true,
  };

  return ApiCaller(options).get(
    `${RAD_SERVER_URL}api/core/invoices/user?${convertJsonToQueryString(
      postData,
    )}`,
  );
};

const responseValidation = response => {
  if (response && response.data && response.data.hasError === false) {
    return Promise.resolve(response.data.result);
  } else {
    return Promise.reject(response.data.message);
  }
};
