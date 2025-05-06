import {ContractStatesModel} from '../../model/contractStates.model.ts';

type States = Array<{
  key: string;

  name: string;
  contractStateTypes?: string;
  contractStateTypesNot?: string;
}>;

export default (payload: ContractStatesModel) => {
  let map: {[string: string]: string} = {};

  for (let item in payload) {
    map[item] = Object.keys(payload[item])[0];
  }

  const states: States = [
    {
      key: 'created',
      name: 'ایجاد شده',
      contractStateTypes: `none`,
      contractStateTypesNot: `contractStateTypesNot=${map['WAIT_FOR_SIGN_ON_GATEWAY']}&contractStateTypesNot=${map['GATEWAY_SIGNED']}`,
    },
  ];

  const received = {
    key: 'received',
    name: 'دریافتی',
    contractStateTypes: `${map['SUBMITTED']}&contractStateTypes=${map['DOWNLOADED']}&contractStateTypes=${map['OPENED']}`,
    contractStateTypesNot: `${map['SIGNED']}&contractStateTypesNot=${map['NOT_SIGNED']}&contractStateTypesNot=${map['REJECTED']}&contractStateTypesNot=${map['WAIT_FOR_SIGN_ON_GATEWAY']}&contractStateTypesNot=${map['GATEWAY_SIGNED']}`,
  };

  const archived = {
    key: 'archived',
    name: 'آرشیو شده',
    contractStateTypes: `${map['SIGNED']}&contractStateTypes=${map['NOT_SIGNED']}&contractStateTypes=${map['REJECTED']}&contractStateTypes=${map['GATEWAY_SIGNED']}`,
    contractStateTypesNot: `${map['SUBMITTED']}&contractStateTypesNot=${map['DOWNLOADED']}&contractStateTypesNot=${map['OPENED']}&contractStateTypesNot=${map['WAIT_FOR_SIGN_ON_GATEWAY']}`,
  };

  const created = {
    key: 'created',
    name: 'ایجاد شده',
    contractStateTypesNot: `contractStateTypesNot=${map['WAIT_FOR_SIGN_ON_GATEWAY']}&contractStateTypesNot=${map['GATEWAY_SIGNED']}`,
  };

  const needToBeChecked = {
    key: 'needToBeChecked',
    name: 'نیازمند بررسی',
    contractStateTypesNot: `contractStateTypesNot=${map['WAIT_FOR_SIGN_ON_GATEWAY']}&contractStateTypesNot=${map['GATEWAY_SIGNED']}`,
  };

  states.push(received);
  states.push(archived);
  states.push(created);
  states.push(needToBeChecked);

  return states;
};
