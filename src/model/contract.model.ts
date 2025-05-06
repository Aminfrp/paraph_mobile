import {UserProfileModel} from './userProfile.model';

export interface ContractModel {
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
  contractStateDTOs?: ContractStateDTOsEntity[] | null;
  level: number;
  initiatorInfo?: UserProfileModel;
  nationalId?: string | number;
}
export interface ContractDto {
  id: number;
  hash: string;
  risheForced: boolean;
  namadForced: boolean;
  content: string;
  initiatorDownloadLink?: null;
  initiatorSSOId: number;
  finishedDeepLink: string;
  code: string;
  initiatorEncryptionBase64IV?: null;
  title: string;
  description: string;
  draftSubmitterSSOId?: null;
  templateId?: null;
  fromDate: number;
  toDate: number;
  version: number;
  trusted: boolean;
  onAllSignedEventApiCallRequest?: null;
  onOneNotSignedEventApiCallRequest?: null;
  onSignDeadlineExpiredEventApiCallRequest?: null;
}
export interface SignerDto {
  SSOId: number;
  cellphoneNumber?: null;
  nationalId?: null;
  order?: number;
}
export interface NotificationDTOsEntity {
  notificationType: string;
  notificationConnection: string;
  notificationText: string;
  notificationStatuses?: NotificationStatusesEntity[] | null;
}
export interface NotificationStatusesEntity {
  notificationType: string;
  notificationPodMessageId?: null;
}
export interface ContractStateDTOsEntity {
  contractStateType: string;
  stateMessage?: null;
  submitTime: number;
  sign?: string | null;
  publickey?: null;
}
