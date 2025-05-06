import {CertificateTypeEnum} from './certificateType.enum';

export type SignByCertificateInputModel = {
  keyId: string;
  sign: string;
  certType: keyof CertificateTypeEnum | string;
  id: number;
};
