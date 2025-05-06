import ApiCaller, {ApiResponseModel} from '../../helpers/axios';
import convertJsonToQueryString from '../../helpers/convertJsonToQueryString';
import {BUSINESS_CODE, SERVER_URL} from '../../config/APIConfig';
import loadContactServicesResponseValidation from '../../modules/validation/apiResponseValidation/loadContactServicesResponseValidation';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';
import refIdGenerator from '../../helpers/refIdGenerator';
import {ContactFilterModel} from '../../model/contactFilter.model';
import {AppServerResponseModel} from '../../model/appServerResponse.model';
import {ContactModel} from '../../model/contact.model';

export default async (postData: Partial<ContactFilterModel>) => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-loadContact';
  try {
    const response = await fetchJSON(postData);
    const unNormalizedData = await responseValidation(response);
    const countData = response.data.body.total;

    const contacts = unNormalizedData?.body?.contacts.map((x: ContactModel) =>
      x.contactSSoId
        ? {
            ...x,
            uniqueId: x.contactSSoId,
            id: x.contactSSoId,
            ssoId: x.contactSSoId,
          }
        : x,
    );

    onApiCallingSuccess({params: {}, refId, response}, caller);

    return {
      data: contacts,
      countData,
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

const fetchJSON = (postData: Partial<ContactFilterModel>) => {
  const options = {
    headers: {
      'business-code': BUSINESS_CODE,
      accept: 'application/json',
    },
    needAccessToken: true,
  };

  return ApiCaller(options).get(
    `${SERVER_URL}api/contact/all?${convertJsonToQueryString(postData)}`,
  );
};

const responseValidation = (
  response: ApiResponseModel<AppServerResponseModel>,
) => {
  return loadContactServicesResponseValidation(response);
};
