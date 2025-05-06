import React, {useState} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  Linking,
  ScrollView,
} from 'react-native';
import LogoutConfirmModal from '../logoutConfirmModal';
import styles from '../../style';
import * as routesName from '../../../../constants/routesName';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../../../assets/theme/colors';

type PropsModel = {
  navigation: any;
  asBusiness: boolean;
};

const Index: React.FC<PropsModel> = props => {
  const {navigation, asBusiness} = props;
  const [showLogoutConfirmModal, setShowLogoutConfirmModal] = useState(false);

  const menus = [
    {
      icon: (
        <MaterialCommunityIcons
          name="chevron-right"
          size={25}
          color={colors.black}
          style={{transform: [{rotate: '180deg'}]}}
        />
      ),
      name: 'اعتبار سنجی سند',
      onPress: () => {
        navigation.closeDrawer();
        navigation.navigate(routesName.CONTRACT_VALIDATION, {
          closeDrawer: 'navigation.closeDrawer',
        });
      },
      type: 'primary',
      key: 'VALIDATION',
    },
    {
      icon: (
        <MaterialCommunityIcons
          name="chevron-right"
          size={25}
          color={colors.black}
          style={{transform: [{rotate: '180deg'}]}}
        />
      ),
      name: 'گواهی امضای دیجیتال',
      onPress: () => onCertificate(),
      type: 'primary',
      key: 'ROOT_CERTIFICATE',
    },
    {
      icon: (
        <MaterialCommunityIcons
          name="chevron-right"
          size={25}
          color={colors.black}
          style={{transform: [{rotate: '180deg'}]}}
        />
      ),
      name: 'شرایط استفاده از خدمات',
      onPress: () => {
        navigation.closeDrawer();
        navigation.navigate(routesName.RULES_AND_CONDITIONS, {
          closeDrawer: 'navigation.closeDrawer',
        });
      },
      type: 'primary',
      key: 'CONDITIONS',
    },
    {
      icon: (
        <MaterialCommunityIcons
          name="chevron-right"
          size={25}
          color={colors.black}
          style={{transform: [{rotate: '180deg'}]}}
        />
      ),
      name: 'درباره پاراف',
      onPress: () => loadLanding(),
      type: 'primary',
      key: 'ABOUT_APP',
    },
    {
      icon: null,
      name: 'خروج از حساب کاربری',
      onPress: () => logoutHandler(),
      type: 'danger',
      key: 'LOGOUT',
    },
  ];

  const onCertificate = async () => {
    navigation.navigate(routesName.CERTIFICATE, {
      screen: routesName.CERTIFICATES,
    });
    navigation.closeDrawer();
  };

  const logoutHandler = () => {
    navigation.closeDrawer();
    toggleLogoutModal();
  };

  const loadLanding = () => {
    Linking.openURL('https://paraph.me/').catch(err =>
      console.error("Couldn't load page", err),
    );
  };

  const toggleLogoutModal = () =>
    setShowLogoutConfirmModal(!showLogoutConfirmModal);

  return (
    <ScrollView>
      <StatusBar
        backgroundColor="white"
        barStyle="dark-content"
        // statusBarStyle="dark-content"
        animated
      />
      {menus &&
        menus.map(({name, icon, onPress, type, key}) => {
          if (asBusiness) {
            if (key !== 'ROOT_CERTIFICATE') {
              return (
                <TouchableOpacity
                  key={name}
                  style={styles.item}
                  onPress={onPress}>
                  <Text
                    style={[
                      styles.itemText,
                      type === 'danger'
                        ? styles.itemDangerColor
                        : styles.itemPrimaryColor,
                    ]}>
                    {name}
                  </Text>
                  {icon && <View>{icon}</View>}
                </TouchableOpacity>
              );
            }
          } else {
            return (
              <TouchableOpacity
                key={name}
                style={styles.item}
                onPress={onPress}>
                <Text
                  style={[
                    styles.itemText,
                    type === 'danger'
                      ? styles.itemDangerColor
                      : styles.itemPrimaryColor,
                  ]}>
                  {name}
                </Text>
                {icon && <View>{icon}</View>}
              </TouchableOpacity>
            );
          }
        })}
      <LogoutConfirmModal
        visible={showLogoutConfirmModal}
        onClose={toggleLogoutModal}
      />
    </ScrollView>
  );
};

export default Index;
