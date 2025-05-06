import React from 'react';
import {View, Text} from 'react-native';
import colors from '../../assets/theme/colors';

type PropsModel = {
  text: string;
};

const Index: React.FC<PropsModel> = props => {
  const {text} = props;

  return (
    <View
      style={{
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
      }}>
      <Text
        style={{
          color: colors.primary.grayDark,
          fontFamily: 'YekanBakh-Bold',
          fontSize: 16,
          marginVertical: 5,
        }}>
        {text}
      </Text>
    </View>
  );
};

export default Index;
