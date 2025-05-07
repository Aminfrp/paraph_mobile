import {
  changeInvoiceStatusService,
  getAllInvoiceListService,
  invoiceKeySignatureService,
  invoiceWithMetadataService,
} from '../../../apis';
import {
  CLIENT_ID,
  PAYMENT_GATEWAY_CALLBACK_URL,
  PAYMENT_GATEWAY_URL,
} from '../../../config/APIConfig';
import convertJsonToQueryString from '../../../helpers/convertJsonToQueryString';
import {getDeviceUniqueId} from '../../../helpers/deviceInfo';
import getLoggedInUserSSOID from '../../../helpers/getLoggedInUserSSOID';
import loadBrowserLink from '../../../helpers/loadBrowserLink';
import refreshTokenHandler from '../../../helpers/refreshTokenHandler';
import {getAccessToken} from '../../../helpers/utils';
import {CertificateTypeEnum} from '../../../model/certificateType.enum';
import {GenerateInvoiceProductPramsModel} from '../../../model/generateInvoiceProductPrams.model';
import {GetInvoiceListInputModel} from '../../../model/getInvoiceListInput.model';
import {InvoiceModel} from '../../../model/invoice.model';
import {InvoiceStatuses} from '../../../model/invoiceStatus.model';
import {PairsModel} from '../../../model/pairs.model';
import {ValueOf} from '../../../model/valueof.type';
import {Logger} from '../../log/logger';
import {saveRSAKeyPairsFile} from './fileManager';

export const getInvoiceStatus = (invoice: InvoiceModel): string =>
  invoice.metadata.orderStatus.uniqueId;

export const getInvoiceKeyId = (invoice: InvoiceModel | undefined): string => {
  if (invoice) {
    return invoice?.metadata?.clientMetadata[0]?.keyIdResponse;
  }
  return '';
};

export const getInvoiceBillNumber = (invoice: InvoiceModel) =>
  invoice?.metadata?.billNumber;

export const getCustomerInvoiceId = (invoice: InvoiceModel) =>
  invoice && invoice?.id;

export const getInvoiceStates = (lastInvoice: InvoiceModel) => ({
  payed: isInvoicePayed(lastInvoice),
  canceled: isInvoiceCancelled(lastInvoice),
  revoked: isInvoiceRevoked(lastInvoice),
  active: isInvoiceActive(lastInvoice),
});

export const getInvoiceId = (lastInvoice: InvoiceModel) => lastInvoice.id;

export const isInvoicePayed = (lastInvoice: InvoiceModel) => lastInvoice.payed;

export const isInvoiceCancelled = (lastInvoice: InvoiceModel) =>
  lastInvoice.canceled;

export const isInvoiceRevoked = (lastInvoice: InvoiceModel) =>
  lastInvoice.metadata.orderStatus
    ? lastInvoice.metadata.orderStatus.uniqueId === InvoiceStatuses.revoked
    : false;

export const isInvoiceActive = (lastInvoice: InvoiceModel) =>
  lastInvoice.metadata.orderStatus
    ? lastInvoice.metadata.orderStatus.uniqueId === InvoiceStatuses.created
    : false;

export const getCertificateInvoices = async (
  type: ValueOf<CertificateTypeEnum>,
): Promise<InvoiceModel[]> => {
  try {
    const now = new Date();
    const fromDate = `${now.getFullYear() - 2}/01/01 00:00:00`;
    const toDate = `${now.getFullYear() + 2}/01/01 00:00:00`;

    const postData: GetInvoiceListInputModel = {
      fromDate,
      toDate,
      offset: 0,
      size: 1,
      customerInvoice: false,
      field: 'certificateType',
      is: type.toString(),
      certificateType: type.toString(),
    };

    const response = await getAllInvoiceListService(postData);
    const data = response && response.data && response.data.result;

    return Promise.resolve(data);
  } catch (error) {
    Logger.debugLogger('error in getCertificateInvoices: ', error);
    return Promise.reject(error);
  }
};

export const getLastInvoice = (invoices: InvoiceModel[]) => invoices[0] || null;

export const loadWebPayment = (url: string) => loadBrowserLink(url);

export const generatePaymentUrlByInvoice = async (invoice: InvoiceModel) => {
  try {
    const signature = await invoiceKeySignatureService(CLIENT_ID);
    const accessToken = await getAccessToken();

    const paymentQueryParams = {
      invoiceId: invoice?.customerInvoiceId,
      access_token: accessToken,
      key_id: signature?.data?.keyId,
      timestamp: signature?.data?.timestamp,
      signature: signature?.data?.signature,
      redirectUri: PAYMENT_GATEWAY_CALLBACK_URL,
      gateway: 'LOC',
    };

    let URL = `${PAYMENT_GATEWAY_URL}?${convertJsonToQueryString(
      paymentQueryParams,
    )}`;
    return Promise.resolve(URL);
  } catch (error) {
    Logger.debugLogger('error in generatePaymentUrlByInvoice: ', error);
    return Promise.reject(error);
  }
};

export const generateInvoice = async (
  keyId: string,
  certificateType: CertificateTypeEnum.rishe | CertificateTypeEnum.namad,
  invoiceParams: GenerateInvoiceProductPramsModel,
) => {
  try {
    const ssoID = await getLoggedInUserSSOID();
    const deviceId = await getDeviceUniqueId();
    const invoiceDescription = ssoID + '-' + deviceId + '-' + keyId;

    const invoiceResponse = await invoiceWithMetadataService(
      invoiceParams.productInvoiceKey,
      {
        quantities: 1,
        invoiceInfo: {
          version: 1,
          certificateType: certificateType,
          deviceType: 'mobile',
          ssoId: ssoID,
          macId: deviceId,
          keyIdResponse: keyId,
        },
        keyId: keyId,
        products: invoiceParams.productInvoiceId,
        descriptions: invoiceDescription,
        customerInvoiceId: true,
        customerDescription: '',
      },
    );

    const invoice =
      invoiceResponse && invoiceResponse.data && invoiceResponse.data.result;

    await refreshTokenHandler(); // to be sure user has valid access_token...

    const paymentUrl = await generatePaymentUrlByInvoice(invoice);

    Logger.debugLogger('paymentUrl', paymentUrl);

    return Promise.resolve(paymentUrl);
  } catch (error) {
    Logger.debugLogger('error in generateInvoice: ', error);
    return Promise.reject(error);
  }
};

export const generateCertificateInvoice = async (
  keyId: string,
  rsaKeyPair: PairsModel,
  certificateType: CertificateTypeEnum.rishe | CertificateTypeEnum.namad,
  invoiceParams: GenerateInvoiceProductPramsModel,
) => {
  try {
    const invoiceUrl = await generateInvoice(
      keyId,
      certificateType,
      invoiceParams,
    );

    await saveRSAKeyPairsFile(rsaKeyPair, certificateType);

    Logger.debugLogger(invoiceUrl);

    loadWebPayment(invoiceUrl);
  } catch (error) {
    Logger.debugLogger('error in generateCertificateInvoice: ', error);
    return Promise.reject(error);
  }
};

export const changeInvoiceStatusByBillNumber = async (
  billNumber: number,
  status: ValueOf<InvoiceStatuses>,
) => {
  try {
    const response = await changeInvoiceStatusService({billNumber, status});
    const data = response && response.data;
    return Promise.resolve(data);
  } catch (error) {
    Logger.debugLogger('error in changeInvoiceStatusByBillNumber: ', error);
    return Promise.reject(error);
  }
};
