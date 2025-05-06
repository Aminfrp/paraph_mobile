import React from 'react';
import {TouchableOpacity, View} from 'react-native';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../../../assets/theme/colors';

type PropsModel = {
  navigation: any;
};

const Index: React.FC<PropsModel> = props => {
  const {navigation} = props;

  const toggleMenu = () => navigation.toggleDrawer();

  return (
    <View style={{}}>
      <TouchableOpacity onPress={toggleMenu}>
        <MaterialCommunityIcons
          name="menu"
          size={25}
          color={colors.black}
          style={{transform: [{rotate: '180deg'}]}}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Index;
