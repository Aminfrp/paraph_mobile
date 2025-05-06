import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import BottomNavigationNavigator from '../bottomTabNavigator';
import ContractValidation from '../../screens/contractValidation';
import ContractNotValid from '../../screens/contractValidation/contractNotValid';
import ContractValid from '../../screens/contractValidation/contractValid';
import DeviceContactList from '../../screens/contact/deviceContactList';
import CreateContractNavigator from '../createContractNavigator';
import ContractDetailsNavigator from '../contractDetailsNavigator';
import CreateDocumentByDraft from '../../screens/drafts/createDocument';
import * as routesName from '../../constants/routesName';

const HomeStack = createStackNavigator();

const Index: React.FC = () => {
  return (
    <HomeStack.Navigator screenOptions={{headerShown: false}}>
      <HomeStack.Screen
        name={routesName.HOME}
        component={BottomNavigationNavigator}
      />
      <HomeStack.Screen
        name={routesName.CONTRACT}
        component={ContractDetailsNavigator}
      />
      <HomeStack.Screen
        name={routesName.CONTRACT_VALIDATION}
        component={ContractValidation}
      />
      <HomeStack.Screen
        name={routesName.CONTRACT_NOT_VALID}
        component={ContractNotValid}
      />
      <HomeStack.Screen
        name={routesName.CONTRACT_VALID}
        component={ContractValid}
      />
      <HomeStack.Screen
        name={routesName.CREATE_CONTRACT}
        component={CreateContractNavigator}
      />
      <HomeStack.Screen
        name={routesName.DEVICE_CONTACT_LIST}
        component={DeviceContactList}
      />
      <HomeStack.Screen
        name={routesName.CREATE_DOCUMENT_BY_DRAFT}
        component={CreateDocumentByDraft}
        initialParams={{draft: null, states: null}}
      />
    </HomeStack.Navigator>
  );
};

export default Index;
