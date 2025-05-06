import {getContactIdByPhoneNumberService} from '../../apis';
import debugLogger from '../../helpers/debugLogger';

export default async data => {
  try {
    const contractList = [];

    for (let item of data) {
      const user = await getContactIdByPhoneNumberService({
        cellphoneNumber: item.signerDto.mobileNumber,
      });

      await contractList.push({
        ...item,
        contractStateDTOs: item.contractStateDTOs.map(i => ({
          ...i,
          user: user.data[0],
        })),
      });
    }

    return Promise.resolve(contractList);
  } catch (error) {
    debugLogger('error in getContractSignerDTOsList:', error);

    return Promise.reject(error);
  }
};
