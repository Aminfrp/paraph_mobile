export type GetContractsInputModel = {
  pageSize: number;
  pageNumber: number;
  reset?: boolean;
  accountOwner: boolean;
  contractStateTypesNot?: string;
  contractStateTypes?: string;
  contactId?: number;
  isInitiator?: boolean;
};
