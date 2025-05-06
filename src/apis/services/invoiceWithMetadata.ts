import ApiCaller, {ApiResponseModel} from '../../helpers/axios';
import {BUSINESS_CODE, SERVER_URL} from '../../config/APIConfig';
import refIdGenerator from '../../helpers/refIdGenerator';
import {AppServerResponseModel} from '../../model/appServerResponse.model';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';
import {PostInvoiceInputModel} from '../../model/postInvoiceInput.model';
import ServicesResponseValidation from '../../modules/validation/apiResponseValidation/servicesResponseValidation';

/**
 * @param invoiceId
 * @param dataRaw
 * products
 * quantities
 * keyId
 * invoiceInfo: {version: 1, certificateType, deviceType, ssoId, macId, keyIdResponse}
 * @returns {Promise<{data: *, errorMessage: null, hasError: boolean}>}
 */
export default async (invoiceId: string, dataRaw: PostInvoiceInputModel) => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-invoice-metadata';

  try {
    const params = JSON.stringify({
      products: [dataRaw?.products],
      quantities: [dataRaw?.quantities],
      // descriptions: [dataRaw?.keyId],
      customerDescription: dataRaw?.keyId,
      descriptions: [dataRaw?.descriptions],
      paymentType: 'ipg',
      billNumber: '',
      guildCode: 'LEGAL_GUILD',
      description: '',
      currencyCode: 'IRR',
      voucherHashs: [],
      clientMetadata: [dataRaw?.invoiceInfo],
    });

    const response = await fetchJSON(invoiceId, params);
    onApiCallingSuccess(
      {params: {invoiceId, dataRaw}, refId, response},
      caller,
    );

    const data = await responseValidation(response);
    return {
      data,
      hasError: false,
      errorMessage: null,
    };
  } catch (err) {
    onApiCallingError({params: {invoiceId, dataRaw}, refId, err}, caller);

    return Promise.reject({
      data: null,
      hasError: true,
      errorMessage: err,
    });
  }
};

const fetchJSON = (invoiceId: string, postData: any) => {
  const options = {
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      'business-code': BUSINESS_CODE,
    },
    data: postData,
    needAccessToken: true,
  };

  return ApiCaller(options).post(
    `${SERVER_URL}api/security/invoices/multi-issuer/${invoiceId}`,
  );
};

const responseValidation = (
  response: ApiResponseModel<AppServerResponseModel>,
) => {
  return ServicesResponseValidation(response);
};
