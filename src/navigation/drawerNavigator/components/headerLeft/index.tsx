import React from 'react';
import {TouchableOpacity, View} from 'react-native';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../../../assets/theme/colors';

type PropsModel = {
  navigation: any;
  backHandler: () => void;
  mode: () => {};
};

const Index: React.FC<PropsModel> = props => {
  const {navigation, mode, backHandler} = props;

  const goBack = () => {
    if (backHandler) {
      backHandler();

      return;
    }
    navigation.goBack();
  };

  return (
    <View
      style={{
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {mode() ? (
        <TouchableOpacity onPress={goBack}>
          <MaterialCommunityIcons
            name="chevron-left"
            size={25}
            color={colors.black}
          />
        </TouchableOpacity>
      ) : (
        <View style={{width: '100%'}} />
      )}
    </View>
  );
};

export default Index;
