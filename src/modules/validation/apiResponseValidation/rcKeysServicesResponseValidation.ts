import {ApiResponseModel} from '../../../helpers/axios';
import {CertificateServerResponseModel} from '../../../model/certificateServerResponse.model';

export default (response: ApiResponseModel<CertificateServerResponseModel>) => {
  if (response && response.status >= 200 && response.status < 300) {
    if (response && response.data) {
      return Promise.resolve(response.data);
    } else {
      return Promise.reject(response.data.errorMessage);
    }
  } else {
    return Promise.reject(response.data);
  }
};
