import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';

import BlockApplication from '../components/blockApplication';
import FullScreenLoading from '../components/fullScreenLoading';
import ToastNotification from '../components/toastNotification';
import * as routesName from '../constants/routesName';
import useAppAuthenticatedProcess from '../hooks/useAppAuthenticatedProcess';
import useSecurityUtils from '../hooks/useSecurityUtils';
import RulesAndConditions from '../screens/rulesAndConditions';
import AuthNavigator from './authNavigator';
import CertificateNavigator from './certificateNavigator';
import deepLinkConfig from './deepLinkConfig';
import DrawerNavigator from './drawerNavigator';
import {navigationRef} from './navigationRoot';

const AppStack = createStackNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#fff',
  },
};

const AppNavContainer: React.FC = () => {
  const {isDeviceRooted, isEmulator} = useSecurityUtils();
  const {authLoaded, isLoggedIn} = useAppAuthenticatedProcess();

  if (isDeviceRooted) {
    return (
      <BlockApplication text="شما اجازه دسترسی به برنامه در حالت روت بودن دستگاه را ندارید..." />
    );
  }

  if (isEmulator) {
    return (
      <BlockApplication text="شما اجازه دسترسی به محیط تست را ندارید..." />
    );
  }

  return (
    <>
      {authLoaded ? (
        <NavigationContainer
          ref={navigationRef}
          linking={deepLinkConfig}
          fallback={<FullScreenLoading />}
          theme={navTheme}>
          <AppStack.Navigator
            screenOptions={{
              headerShown: false,
            }}>
            <AppStack.Screen
              name={routesName.APP}
              component={isLoggedIn ? DrawerNavigator : AuthNavigator}
            />
            <AppStack.Screen
              name={routesName.RULES_AND_CONDITIONS}
              component={RulesAndConditions}
            />
            <AppStack.Screen
              name={routesName.CERTIFICATE}
              component={CertificateNavigator}
            />
          </AppStack.Navigator>
        </NavigationContainer>
      ) : (
        <FullScreenLoading />
      )}
      {isLoggedIn && <ToastNotification />}
    </>
  );
};

export default AppNavContainer;
