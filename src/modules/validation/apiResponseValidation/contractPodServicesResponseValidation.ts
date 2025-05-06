import {ApiResponseModel} from '../../../helpers/axios.ts';
import {AppServerResponseModel} from '../../../model/appServerResponse.model.ts';

export default (response: ApiResponseModel<AppServerResponseModel>) => {
  if (response && response.status >= 200 && response.status < 300) {
    if (
      response &&
      response.data &&
      response.data.statusCode === 'OK' &&
      response.data.errorMessage === null &&
      response.data.body
    ) {
      return Promise.resolve(response.data.body);
    } else if (
      response &&
      response.data &&
      response.data.statusCode === 'ACCEPTED'
    ) {
      return Promise.resolve(response.data.body);
    } else {
      return Promise.reject(response.data.errorMessage);
    }
  } else {
    return Promise.reject(response.data);
  }
};
