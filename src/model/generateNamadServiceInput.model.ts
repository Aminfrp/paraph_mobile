import {NamadGenerateInputModel} from './namadGenerateInput.model';

export interface GenerateNamadServiceInputModel
  extends NamadGenerateInputModel {
  csr: string;
}
