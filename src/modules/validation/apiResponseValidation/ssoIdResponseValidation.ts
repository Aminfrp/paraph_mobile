import {ApiResponseModel} from '../../../helpers/axios.ts';
import {SsoServerResponseModel} from '../../../model/ssoServerResponse.model.ts';

export default (response: ApiResponseModel<SsoServerResponseModel>) => {
  if (response && response.status >= 200 && response.status < 300) {
    if (response) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  }
  return Promise.reject(response);
};
