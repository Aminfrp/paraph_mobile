import {getUserProfileService} from '../../../apis';
import * as keyStorage from '../../../constants/keyStorage';
import {getAsyncStorage} from '../../../helpers/asyncStorage';
import {ContractModel} from '../../../model/contract.model';
import {UserInfoModel} from '../../../model/userInfo.model';
import {
  getContractSignerDTOsListByContractId,
  getContractStateDTOs,
} from '../../../modules/dataNormalizers/loadContract';
import {Logger} from '../../../modules/log/logger';

export default async (contractSigners: ContractModel[], contractId: number) => {
  try {
    const userInfo: UserInfoModel = await getAsyncStorage(
      'object',
      keyStorage.CONTACT_INFO,
    );
    const userSSOID: number = Number(userInfo.ssoId);

    const {normalizedSigners, signer} =
      await getContractSignerDTOsListByContractId(contractSigners, contractId);

    const contractStateDTOs = await getContractStateDTOs(normalizedSigners);

    const contract = normalizedSigners.filter(
      item => item.signerDto.SSOId === userSSOID,
    )[0];

    const initiatorInfo = await getContractInitiatorInfo(
      contract?.contractDto?.initiatorSSOId,
    );

    return Promise.resolve({
      contractStateDTOs,
      contract,
      signer: signer,
      initiatorInfo,
    });
  } catch (error) {
    Logger.debugLogger('error in loadContract:', error);

    return Promise.reject(error);
  }
};

const getContractInitiatorInfo = async (_ssoId: number) => {
  try {
    const response = await getUserProfileService(_ssoId);
    const data = response && response.data;

    return Promise.resolve(data);
  } catch (error) {
    Logger.debugLogger('getContractInitiatorInfo error:', error);
    return Promise.reject(error);
  }
};
