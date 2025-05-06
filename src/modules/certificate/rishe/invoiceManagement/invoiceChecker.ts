import * as Toast from '../../../../components/toastNotification/utils';
import * as routesName from '../../../../constants/routesName';
import {navigate} from '../../../../navigation/navigationRoot';
import {Logger} from '../../../log/logger';
import {defineCertificateKeyId, getCertificateByKeyId} from '../certificate';

import {CertificateTypeEnum} from '../../../../model/certificateType.enum';
import {InvoiceStatuses} from '../../../../model/invoiceStatus.model';

import {
  RISHE_PRODUCT_INVOICE_ID,
  RISHE_PRODUCT_INVOICE_KEY,
} from '../../../../config/APIConfig';
import certificateLogger from '../../utils/certificateLogger';
import {
  readCertificateFile,
  readDecodedPairsFile,
  removeCertificateFile,
} from '../../utils/fileManager';
import {
  changeInvoiceStatusByBillNumber,
  generateCertificateInvoice,
  getCertificateInvoices,
  getCustomerInvoiceId,
  getInvoiceKeyId,
  getInvoiceStates,
  getInvoiceStatus,
} from '../../utils/invoiceManager';

const certificateType: CertificateTypeEnum.rishe = CertificateTypeEnum.rishe;

export const checkInvoice = async () => {
  try {
    const invoices = await getCertificateInvoices(certificateType);
    // const SystemInvoices = await getCertificateInvoices(certificateType, false);
    // const deviceInvoice = deviceInvoices && deviceInvoices[0];
    // const systemInvoice = SystemInvoices && SystemInvoices[0];

    if (
      invoices.length &&
      getInvoiceStatus(invoices[0]) === InvoiceStatuses.created
    ) {
      await changeInvoiceStatusByBillNumber(
        invoices[0]?.metadata?.billNumber,
        InvoiceStatuses.revoked,
      );
    }

    if (!invoices[0]) {
      await certificateLogger(
        'info',
        'user has not any factor on this clients, generate new invoice',
      );
      return await newInvoice();
    }

    const {payed, canceled, revoked, active} = getInvoiceStates(invoices[0]);

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

    const _keyId = getInvoiceKeyId(invoices[0]);
    const customerInvoiceId = getCustomerInvoiceId(invoices[0]);

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
      .catch(error => {});

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

    navigate(routesName.RISHE_CERTIFICATE_GENERATE, {
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
      productInvoiceId: RISHE_PRODUCT_INVOICE_ID,
      productInvoiceKey: RISHE_PRODUCT_INVOICE_KEY,
    };

    await generateCertificateInvoice(
      keyId,
      rsaKeyPair,
      certificateType,
      invoiceParams,
    );
  } catch (error) {}
};
