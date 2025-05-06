import {BUSINESS_CODE, CLIENT_ID, RAD_SERVER_URL} from '../../config/APIConfig';
import ApiCaller from '../../helpers/axios';
import refIdGenerator from '../../helpers/refIdGenerator';
import onApiCallingError from '../../modules/apiCaller/onApiCallingError';
import onApiCallingSuccess from '../../modules/apiCaller/onApiCallingSuccess';

export default async (invoiceId, dataRaw) => {
  const refId = refIdGenerator();
  const caller = '[ServiceCall]-invoice';
  try {
    const params = JSON.stringify({
      products: [dataRaw?.products],
      quantities: [dataRaw?.quantities],
      descriptions: [dataRaw?.descriptions],
      customerInvoiceId: dataRaw?.customerInvoiceId,
      customerDescription: dataRaw?.customerDescription,
      ...(dataRaw?.customerDescription && {gateway: dataRaw?.gateway}),
      gateway: 'LOC',
      paymentType: 'ipg',
      billNumber: '',
      guildCode: 'LEGAL_GUILD',
      description: '',
      currencyCode: 'IRR',
      voucherHashs: [],
    });

    const response = await fetchJSON(invoiceId, params);
    const data = await responseValidation(response);
    onApiCallingSuccess({params: {}, refId, response}, caller);

    return {
      data,
      hasError: false,
      errorMessage: null,
    };
  } catch ({error, errorCatch}) {
    onApiCallingError({params: {}, refId, error}, caller);

    return Promise.reject({
      data: null,
      hasError: true,
      errorMessage: error,
    });
  }
};

const fetchJSON = (invoiceId, postData) => {
  const options = {
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      'Client-Id': CLIENT_ID,
      'business-code': BUSINESS_CODE,
    },
    data: postData,
    needAccessToken: true,
  };

  return ApiCaller(options).post(
    `${RAD_SERVER_URL}api/core/invoices/multi-issuer/${invoiceId}`,
  );
};

const responseValidation = response => {
  // return invoiceResponseValidation(response);

  if (response && response.data && response.data.hasError === false) {
    return Promise.resolve(response.data.result);
  } else {
    return Promise.reject(response.data.message);
  }
};
