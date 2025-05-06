import ApiCaller, {ApiResponseModel} from '../../helpers/axios';
import ServicesResponseValidation from '../../modules/validation/apiResponseValidation/servicesResponseValidation';
import {BUSINESS_CODE, SERVER_URL} from '../../config/APIConfig';
import refIdGenerator from '../../helpers/refIdGenerator';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';
import {AppServerResponseModel} from '../../model/appServerResponse.model';

type SSOIDModel = {
  value: number;
  index: number;
};

export default async (id: SSOIDModel[], idType: number) => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-getInitiatorListByContractId';

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

const fetchJSON = (ids: SSOIDModel[], idType: number) => {
  const options = {
    needAccessToken: true,
    headers: {
      'business-code': BUSINESS_CODE,
      'Accept-Languag': 'fa-IR',
      accept: 'application/json',
    },
  };

  const last = ids[ids.length - 1];

  let str = '';

  for (let el of ids) {
    if (el.index !== last.index) {
      str += 'ids=' + el.value + '&';
    } else {
      str += 'ids=' + el.value;
    }
  }

  str += '&idType=' + idType;

  return ApiCaller(options).get(
    `${SERVER_URL}api/security/userProfile/contract/initiator/batch?${str}`,
  );
};

const responseValidation = (
  response: ApiResponseModel<AppServerResponseModel>,
) => {
  return ServicesResponseValidation(response);
};
