import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '../../screens/login';
import Verify from '../../screens/verify';

import * as routesName from '../../constants/routesName';

const AuthStack = createStackNavigator();

const Index: React.FC = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={routesName.LOGIN}>
      <AuthStack.Screen name={routesName.LOGIN} component={Login} />
      <AuthStack.Screen name={routesName.VERIFY} component={Verify} />
    </AuthStack.Navigator>
  );
};

export default Index;
