import ApiCaller, {ApiResponseModel} from '../../helpers/axios';
import ServicesResponseValidation from '../../modules/validation/apiResponseValidation/servicesResponseValidation';
import {BUSINESS_CODE, SERVER_URL} from '../../config/APIConfig';
import refIdGenerator from '../../helpers/refIdGenerator';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';
import {AppServerResponseModel} from '../../model/appServerResponse.model';
import convertJsonToQueryString from '../../helpers/convertJsonToQueryString';

enum IdTypeObjModel {
  CONTRACT = 1,
  DRAFT = 2,
  TEMPLATE = 3,
}

export default async (id: number, idType: number) => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-getUserProfileList';

  try {
    if (id) {
      const response = await fetchJSON(id, idType);
      const data = await responseValidation(response);
      onApiCallingSuccess({params: {}, refId, response}, caller);

      return {
        data,
        hasError: false,
        errorMessage: null,
      };
    } else {
      return Promise.resolve({
        data: [],
        hasError: false,
        errorMessage: null,
      });
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

const fetchJSON = (id: number, idType: number) => {
  const options = {
    needAccessToken: true,
    headers: {
      'business-code': BUSINESS_CODE,
      'Accept-Languag': 'fa-IR',
      accept: 'application/json',
    },
  };

  return ApiCaller(options).get(
    `${SERVER_URL}api/security/userProfile/contract/batch?${convertJsonToQueryString(
      {
        id: id,
        idType,
      },
    )}`,
  );
};

const responseValidation = (
  response: ApiResponseModel<AppServerResponseModel>,
) => {
  return ServicesResponseValidation(response);
};
