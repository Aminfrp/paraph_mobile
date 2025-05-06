import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Contract from '../../screens/contract';
import ContractSign from '../../screens/contract/sign';
import ContractReject from '../../screens/contract/reject';
import ContractDetails from '../../screens/contract/details';
import ContractCancellation from '../../screens/contract/cancellation';

import * as routesName from '../../constants/routesName';

const ContractDetailsStack = createStackNavigator();

const Index: React.FC = () => {
  return (
    <ContractDetailsStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={routesName.CONTRACT}>
      <ContractDetailsStack.Screen
        name={routesName.CONTRACT}
        component={Contract}
      />
      <ContractDetailsStack.Screen
        name={routesName.CONTRACT_SIGN}
        component={ContractSign}
      />
      <ContractDetailsStack.Screen
        name={routesName.CONTRACT_REJECT}
        component={ContractReject}
      />
      <ContractDetailsStack.Screen
        name={routesName.CONTRACT_CANCELLATION}
        component={ContractCancellation}
      />
      <ContractDetailsStack.Screen
        name={routesName.CONTRACT_DETAILS}
        component={ContractDetails}
      />
    </ContractDetailsStack.Navigator>
  );
};

export default Index;
