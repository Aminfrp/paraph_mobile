import React, {useState} from 'react';
import {View, Text} from 'react-native';
import styles from './style';
import colors from '../../assets/theme/colors';

type PropsModel = {
  text: string;
  type: string;
  isBold: boolean;
};

const Index: React.FC<PropsModel> = props => {
  const {text, type, isBold} = props;

  const getBgColor = () => {
    switch (type) {
      case 'danger':
        return colors.secondary.danger;
      case 'primary':
        return colors.secondary.purple;
      case 'success':
        return colors.secondary.success;
      case 'secondary':
        return colors.secondary.paleGray;
      case 'info':
        return colors.secondary.info;
      case 'warning':
        return colors.secondary.warning;
      default:
        return colors.secondary.purple;
    }
  };

  const getFontFamily = () => {
    return isBold ? 'YekanBakh-Bold' : 'Vazir-Thin';
  };

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: getBgColor(),
        },
      ]}>
      <Text
        style={[
          styles.badgeText,
          {
            fontFamily: getFontFamily(),
          },
        ]}
        numberOfLines={1}>
        {text}
      </Text>
    </View>
  );
};

export default Index;
