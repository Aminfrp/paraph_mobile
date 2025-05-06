import ApiCaller, {ApiResponseModel} from '../../helpers/axios';
import {BUSINESS_CODE, CLIENT_ID, SERVER_URL} from '../../config/APIConfig';
import convertJsonToQueryString from '../../helpers/convertJsonToQueryString';
import refIdGenerator from '../../helpers/refIdGenerator';
import {GetInvoiceListInputModel} from '../../model/getInvoiceListInput.model';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';
import {AppServerResponseModel} from '../../model/appServerResponse.model';
import ServicesResponseValidation from '../../modules/validation/apiResponseValidation/servicesResponseValidation';

/**
 *
 * @param postData:
 * {
    fromDate,
    toDate,
    offset: startN,
    size: lengthN,
    customerInvoice: boolean,
    field: string,
    is: string,
    or/and: urlEncoded => i.e: [{
      "field": "DeviceType",
      "is": "Desktop"
    }];
  };
 * @returns {Promise<{data: never, errorMessage: null, hasError: boolean}>}
 */
export default async (postData: GetInvoiceListInputModel) => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-getInvoiceList-metadata';

  try {
    const response = await fetchJSON(postData);
    onApiCallingSuccess({params: {postData}, refId, response}, caller);

    const data = await responseValidation(response);
    return {
      data,
      hasError: false,
      errorMessage: null,
    };
  } catch (error) {
    onApiCallingError({params: {postData}, refId, error}, caller);
    return Promise.reject({
      data: null,
      hasError: true,
      errorMessage: error,
    });
  }
};

const fetchJSON = (postData: GetInvoiceListInputModel) => {
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
    `${SERVER_URL}api/security/invoices/user?${convertJsonToQueryString(
      postData,
    )}`,
  );
};

const responseValidation = (
  response: ApiResponseModel<AppServerResponseModel>,
) => {
  return ServicesResponseValidation(response);
};

/**
 * EXAMPLE OF POST_DATA
 *
 const now = new Date();

 const fromDate = `${now.getFullYear() - 2}/01/01 00:00:00`;
 const toDate = `${now.getFullYear() + 2}/01/01 00:00:00`;

 const postData = {
    fromDate,
    toDate,
    offset: startN,
    size: lengthN,
    customerInvoice: boolean,
    const field: string,
    const is: string,
    const or/and: urlEncoded => i.e: [{
      "field": "DeviceType",
      "is": "Desktop"
    }];
  };
 */
