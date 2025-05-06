import {
  getNamadCertificateService,
  getNamadSubjectService,
  rcDefineService,
  revokeAllNamadCertificatesService,
  revokeNamadService,
} from '../../../../apis';
import {InvoiceModel} from '../../../../model/invoice.model';
import {NamadGenerateInputModel} from '../../../../model/namadGenerateInput.model';
import {PairsModel} from '../../../../model/pairs.model';
import {Logger} from '../../../log/logger';
import {InvoiceStatuses} from '../../../../model/invoiceStatus.model';
import {changeInvoiceStatusByBillNumber} from '../../utils/invoiceManager';
import {NativeEncryptionModule} from '../../../nativeModules';

export const defineKeyId = async () => {
  try {
    const rsaKeyPair: PairsModel = await NativeEncryptionModule.getRSAKeyPairs(
      2048,
    );
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

export const getByKeyId = async (keyId: string) => {
  try {
    const response = await getNamadCertificateService();
    const data =
      response &&
      response.data &&
      response.data.body &&
      response.data.body.results;

    if (data && data.length > 0) {
      const activate: string = data.find(
        (i: {certificate: string; keyId: string}) => i.keyId === keyId,
      );

      if (activate) {
        return Promise.resolve(activate);
      } else {
        return Promise.resolve(null);
      }
    }

    return Promise.resolve(null);
  } catch (error) {
    Logger.debugLogger('error in getByKeyId: ', error);
    return Promise.resolve(null);
  }
};

export const revokeAll = async (lastInvoice: InvoiceModel) => {
  try {
    const response = await revokeAllNamadCertificatesService();

    const data = response && response.data;

    if (data) {
      await changeInvoiceStatusByBillNumber(
        lastInvoice?.metadata?.billNumber,
        InvoiceStatuses.revoked,
      );
    }

    return Promise.resolve(data);
  } catch (error) {
    Logger.debugLogger('error in revokeAll: ', error);
    return Promise.resolve(error);
  }
};

export const revokeByKeyId = async (keyId: string) => {
  try {
    const response = await revokeNamadService(keyId);
    const data = response && response.data;

    return Promise.resolve(data);
  } catch (error) {
    Logger.debugLogger('error in revokeByKeyId: ', error);
    return Promise.reject(error);
  }
};

export const getSubject = async (postData: NamadGenerateInputModel) => {
  try {
    const {keyId, ...params} = postData;
    const response = await getNamadSubjectService(keyId, params);
    const csrSubject = response && response.data.body.csrSubject;
    return Promise.resolve(csrSubject);
  } catch (error) {
    Logger.debugLogger('getSubject: ', error);
    return Promise.reject(error);
  }
};
