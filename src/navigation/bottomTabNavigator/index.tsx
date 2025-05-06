import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import TabBar from './components/tabBar';
import Home from '../../screens/home';
import DocumentNavigator from '../documentNavigator';
import ContactList from '../../screens/contact/contactList';
import CreateContact from '../../screens/contact/create';
import Profile from '../../screens/profile';
import * as routesName from '../../constants/routesName';

const TabStack = createBottomTabNavigator();

const Index: React.FC = () => {
  return (
    <TabStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={props => <TabBar {...props} />}
      initialRouteName={routesName.HOME}>
      <TabStack.Screen name={routesName.HOME} component={Home} />
      <TabStack.Screen
        name={routesName.DOCUMENTS}
        component={DocumentNavigator}
      />
      <TabStack.Screen name={routesName.CONTACT_LIST} component={ContactList} />
      <TabStack.Screen
        name={routesName.CREATE_CONTACT}
        component={CreateContact}
        initialParams={{contact: null}}
      />
      <TabStack.Screen name={routesName.PROFILE} component={Profile} />
    </TabStack.Navigator>
  );
};

export default Index;
