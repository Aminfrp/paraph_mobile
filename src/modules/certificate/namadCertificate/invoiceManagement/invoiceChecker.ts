import {
  defineCertificateKeyId,
  getCertificateByKeyId,
  revokeAllCertificate,
} from '../certificate';
import {navigate} from '../../../../navigation/navigationRoot';
import * as routesName from '../../../../constants/routesName';
import * as Toast from '../../../../components/toastNotification/utils';
import {Logger} from '../../../log/logger';

import {InvoiceStatuses} from '../../../../model/invoiceStatus.model';
import {CertificateTypeEnum} from '../../../../model/certificateType.enum';

import {
  readCertificateFile,
  readDecodedPairsFile,
  removeCertificateFile,
} from '../../utils/fileManager';
import certificateLogger from '../../utils/certificateLogger';
import {
  generateCertificateInvoice,
  getCertificateInvoices,
  getCustomerInvoiceId,
  getInvoiceKeyId,
  getInvoiceStates,
  getInvoiceStatus,
} from '../../utils/invoiceManager';
import {
  NAMAD_PRODUCT_INVOICE_ID,
  NAMAD_PRODUCT_INVOICE_KEY,
} from '../../../../config/APIConfig';

const certificateType: CertificateTypeEnum.namad = CertificateTypeEnum.namad;

export const checkInvoice = async () => {
  try {
    const deviceInvoices = await getCertificateInvoices(certificateType, true);
    const SystemInvoices = await getCertificateInvoices(certificateType, false);
    const deviceInvoice = deviceInvoices && deviceInvoices[0];
    const systemInvoice = SystemInvoices && SystemInvoices[0];

    if (!deviceInvoice) {
      await certificateLogger(
        'info',
        'user has not any factor on this clients, generate new invoice',
      );
      return await newInvoice();
    }

    const {payed, canceled, revoked, active} = getInvoiceStates(deviceInvoice);

    if (active) {
      await certificateLogger(
        'info',
        'last client invoice is "file-created status", generate new invoice',
      );
      return await newInvoice();
    }

    if (canceled) {
      await certificateLogger(
        'info',
        'last client invoice is canceled, generate new invoice',
      );
      return await newInvoice();
    }

    if (revoked) {
      await certificateLogger(
        'info',
        'last client invoice is "Certificate-revoked status", generate new invoice',
      );
      return await newInvoice();
    }

    const _keyId = getInvoiceKeyId(deviceInvoice);
    const customerInvoiceId = getCustomerInvoiceId(deviceInvoice);

    if (!payed) {
      await certificateLogger(
        'info',
        'last client invoice is not payed, generate new invoice',
      );
      return await newInvoice();
    }

    const isCertificate = await getCertificateByKeyId(_keyId);

    if (isCertificate) {
      await certificateLogger(
        'info',
        'user has active certificate by keyId, generate new invoice',
      );
      return await newInvoice();
    }

    const certificateFile = await readCertificateFile(certificateType)
      .then(certificate => certificate)
      .catch(null);

    if (certificateFile) {
      await certificateLogger(
        'info',
        'exist certificate file in device, generate new invoice',
      );
      await removeCertificateFile(certificateType);
      return await newInvoice();
    }

    const pairs = await readDecodedPairsFile(certificateType);

    if (!pairs) {
      await certificateLogger(
        'info',
        'not exist keyPairs file, generate new invoice',
      );
      return await newInvoice();
    }

    if (
      systemInvoice &&
      getInvoiceStatus(systemInvoice) === InvoiceStatuses.created
    ) {
      await revokeAllCertificate(systemInvoice);
    }

    navigate(routesName.NAMAD_CERTIFICATE_GENERATE, {
      invoiceId: customerInvoiceId,
      customerInvoiceId: customerInvoiceId,
      keyId: _keyId,
    });
  } catch (error: any) {
    Logger.debugLogger('error in checkInvoice: ', error);
    Toast.showToast(
      'danger',
      'checkInvoice',
      error?.errorMessage.toString() || 'خطا در checkInvoice',
    );
    return Promise.reject(error);
  }
};

const newInvoice = async () => {
  try {
    const {keyId, rsaKeyPair} = await defineCertificateKeyId();

    const invoiceParams = {
      productInvoiceId: NAMAD_PRODUCT_INVOICE_ID,
      productInvoiceKey: NAMAD_PRODUCT_INVOICE_KEY,
    };

    await generateCertificateInvoice(
      keyId,
      rsaKeyPair,
      certificateType,
      invoiceParams,
    );
  } catch (error) {}
};
