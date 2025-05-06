import {ContractModel} from '../../model/contract.model.ts';

export default (
  data: {[hash: string]: ContractModel[]},
  userId: number,
): ContractModel[] => {
  return (
    data &&
    Object.keys(data).map((item: string) => {
      const usersContract: any = data[item].find(
        (i: ContractModel) => i.signerDto.SSOId === userId,
      );

      return {
        ...usersContract,
        contractStateDTOs:
          usersContract && usersContract.contractStateDTOs
            ? usersContract.contractStateDTOs.sort(
                (a: {submitTime: number}, b: {submitTime: number}) =>
                  b.submitTime - a.submitTime,
              )
            : [],
      };
    })
  );
};
