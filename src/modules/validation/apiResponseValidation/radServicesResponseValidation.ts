import {ApiResponseModel} from '../../../helpers/axios';
import {RadServerResponseModel} from '../../../model/radServerResponse.model';

export default (response: ApiResponseModel<RadServerResponseModel>) => {
  if (response && response.status >= 200 && response.status < 300) {
    if (
      response &&
      response.data &&
      !response.data.hasError &&
      response.data.result
    ) {
      return Promise.resolve(response.data.result);
    } else {
      return Promise.reject(response.data.message);
    }
  }
  return Promise.reject(response.data);
};
