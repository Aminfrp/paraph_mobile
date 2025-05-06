import {UserProfileModel} from './userProfile.model.ts';
import {
  ContractDto,
  ContractStateDTOsEntity,
  NotificationDTOsEntity,
  SignerDto,
} from './contract.model.ts';

export interface DraftModel {
  id: number;
  contactId?: null;
  nationalCode?: null;
  resourceLink: string;
  contractFileName: string;
  Base64IV: string;
  order: number;
  contractDto: ContractDto;
  signerDto: SignerDto;
  notificationDTOs?: NotificationDTOsEntity[] | null;
  draftStateDtos?: DraftStateDTOsEntity[] | null;
  level: number;
  initiatorInfo?: UserProfileModel;
  submitterSSOId: string;
  initiatorSSOId: number;
  draftSigners: SignerDto[];
}

export interface DraftStateDTOsEntity {
  draftStateType: string;
  stateMessage?: null;
  submitTime: number;
  sign?: string | null;
  publickey?: null;
}
