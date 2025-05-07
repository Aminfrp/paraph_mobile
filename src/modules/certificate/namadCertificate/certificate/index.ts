import * as Toast from '../../../../components/toastNotification/utils';

import {generateNamadCSRService} from '../../../../apis';
import getLoggedInUserSSOID from '../../../../helpers/getLoggedInUserSSOID';
import {CertificateTypeEnum} from '../../../../model/certificateType.enum';
import {GenerateNamadServiceInputModel} from '../../../../model/generateNamadServiceInput.model';
import {InvoiceStatuses} from '../../../../model/invoiceStatus.model';
import {NamadGenerateInputModel} from '../../../../model/namadGenerateInput.model';
import {PairsModel} from '../../../../model/pairs.model';
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
  getCertificateInvoices,
  getInvoiceBillNumber,
  getInvoiceKeyId,
  getLastInvoice,
} from '../../utils/invoiceManager';
import {
  defineKeyId,
  getByKeyId,
  getSubject,
  revokeAll,
  revokeByKeyId,
} from './service';

const certificateType: ValueOf<CertificateTypeEnum> = CertificateTypeEnum.namad;

export {
  defineKeyId as defineCertificateKeyId,
  getByKeyId as getCertificateByKeyId,
  revokeAll as revokeAllCertificate,
  revokeByKeyId as revokeCertificateByKeyId,
};

export const generate = async (
  postData: NamadGenerateInputModel,
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

    const certificate = await generateCertificateByCSR(pairs, postData);

    if (certificate) {
      const certificateFileObjectData = {
        ...certificate,
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

      // await certificateInvoiceCreatedStatus();

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

export const revoke = async (password: string) => {
  try {
    if (!(await isPasswordValid(password))) return;
    const invoices = await getCertificateInvoices(certificateType);
    const invoice = getLastInvoice(invoices);
    const keyId = getInvoiceKeyId(invoice);

    if (!(await isKeyIdExistInRevoke(keyId))) return;

    const certificate = await getByKeyId(keyId);

    if (!(await isCertificateExistInRevoke(certificate))) return;

    const revokedResponse = await revokeByKeyId(keyId);
    if (revokedResponse) {
      const invoiceBillNumber = invoice && getInvoiceBillNumber(invoice);
      await changeInvoiceStatusByBillNumber(
        invoiceBillNumber,
        InvoiceStatuses.revoked,
      );

      await removeCertificateFile(certificateType);

      await certificateLogger(
        'info',
        'certificate revoked and removed from client, invoice status is Certificate-revoked',
      );

      const successfulMessage =
        revokedResponse?.body?.message || 'گواهی شما با موفقیت ابطال گردید';
      Toast.showToast('success', 'ابطال گواهی', successfulMessage);
    }
  } catch (error) {
    Logger.debugLogger('error in revoke: ', error);
    await certificateLogger('error', error);
    revokeCertificateErrorHandler(error);
    return Promise.reject(error);
  }
};

export const sign = async (password: string, hash: string, ssoID: number) => {
  try {
    const certificateEncryptedContent = await readCertificateFile(
      certificateType,
    );

    if (!certificateEncryptedContent) return Promise.reject('گواهی یافت نشد');

    const certificate = await decryptCertificateData(
      ssoID,
      password,
      certificateEncryptedContent,
    );

    Logger.debugLogger('certificate', certificate);

    const signature = await NativeEncryptionModule.createSignatureRSA(
      certificate.pairs.private,
      hash,
    );

    await certificateLogger(
      'info',
      'signature created by certificate in sign by certificate',
    );

    return Promise.resolve({
      signature,
      pairs: certificate.pairs,
      keyId: certificate.keyId,
    });
  } catch (error) {
    await certificateLogger('error', error);
    Logger.debugLogger('error in signByRootCertificate: ', error);
    return Promise.reject(error);
  }
};

export const getDetails = async () => {
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

const isPasswordValid = async (password: string) => {
  try {
    const certificateEncryptedContent: string | undefined =
      await readCertificateFile(certificateType);

    if (certificateEncryptedContent) {
      const ssoID = await getLoggedInUserSSOID();
      const certificate = await decryptCertificateData(
        ssoID,
        password,
        certificateEncryptedContent,
      );
      if (certificate) {
        return Promise.resolve(true);
      }
    }

    return Promise.resolve(false);
  } catch (error) {
    await certificateLogger('error', error);
    Logger.debugLogger('error in isPasswordValid: ', error);
    return Promise.reject({error_description: 'رمز وارد شده مطابقت ندارد'});
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

const isKeyIdExistInRevoke = async (keyId: string) => {
  if (!keyId) {
    await certificateLogger(
      'error',
      'there is not any active invoice for revokeCertificate',
    );

    Toast.showToast('danger', 'خطا', 'خطا در دریافت فاکتور!');
    return Promise.resolve(false);
  }
  return Promise.resolve(true);
};

const isCertificateExistInRevoke = async (certificate: any) => {
  if (!certificate) {
    await certificateLogger(
      'error',
      'there is not any active certificate for revokeCertificate',
    );
    return Promise.resolve(false);
  }
  return Promise.resolve(true);
};

const generateCertificateByCSR = async (
  pairs: PairsModel,
  params: NamadGenerateInputModel,
) => {
  try {
    const subjectData = await getSubject({...params});
    const csr = await NativeEncryptionModule.createSignCSR(
      subjectData,
      pairs.private,
      pairs.public,
    );
    const certificate = await generateCertificateByCSRService(params.keyId, {
      csr,
      ...params,
    });

    return Promise.resolve(certificate);
  } catch (error) {
    Logger.debugLogger('error in generateCertificateByCSR: ', error);
    return Promise.reject(error);
  }
};

const generateCertificateByCSRService = async (
  keyId: string,
  postData: GenerateNamadServiceInputModel,
) => {
  try {
    const response = await generateNamadCSRService(keyId, postData);
    const data = response && response.data;
    return Promise.resolve(data);
  } catch (error) {
    await certificateLogger('error', error);
    return Promise.reject(generateCertificateByCSRServiceErrorHandler(error));
  }
};

const revokeCertificateErrorHandler = (error: any) => {
  // let errResponse = null;
  //
  // if (!error?.error_description) {
  //   if (error?.data?.response?.data) {
  //     errResponse = error?.data?.response?.data;
  //   } else {
  //     errResponse = {
  //       error_description:
  //         error?.errorMessage?.message || 'خطا در ابطال گواهی ریشه',
  //     };
  //   }
  // } else {
  //   errResponse = error;
  // }
  //
  // const {error_description} = errResponse;

  // if (error_description) {
  //   Toast.showToast(
  //     'danger',
  //     'گواهی ریشه',
  //     error_description.toString() || 'خطا در ابطال گواهی ریشه با keyId',
  //   );
  // }

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
      'گواهی نماد',
      error_description.toString() || 'خطا در سرویس دریافت گواهی نماد با keyId',
    );
  }

  Logger.debugLogger('error in generateNamadCertificate: ', error);
  return Promise.reject(error);
};
