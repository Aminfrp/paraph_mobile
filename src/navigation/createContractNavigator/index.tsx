import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import * as routesName from '../../constants/routesName';
import CreateContract from '../../screens/contract/create';
import CreatedContractSuccessfully from '../../screens/contract/createdSuccessfully';
import CreateContractContactList from '../../screens/contract/contactList';

const CreateContractStack = createStackNavigator();

const Index: React.FC = () => {
  return (
    <CreateContractStack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={routesName.CREATE_CONTRACT}>
      <CreateContractStack.Screen
        name={routesName.CREATE_CONTRACT}
        component={CreateContract}
        initialParams={{contact: null}}
      />
      <CreateContractStack.Screen
        name={routesName.CREATE_CONTRACT_SUCCESSFULLY}
        component={CreatedContractSuccessfully}
      />
      <CreateContractStack.Screen
        name={routesName.CREATE_CONTRACT_CONTACT_LIST}
        component={CreateContractContactList}
      />
    </CreateContractStack.Navigator>
  );
};

export default Index;
