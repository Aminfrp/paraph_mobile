import React from 'react';
import {View} from 'react-native';
import HeaderLeft from '../headerLeft';
import HeaderTitle from '../headerTitle';
import HeaderRight from '../headerRight';

type PropsModel = {
  navigation: any;
  backHandler: () => void;
  toggleBackBtn: () => {};
};

const Index: React.FC<PropsModel> = ({
  navigation,
  backHandler,
  toggleBackBtn,
}) => {
  return (
    <View
      style={{
        height: 56,
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        backgroundColor: '#ffffff',
      }}>
      <HeaderRight navigation={navigation} />
      <HeaderTitle />
      <HeaderLeft
        navigation={navigation}
        backHandler={backHandler}
        mode={toggleBackBtn}
      />
    </View>
  );
};

export default Index;
