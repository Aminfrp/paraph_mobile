import {ContractModel} from './contract.model';

export type ContractPaginationModel = {
  contractHashAndSignersMap: {[name: string]: Array<ContractModel>};
  currentPageNumber: number;
  totalPages: number;
};
