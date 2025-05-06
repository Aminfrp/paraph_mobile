import {ApiResponseModel} from '../../../helpers/axios';
import {ParaphResponseModel} from '../../../model/paraphResponse.model';

export default <T>(response: ApiResponseModel<ParaphResponseModel<T>>) => {
  if (response && response.status >= 200 && response.status < 300) {
    if (
      response &&
      response.data &&
      response.data.errorMessage === null &&
      response.data.body
    ) {
      return Promise.resolve(response.data.body);
    }
  } else {
    return Promise.reject(response.statusText);
  }
};
