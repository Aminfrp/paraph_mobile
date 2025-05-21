import ApiCaller, {ApiResponseModel} from '../../helpers/axios';
import {CLIENT_ID, RAD_SERVER_URL} from '../../config/APIConfig';
import refIdGenerator from '../../helpers/refIdGenerator';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';
import {AppServerResponseModel} from '../../model/appServerResponse.model';
import {RadServerResponseModel} from '../../model/radServerResponse.model';

export default async (billNumber: string) => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-closeInvoice';
  try {
    const response = await fetchJSON(billNumber);
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

const fetchJSON = (postData: string) => {
  const options = {
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      'Client-Id': CLIENT_ID,
    },
    data: postData,
    needAccessToken: true,
  };

  return ApiCaller(options).post(`${RAD_SERVER_URL}/api/core/invoices/close`);
};

const responseValidation = (
  response: ApiResponseModel<RadServerResponseModel>,
) => {
  if (response && response.data && response.data.hasError === false) {
    return Promise.resolve(response.data.result);
  } else {
    return Promise.reject(response.data.message);
  }
};
