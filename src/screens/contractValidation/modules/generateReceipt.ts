import getSignerFullName from '../../../modules/dataNormalizers/getSignerFullName';
import saveSignToFile from '../../../helpers/saveSignToFile';
import {Logger} from '../../../modules/log/logger';

export default (input: any) => {
  const {
    savedFilename,
    activeContractData,
    contractStateDTOs,
    initiatorInfo,
    states,
    signer,
  } = input;
  return async (setState: (input: any) => void) => {
    try {
      setState(true);

      const user = getSignerFullName(signer);

      const contractCode = activeContractData.contractDto.code || savedFilename;

      await saveSignToFile(
        `${contractCode}-receipt`,
        activeContractData,
        contractStateDTOs,
        user,
        initiatorInfo,
        () => null,
        states,
      );

      setState(false);
    } catch (error) {
      Logger.debugLogger('error in generateReceipt:', error);
      setState(false);
    }
  };
};
