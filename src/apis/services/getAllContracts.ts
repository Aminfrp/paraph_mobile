import ApiCaller, {ApiResponseModel} from '../../helpers/axios';
import convertJsonToQueryString from '../../helpers/convertJsonToQueryString';
import refIdGenerator from '../../helpers/refIdGenerator';
import contractPodServicesResponseValidation from '../../modules/validation/apiResponseValidation/contractPodServicesResponseValidation';
import getAllContractsPostDataValidation from '../../modules/validation/getAllContractsPostDataValidation';
import {BUSINESS_CODE, SERVER_URL} from '../../config/APIConfig';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';
import {GetContractsInputModel} from '../../model/getContractsInput.model.ts';
import {AppServerResponseModel} from '../../model/appServerResponse.model.ts';

export default async (postData: Partial<GetContractsInputModel>) => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-getAllContracts';
  try {
    const isValidPostData = await getAllContractsPostDataValidation(postData);

    if (isValidPostData) {
      const response = await fetchJSON(postData);
      const data = await responseValidation(response);
      onApiCallingSuccess({params: {}, refId, response}, caller);

      return {
        data,
        hasError: false,
        errorMessage: null,
      };
    }
  } catch (error) {
    onApiCallingError({params: {}, refId, error}, caller);

    return Promise.reject({
      data: null,
      hasError: true,
      errorMessage: error,
    });
  }
};

const fetchJSON = (postData: Partial<GetContractsInputModel>) => {
  delete postData.contactId;
  delete postData.accountOwner;

  const options = {
    headers: {
      'Content-Type': 'application/json',
      'business-code': BUSINESS_CODE,
    },
    needAccessToken: true,
  };

  return ApiCaller(options).get(
    `${SERVER_URL}api/contract/all/?${convertJsonToQueryString(postData)}`,
  );
};

const responseValidation = (
  response: ApiResponseModel<AppServerResponseModel>,
) => {
  return contractPodServicesResponseValidation(response);
};
