import {RisheGenerateInputModel} from './risheGenerateInput.model';

export interface GenerateRisheServiceInputModel
  extends RisheGenerateInputModel {
  csr: string;
}
