export type NamadCertificateConstructorParams<T> = {
  CertificateCoreManager: T;
  productInvoiceId: string;
  productInvoiceKey: string;
  paymentGatewayUrl: string;
  paymentUrl: string;
  certificateName: string;
  keyPairName: string;
  nextStepCallback: (
    inputs: SuccessGenerateCertificateCallbackParamsModel,
  ) => void;
  rsaKeySize: number;
};
