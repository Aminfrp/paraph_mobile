export type GetInvoiceListInputModel = {
  fromDate: string;
  toDate: string;
  offset?: number;
  size?: number;
  customerInvoice?: boolean;
  field?: string;
  is?: string;
  certificateType?: string;
  keyIdResponse?: string;
  payed?: boolean;
};
