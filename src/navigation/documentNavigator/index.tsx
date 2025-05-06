import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import DocCreated from '../../screens/documents/created';
import DocReceived from '../../screens/documents/received';
import DocArchived from '../../screens/documents/archived';
import TabBar from './components/tabBar';
import * as routesName from '../../constants/routesName';

const TabStack = createMaterialTopTabNavigator();

const Index: React.FC = () => {
  return (
    <TabStack.Navigator
      screenOptions={
        {
          // headerShown: false,
        }
      }
      tabBar={props => <TabBar {...props} />}>
      <TabStack.Screen
        name={routesName.DOCUMENT_CREATED}
        component={DocCreated}
      />
      <TabStack.Screen
        name={routesName.DOCUMENT_RECEIVED}
        component={DocReceived}
      />
      <TabStack.Screen
        name={routesName.DOCUMENT_ARCHIVED}
        component={DocArchived}
      />
      {/*<TabStack.Screen name={routesName.DRAFTS} component={Drafts} />*/}
    </TabStack.Navigator>
  );
};

export default Index;
