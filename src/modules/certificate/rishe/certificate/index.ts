import {getCertificateListService, risheInquiryService} from '../../../../apis';
import * as Toast from '../../../../components/toastNotification/utils';

import getLoggedInUserSSOID from '../../../../helpers/getLoggedInUserSSOID';
import sleep from '../../../../helpers/sleep';
import {CertificateTypeEnum} from '../../../../model/certificateType.enum';
import {GenerateRisheServiceInputModel} from '../../../../model/generateRisheServiceInput.model';
import {InvoiceStatuses} from '../../../../model/invoiceStatus.model';
import {PairsModel} from '../../../../model/pairs.model';
import {RisheGenerateInputModel} from '../../../../model/risheGenerateInput.model';
import {ValueOf} from '../../../../model/valueof.type';
import {Logger} from '../../../log/logger';
import {NativeEncryptionModule} from '../../../nativeModules';
import certificateLogger from '../../utils/certificateLogger';
import {
  decryptCertificateData,
  encryptCertificateData,
} from '../../utils/cryption';
import {
  readCertificateFile,
  readDecodedPairsFile,
  removeCertificateFile,
  writeCertificateFile,
} from '../../utils/fileManager';
import {
  changeInvoiceStatusByBillNumber,
  closeInvoice,
  getCertificateInvoices,
  getInvoiceBillNumber,
  getInvoiceKeyId,
  getLastInvoice,
} from '../../utils/invoiceManager';
import {
  defineKeyId,
  generateByCSR,
  getByKeyId,
  getCertificates,
  getSubject,
  revokeByCertificate,
} from './service';
import debugLogger from '../../../../helpers/debugLogger';
import {Alert} from 'react-native';
import {
  removeAsyncStorage,
  setAsyncStorage,
} from '../../../../helpers/asyncStorage';
import ssoId from '../../../../apis/services/ssoId.ts';

const certificateType: ValueOf<CertificateTypeEnum> = CertificateTypeEnum.rishe;

export {
  defineKeyId as defineCertificateKeyId,
  getByKeyId as getCertificateByKeyId,
  revokeByCertificate,
};

export const generate = async (
  postData: RisheGenerateInputModel,
  userPassInput: string,
  ssoID: number,
) => {
  try {
    const {keyId} = postData;
    const pairs: PairsModel | null = await readDecodedPairsFile(
      certificateType,
    );

    if (!pairs) {
      return;
    }

    await setAsyncStorage('text', ssoID + '-password', userPassInput);
    const certificate = await generateCertificateByCSR(pairs, postData);

    if (certificate) {
      const certificateFileObjectData = {
        certificate,
        keyId,
        pairs,
      };

      const encryptedCertificateData = await encryptCertificateData(
        ssoID,
        userPassInput,
        certificateFileObjectData,
      );

      await writeCertificateFile(
        certificateType,
        encryptedCertificateData.data,
      );

      await certificateInvoiceCreatedStatus();

      await certificateLogger(
        'info',
        'certificate generated and saved in client, invoice status is file-created',
      );

      return Promise.resolve('گواهی امضا با موفقیت ساخته و ذخیره شد.');
    }
  } catch (error) {
    Logger.debugLogger('error in generate: ', error);
    await certificateLogger('error', error);
    return Promise.reject(error);
  }
};

// revoke rishe certificate
export const revoke = async (certificate: string) => {
  try {
    const revokedResponse = await revokeByCertificate(certificate);
    console.log('revokedResponse', revokedResponse);

    if (revokedResponse) {
      await removeCertificateFile(certificateType);
      await certificateLogger(
        'info',
        'certificate revoked and removed from client, invoice status is Certificate-revoked',
      );
      const successfulMessage =
        revokedResponse || 'گواهی شما با موفقیت ابطال گردید';
      Toast.showToast('success', 'ابطال گواهی', successfulMessage);
      return revokedResponse;
    }
  } catch (error) {
    Logger.debugLogger('error in revoke: ', error);
    await certificateLogger('error', error);
    await revokeCertificateErrorHandler(error);
    return Promise.reject(error);
  }
};

export const sign = async (
  password: string,
  hash: string,
  ssoID: number,
  fileNotExistCallback?: () => {},
) => {
  try {
    const certificateEncryptedContent = await readCertificateFile(
      certificateType,
    );

    if (!certificateEncryptedContent) {
      fileNotExistCallback && fileNotExistCallback();
      return Promise.reject('گواهی یافت نشد');
    }

    const certificateFileData = await decryptCertificateData(
      ssoID,
      password,
      certificateEncryptedContent,
    );

    Logger.debugLogger('certificate', certificateFileData);

    const signature = await NativeEncryptionModule.createSignatureRSA(
      certificateFileData.pairs.private,
      hash,
    );

    const userCertificate = await getByKeyId(certificateFileData.keyId);

    if (userCertificate === null) {
      fileNotExistCallback && fileNotExistCallback();
    }

    await certificateLogger(
      'info',
      'signature created by certificate in sign by certificate',
    );

    return Promise.resolve({
      signature,
      pairs: certificateFileData.pairs,
      keyId: certificateFileData.keyId,
      certificate: certificateFileData,
    });
  } catch (error) {
    await certificateLogger('error', error);
    Logger.debugLogger('error in signByRootCertificate: ', error);
    return Promise.reject(error);
  }
};

export const checkCertificateList = async () => {
  try {
    const certificates = await getCertificateListService();
    return Promise.resolve(!!certificates.data.length);
  } catch (error) {
    Logger.debugLogger('error in getDetails: ', error);
    return Promise.reject(error);
  }
};

export const getDetailsInTheWorld = async () => {
  try {
    const isCertificateExist = await readCertificateFile(certificateType);
    const invoices = await getCertificateInvoices(certificateType);
    const invoice = getLastInvoice(invoices);

    if (isCertificateExist && invoice) {
      const _keyId = getInvoiceKeyId(invoice);
      const certificateData = await getByKeyId(_keyId);
      return Promise.resolve(certificateData);
    }
    return Promise.resolve(null);
  } catch (error) {
    Logger.debugLogger('error in getDetails: ', error);
    return Promise.reject(error);
  }
};

// get rishe certificate list
export const getCertificateList = async () => {
  try {
    return await getCertificates();
  } catch (error) {
    return Promise.reject(error);
  }
};

const certificateInvoiceCreatedStatus = async () => {
  try {
    const invoices = await getCertificateInvoices(certificateType);

    const invoice = getLastInvoice(invoices);

    const billNumber = invoice && getInvoiceBillNumber(invoice);

    const response = await changeInvoiceStatusByBillNumber(
      billNumber,
      InvoiceStatuses.created,
    );

    return Promise.resolve(response);
  } catch (error) {
    Logger.debugLogger('error in certificateInvoiceCreatedStatus: ', error);
    return Promise.reject(error);
  }
};

// generate rishe certificate
const generateCertificateByCSR = async (
  pairs: PairsModel,
  params: RisheGenerateInputModel,
) => {
  try {
    const subjectData = await getSubject({...params});
    const csr = await NativeEncryptionModule.createSignCSR(
      subjectData,
      pairs.private,
      pairs.public,
    );

    Logger.debugLogger('csr: ', {
      deviceType: 'Mobile',
      csr,
      keyId: params.keyId,
    });
    const certificateResponse = await generateCertificateByCSRService({
      deviceType: 'Mobile',
      csr,
      keyId: params.keyId,
    });
    let certificate = '';
    const ssoId = await getLoggedInUserSSOID();

    await setAsyncStorage(
      'text',
      ssoId + '-requestId',
      certificateResponse.body.requestId,
    );
    await setAsyncStorage('text', ssoId + '-keyId', params.keyId);
    await setAsyncStorage('object', ssoId + '-pairs', pairs);

    while (true) {
      const response = await risheInquiry(
        params.keyId,
        certificateResponse.body.requestId,
      );
      if (response.data.certificate !== null) {
        certificate = response.data.certificate;
        await removeAsyncStorage(ssoId + '-keyId');
        await removeAsyncStorage(ssoId + '-requestId');
        await removeAsyncStorage(ssoId + '-pairs');
        await removeAsyncStorage(ssoId + '-password');
        break;
      }
      await sleep(10000);
    }
    return Promise.resolve(certificate);
  } catch (error) {
    Logger.debugLogger('error in generateCertificateByCSR: ', error);
    return Promise.reject(error);
  }
};

const generateCertificateByCSRService = async (
  postData: GenerateRisheServiceInputModel,
) => {
  try {
    const response = await generateByCSR(postData);
    return Promise.resolve(response);
  } catch (error) {
    await certificateLogger('error', error);
    return Promise.reject(generateCertificateByCSRServiceErrorHandler(error));
  }
};

// check certificate inquiry
const risheInquiry = async (keyId: string, requestId: string) => {
  try {
    const response = await risheInquiryService(keyId, requestId);
    return Promise.resolve(response);
  } catch (error) {
    Logger.debugLogger('error in certificateInquiry: ', error);
    return Promise.reject(error);
  }
};

const revokeCertificateErrorHandler = (error: any) => {
  Toast.showToast('danger', 'ابطال گواهی', 'خطا در ابطال گواهی');
  Logger.debugLogger('error in revokeCertificateErrorHandler: ', error);

  return Promise.reject(error);
};

const generateCertificateByCSRServiceErrorHandler = (error: any) => {
  let errResponse = null;

  if (error?.data?.response?.data) {
    errResponse = error?.data?.response?.data;
  } else {
    errResponse = {
      error_description:
        error?.errorMessage?.message || 'خطا در generateCertificateByCSR',
    };
  }

  const {error_description} = errResponse;

  if (error_description) {
    Toast.showToast(
      'danger',
      'گواهی ریشه',
      error_description.toString() || 'خطا در سرویس دریافت گواهی ریشه با keyId',
    );
  }

  Logger.debugLogger('error in generateRisheCertificate: ', error);
  return Promise.reject(error);
};

// check certificate file on device
export const certificateFileData = async () => {
  try {
    return await readCertificateFile(certificateType);
  } catch (error) {
    Logger.debugLogger('error in readCertificate file: ', error);
    return Promise.reject(error);
  }
};
