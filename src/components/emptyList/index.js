import React from 'react';
import {View, Text, ImageBackground, Image} from 'react-native';
import colors from '../../assets/theme/colors';

const Index = props => {
  const {text} = props;

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 70,
        height: '100%',
      }}>
      <ImageBackground
        source={require('../../assets/img/empty_background_list.png')}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          // backgroundColor: 'red',
          width: '100%',
          height: 300,
        }}
        resizeMode="contain">
        <Image
          source={require('../../assets/img/registration_list.png')}
          resizeMode="contain"
        />
      </ImageBackground>
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
