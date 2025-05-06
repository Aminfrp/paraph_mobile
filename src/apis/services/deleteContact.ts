import ApiCaller, {ApiResponseModel} from '../../helpers/axios';
import {BUSINESS_CODE, SERVER_URL} from '../../config/APIConfig';
import loadContactServicesResponseValidation from '../../modules/validation/apiResponseValidation/loadContactServicesResponseValidation';
import refIdGenerator from '../../helpers/refIdGenerator';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';
import {ContactModel} from '../../model/contact.model';
import {AppServerResponseModel} from '../../model/appServerResponse.model';

export default async (dataRaw: ContactModel[]) => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-deleteContact';
  try {
    const response = await fetchJSON(dataRaw);
    const data = await responseValidation(response);

    onApiCallingSuccess({params: {}, refId, response}, caller);

    const statusCode = response.data.statusCode;

    return {
      data,
      hasError: false,
      errorMessage: null,
      statusCode,
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

const fetchJSON = (dataRaw: ContactModel[]) => {
  const options = {
    headers: {
      'business-code': BUSINESS_CODE,
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
    needAccessToken: true,
  };

  let restUrl = '?';
  for (let i = 0; i < dataRaw.length; i++) {
    if (i === 0) {
      restUrl += `ssoid=${dataRaw[i].id}`;
    } else {
      restUrl += `&ssoid=${dataRaw[i].id}`;
    }
  }

  return ApiCaller(options).delete(`${SERVER_URL}api/contact/${restUrl}`);
};

const responseValidation = (
  response: ApiResponseModel<AppServerResponseModel>,
) => {
  return loadContactServicesResponseValidation(response);
};
