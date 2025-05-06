import React, {useState} from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AddBtnConfirmationModal from '../addBtnConfirmationModal';
import * as routesName from '../../../../constants/routesName';
import styles from '../../style';
import colors from '../../../../assets/theme/colors';

type PropsModel = {
  navigation: any;
  state: any;
};

const Index: React.FC<PropsModel> = props => {
  const {
    navigation: {navigate, getState},
    state,
  } = props;
  const activeIndex = state?.index;
  const routes = getState()?.routes;

  const [visibleAddBtnConfirmationModal, setVisibleAddBtnConfirmationModal] =
    useState(false);

  const list = [
    {
      key: 'Home',
      name: 'داشبورد',
      icon: (
        <Image
          source={require('../../../../assets/img/png/home_icon.png')}
          resizeMode="contain"
          style={styles.confirmModalIcon}
        />
      ),
      onPress: () => navigate(routesName.HOME),
    },
    {
      key: 'Documents',
      name: 'اسناد',
      icon: (
        <Image
          source={require('../../../../assets/img/png/document_icon.png')}
          resizeMode="contain"
          style={styles.confirmModalIcon}
        />
      ),
      onPress: () => navigate(routesName.DOCUMENTS),
    },

    {
      key: 'Add',
      name: 'افزودن',
      icon: (
        <MaterialCommunityIcons
          name="plus"
          size={28}
          color={colors.white}
          style={{transform: [{rotate: '135deg'}]}}
        />
      ),
      onPress: () => onPressPlusHandler(),
    },

    {
      key: 'Contacts',
      name: 'مخاطبین',
      icon: (
        <Image
          source={require('../../../../assets/img/png/call_icon.png')}
          resizeMode="contain"
          style={styles.confirmModalIcon}
        />
      ),
      onPress: () => navigate(routesName.CONTACT_LIST),
    },
    {
      key: 'Profile',
      name: 'پروفایل',
      icon: (
        <Image
          source={require('../../../../assets/img/png/profile_icon.png')}
          resizeMode="contain"
          style={styles.confirmModalIcon}
        />
      ),
      onPress: () => navigate(routesName.PROFILE),
    },
  ];

  const onPressPlusHandler = () => {
    setVisibleAddBtnConfirmationModal(!visibleAddBtnConfirmationModal);
  };

  return (
    <View style={styles.navigationWrapper}>
      {list &&
        list.length > 0 &&
        list.map((el, index) => {
          return (
            <TouchableOpacity
              style={el.key === 'Add' ? [styles.addBtn] : [styles.tabBtn]}
              onPress={el.onPress}
              key={el.key}>
              <View style={styles.tabBtnWrapper}>{el.icon}</View>
            </TouchableOpacity>
          );
        })}

      <AddBtnConfirmationModal
        visible={visibleAddBtnConfirmationModal}
        onHide={() => setVisibleAddBtnConfirmationModal(false)}
        navigate={navigate}
      />
    </View>
  );
};

export default Index;
