export type UserInfoModel = {
  financialLevelSrv: FinancialLevelSrv;
  firstName: string;
  hasBusiness: boolean;
  id: number;
  lastName: string;
  name: string;
  nationalCode_verified: string;
  shahabCode: string;
  ssoId: number;
  userId: number;
  username: string;
};
type FinancialLevelSrv = {
  level: string;
  levelName: string;
  value: string;
};
