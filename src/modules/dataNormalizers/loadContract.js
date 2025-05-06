import {getContractByIdService, getUserProfileListService} from '../../apis';
import debugLogger from '../../helpers/debugLogger';

export default async (contractId, contactId) => {
  try {
    const contractSigners = await getContractByIdHandler(contractId);
    // const {normalizedSigners, signer} = await getContractSignerDTOsList(
    //   contractSigners,
    //   contactId,
    // );
    const {normalizedSigners, signer} =
      await getContractSignerDTOsListByContractId(
        contractSigners,
        contractId,
        contactId,
      );

    const contractStateDTOs = await getContractStateDTOs(normalizedSigners);

    const contract = normalizedSigners.filter(
      item => item.signerDto.SSOId === contactId,
    )[0];

    // const signer = await getUserProfileService(contactId);

    return Promise.resolve({
      contractStateDTOs,
      contract,
      signer: signer,
    });
  } catch (error) {
    debugLogger('error in loadContract:', error);

    return Promise.reject(error);
  }
};

const getContractByIdHandler = async id => {
  try {
    const response = await getContractByIdService(id);
    const data = response && response.data;

    return Promise.resolve(data);
  } catch (error) {
    debugLogger('error in getContractByIdHandler:', error);
    return Promise.reject(error);
  }
};

export const getContractSignerDTOsListByContractId = async (
  data,
  contractId,
  contactId,
) => {
  try {
    const contractList = [];

    const usersListResponse = await getUserProfileListService(contractId, 1);
    const userList = usersListResponse && usersListResponse.data;

    for (let item of data) {
      const user =
        userList && userList.find(el => Number(el.id) === item.signerDto.SSOId);
      ;

      contractList.push({
        ...item,
        contractStateDTOs: item.contractStateDTOs.map(i => ({
          ...i,
          user: user,
        })),
      });
    }

    return Promise.resolve({
      normalizedSigners: contractList,
      signer: userList[0],
    });
  } catch (error) {
    debugLogger('error in getContractSignerDTOsList:', error);
    return Promise.reject(error);
  }
};

export const getContractSignerDTOsList = async (data, contactId) => {
  try {
    const contractList = [];
    let index = 1;

    const ids =
      data &&
      data &&
      data.length > 0 &&
      data.map(el => {
        const obj = {index, value: el.signerDto.SSOId};
        index++;

        return obj;
      });

    ids && ids.unshift({index: 0, value: contactId});

    const usersListResponse = await getUserProfileListService(ids);
    const userList = usersListResponse && usersListResponse.data;

    for (let item of data) {
      // const user = await getUserProfileService(item.signerDto.SSOId);

      const user =
        userList && userList.find(el => Number(el.id) === item.signerDto.SSOId);
      ;

      contractList.push({
        ...item,
        contractStateDTOs: item.contractStateDTOs.map(i => ({
          ...i,
          user: user,
        })),
      });
    }

    return Promise.resolve({
      normalizedSigners: contractList,
      signer: userList[0],
    });
  } catch (error) {
    debugLogger('error in getContractSignerDTOsList:', error);

    return Promise.reject(error);
  }
};

export const getContractStateDTOs = data => {
  return (
    data &&
    data
      .map(item => {
        return item.contractStateDTOs
          .map(i => i)
          .sort((a, b) => b.submitTime - a.submitTime)[0];
      })
      .sort((a, b) => b.submitTime - a.submitTime)
  );
};
