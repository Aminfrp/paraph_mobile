import React from 'react';
import Toast from 'react-native-toast-message';
import toastConfig from './config';
import {onPressToast} from './utils';

const Index = props => {
  const {visibilityTime = 4000, autoHide = true} = props;

  return (
    <Toast
      visibilityTime={visibilityTime}
      autoHide={autoHide}
      style={{
        borderLeftColor: 'pink',
        backgroundColor: 'red',
        fontFamily: 'YekanBakh-Bold',
      }}
      config={toastConfig}
      onPress={onPressToast}
    />
  );
};

export default Index;
