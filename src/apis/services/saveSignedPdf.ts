import refIdGenerator from '../../helpers/refIdGenerator';
import {BUSINESS_CODE, SERVER_URL} from '../../config/APIConfig';
import {getAccessToken} from '../../helpers/utils';
import RNFetchBlob from 'rn-fetch-blob';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';
import {Logger} from '../../modules/log/logger.ts';
import {SavedSignedPdfInputModel} from '../../model/savedSignedPdfInput.model.ts';
import {logService} from '../index.ts';

export default async (postData: SavedSignedPdfInputModel) => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-saveSignedPdf';
  try {
    const {signerId, ...params} = postData;
    const response = await fetchJSON(signerId, params);
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

const fetchJSON = async (signerId: number, params: any) => {
  try {
    const accessToken = await getAccessToken();
    const multipartParams = [
      {
        ...params.file,
        name: 'file',
        type: 'application/pdf',
      },
    ];
    const code = BUSINESS_CODE.toString();
    await logService('info', `CALL_SAVE_SIGNED_PDF`);

    const response = await RNFetchBlob.fetch(
      'post',
      `${SERVER_URL}api/contract/${signerId}/save-signed-pdf?keyId=${params.keyId}&certType=${params.certType}`,
      {
        'Content-Type': 'multipart/form-data',
        'access-token': accessToken,
        'business-code': code,
      },
      multipartParams,
    )
      .uploadProgress((written, total) => {
        Logger.debugLogger('uploaded', written / total);
      })
      .then(resp => {
        Logger.debugLogger('upload response', resp);
        return resp.data;
      })
      .catch(err => {
        Logger.debugLogger('error in uploadFileService: ', err);
        return err;
      });

    if (response) {
      return Promise.resolve(response.result);
    }
    return Promise.reject({errorMessage: 'خطا در دخیره pdf'});
  } catch (error) {
    return Promise.reject(error);
  }
};
