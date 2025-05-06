export type UserProfileModel = {
  SSOId?: number;
  id: string;
  phone_number: null;
  phone_number_verified: boolean;
  email: null;
  email_verified: boolean;
  nationalcode_verified: boolean;
  family_name: string;
  given_name: string;
  preferred_username: string;
  legalInquireStatus: LegalInquireStatus[];
};

type LegalInquireStatus = {
  phoneNumber: null | string;
};
