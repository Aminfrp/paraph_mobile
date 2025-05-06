export type PostInvoiceInputModel = {
  quantities: number;
  keyId: string;
  products: string;
  descriptions: string;
  customerInvoiceId: boolean;
  customerDescription: string;
  invoiceInfo: InvoiceInfo;
};

type InvoiceInfo = {
  version: number;
  certificateType: string;
  deviceType: string;
  ssoId: number;
  macId: string;
  keyIdResponse: string;
};
