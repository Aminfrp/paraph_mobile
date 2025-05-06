import {
  getCertificateListService,
  rcDefineService,
  rcGenerateService,
  rcGetKeysService,
  rcKeysService,
  rcRevokeByCertificateService,
  rcSubjectService,
} from '../../../../apis';
import * as Toast from '../../../../components/toastNotification/utils';
import {RisheGenerateInputModel} from '../../../../model/risheGenerateInput.model';
import {Logger} from '../../../log/logger';
import {NativeEncryptionModule} from '../../../nativeModules';

export const defineKeyId = async () => {
  try {
    const rsaKeyPair = await NativeEncryptionModule.getRSAKeyPairs();
    const defineCertificateResponse = await rcDefineService({
      // privateKey: rsaKeyPair.private,
      publicKey: rsaKeyPair.public,
    });
    const keyId =
      defineCertificateResponse &&
      defineCertificateResponse.data &&
      defineCertificateResponse.data.keyId;

    return Promise.resolve({
      keyId,
      rsaKeyPair,
    });
  } catch (error) {
    Logger.debugLogger('error in defineKeyId: ', error);
    return Promise.reject(error);
  }
};

export const getCertificates = async () => {
  try {
    const response = await getCertificateListService();
    const data = response && response.data;
    return data;
  } catch (error) {
    return Promise.resolve(error);
  }
};

export const getByKeyId = async (keyId: string) => {
  try {
    const response = await rcGetKeysService(keyId);
    const data = response && response.data;
    ;

    return Promise.resolve(data);
  } catch (error) {
    Logger.debugLogger('error in getByKeyId: ', error);
    return Promise.resolve(null);
  }
};

export const revokeByCertificate = async (certificate: string) => {
  try {
    ;

    const response = await rcRevokeByCertificateService(certificate);
    const data = response && response.data;

    return Promise.resolve(data);
  } catch (error) {
    Logger.debugLogger('error in revokeByCertificate: ', error);
    return Promise.reject(error);
  }
};

export const postKeyId = async (
  keyId: string,
  postData: RisheGenerateInputModel,
) => {
  try {
    const response = await rcKeysService(keyId, postData);
    const data = response && response.data;

    return Promise.resolve(data);
  } catch (error: any) {
    let errResponse = null;

    if (error?.data?.response?.data) {
      errResponse = error?.data?.response?.data;
    } else {
      errResponse = {
        error_description:
          error?.errorMessage?.message || 'خطا در rcKeysService',
      };
    }

    const {error_description} = errResponse;

    if (error_description) {
      Toast.showToast(
        'danger',
        'گواهی ریشه',
        error_description.toString() ||
          'خطا در سرویس دریافت گواهی ریشه با keyId',
      );
    }

    Logger.debugLogger('error in postKeyId: ', error);
    return Promise.reject(error);
  }
};

export const getSubject = async (postData: RisheGenerateInputModel) => {
  try {
    const {keyId, ...params} = postData;
    const response: any = await rcSubjectService(keyId, params);
    const csrSubject = response && response.data.csrSubject;
    return Promise.resolve(csrSubject);
  } catch (error) {
    Logger.debugLogger('getSubject: ', error);
    return Promise.reject(error);
  }
};

export const generateByCSR = async (postData: RisheGenerateInputModel) => {
  try {
    const {keyId, ...params} = postData;
    const response = await rcGenerateService(keyId, params);
    const data = response && response.data;
    return Promise.resolve(data);
  } catch (error) {
    Logger.debugLogger('generateByCSR: ', error);
    return Promise.reject(error);
  }
};
