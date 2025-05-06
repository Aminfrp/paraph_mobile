import ApiCaller, {ApiResponseModel} from '../../helpers/axios';
import {BUSINESS_CODE, CLIENT_ID, SERVER_URL} from '../../config/APIConfig';
import contractPodServicesResponseValidation from '../../modules/validation/apiResponseValidation/contractPodServicesResponseValidation';
import refIdGenerator from '../../helpers/refIdGenerator';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';
import {ValueOf} from '../../model/valueof.type.ts';
import {InvoiceStatuses} from '../../model/invoiceStatus.model.ts';
import {AppServerResponseModel} from '../../model/appServerResponse.model.ts';

type PostDataModel = {
  billNumber: number;
  status: ValueOf<InvoiceStatuses>;
};

export default async (postData: PostDataModel) => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-changeInvoiceStatus';
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

const fetchJSON = (postData: PostDataModel) => {
  const options = {
    headers: {
      accept: 'application/json',
      'Client-Id': CLIENT_ID,
      'business-code': BUSINESS_CODE,
    },
    needAccessToken: true,
  };

  return ApiCaller(options).post(
    `${SERVER_URL}api/security/updateInvoice`,
    postData,
  );
};

const responseValidation = (
  response: ApiResponseModel<AppServerResponseModel>,
) => {
  return contractPodServicesResponseValidation(response);
};
