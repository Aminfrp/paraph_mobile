import refIdGenerator from '../../helpers/refIdGenerator';
import {
  BUSINESS_CODE,
  POD_SPACE_UPLOAD_FILE_LINK,
} from '../../config/APIConfig';
import {getAccessToken} from '../../helpers/utils';
import RNFetchBlob from 'rn-fetch-blob';
import debugLogger from '../../helpers/debugLogger';
import {decode as atob} from 'base-64';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';

export default async ({postData, fileName, uploadHash}) => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-uploadFile';
  try {
    const accessToken = await getAccessToken();
    const response = await fetchJSON({
      postData,
      fileName,
      uploadHash,
      accessToken,
    });
    onApiCallingSuccess({params: {}, refId, response}, caller);

    return {
      data: response,
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

const fetchJSON = async ({postData, fileName, uploadHash, accessToken}) => {
  try {
    const multipartParams = [postData];
    const code = BUSINESS_CODE.toString();
    const response = await RNFetchBlob.fetch(
      'post',
      `${POD_SPACE_UPLOAD_FILE_LINK}${uploadHash}`,
      {
        'Content-Type': 'multipart/form-data',
        'access-token': accessToken,
        'business-code': code,
      },
      multipartParams,
    )
      .uploadProgress((written, total) => {
        debugLogger('uploaded', written / total);
      })
      .then(resp => {
        debugLogger('upload response', resp);

        return getResponseData(resp.data);
      })
      .catch(err => {
        debugLogger('error in uploadFileService: ', err);
        return err;
      });

    if (response) {
      return Promise.resolve(response.result);
    }
    return Promise.reject({errorMessage: 'خطا در آپلود در پاداسپیس'});
  } catch (error) {
    return Promise.reject(error);
  }
};

const getResponseData = stringResponse => {
  try {
    const decodeData = atob(stringResponse);
    return JSON.parse(decodeData);
  } catch (error) {
    return JSON.parse(stringResponse);
  }
};
