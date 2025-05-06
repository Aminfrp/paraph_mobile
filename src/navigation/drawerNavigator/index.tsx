import React, {useContext, useEffect, useState} from 'react';
import {View, ScrollView} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {GlobalContext} from '../../context';
import HomeNavigator from '../homeNavigator';
import NavItems from './components/navItems';
import AppLogoTitle from '../../components/appLogoTitle';
import Footer from './components/footer';
import styles from './style';
import * as routesName from '../../constants/routesName';
import {getAsyncStorage} from '../../helpers/asyncStorage';
import * as keyStorage from '../../constants/keyStorage';
import Header from './components/header';

type DrawerContentPropsModel = {
  navigation: any;
  asBusiness: boolean;
};

const DrawerContent: React.FC<DrawerContentPropsModel> = props => {
  const {navigation, asBusiness} = props;
  return (
    <View style={styles.drawerContentWrapper}>
      <AppLogoTitle />
      <ScrollView contentContainerStyle={styles.drawerScrollbarWrapper}>
        <NavItems navigation={navigation} asBusiness={asBusiness} />
        <Footer />
      </ScrollView>
    </View>
  );
};

const Index: React.FC = () => {
  const Drawer = createDrawerNavigator();
  const {globalState} = useContext<any>(GlobalContext);
  const [asBusiness, setAsBusiness] = useState(false);

  const backHandler = globalState.activeRouteHandler;

  useEffect(() => {
    setIsBusinessModeOnComponentMount();
    return () => {};
  }, []);

  const setIsBusinessModeOnComponentMount = async () => {
    const contactInfo = await getAsyncStorage(
      'object',
      keyStorage.CONTACT_INFO,
    );
    contactInfo.asBusiness && setAsBusiness(contactInfo.asBusiness);
  };

  const toggleBackBtn = () => {
    const curRoute = globalState.activeRouteName;

    switch (curRoute) {
      case routesName.HOME:
        return false;

      case routesName.DOCUMENT_RECEIVED:
        return false;

      case routesName.DOCUMENT_ARCHIVED:
        return false;

      case routesName.DOCUMENT_CREATED:
        return false;

      case routesName.CONTACT_LIST:
        return false;

      case routesName.DRAFTS:
        return false;

      default:
        return true;
    }
  };

  return (
    <Drawer.Navigator
      screenOptions={{headerShown: true, drawerPosition: 'right'}}
      drawerContent={({navigation}) => (
        <DrawerContent navigation={navigation} asBusiness={asBusiness} />
      )}>
      <Drawer.Screen
        name={routesName.HOME}
        component={HomeNavigator}
        options={({navigation}) => {
          return {
            header: () => (
              <Header
                navigation={navigation}
                backHandler={backHandler}
                toggleBackBtn={toggleBackBtn}
              />
            ),
          };
        }}
      />
    </Drawer.Navigator>
  );
};

export default Index;
