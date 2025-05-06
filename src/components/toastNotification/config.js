import React from 'react';
import {BaseToast} from 'react-native-toast-message';
import colors from '../../assets/theme/colors';

const toastConfig = {
  success: props => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: colors.primary.success,
        backgroundColor: colors.primary.success,
      }}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: 15,
        fontFamily: 'YekanBakh-Bold',
        color: colors.white,
      }}
      text2Style={{
        fontSize: 14,
        fontFamily: 'YekanBakh-Bold',
        color: colors.lightGray,
      }}
    />
  ),
  warning: props => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: colors.warning,
        backgroundColor: colors.warning,
      }}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: 15,
        fontFamily: 'YekanBakh-Bold',
        color: colors.white,
      }}
      text2Style={{
        fontSize: 14,
        fontFamily: 'YekanBakh-Bold',
        color: colors.lightGray,
      }}
    />
  ),
  danger: props => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: colors.primary.danger,
        backgroundColor: colors.primary.danger,
      }}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: 15,
        fontFamily: 'YekanBakh-Bold',
        color: colors.white,
      }}
      text2Style={{
        fontSize: 14,
        fontFamily: 'YekanBakh-Bold',
        color: colors.lightGray,
      }}
    />
  ),
};

export default toastConfig;
