import React from 'react';
import {View, Text} from 'react-native';
import styles from '../../style';

const Index = props => {
  const {phoneNumber, disabled} = props;

  return (
    <View style={styles.phoneNumberInformation}>
      <Text
        style={[
          styles.text,
          disabled ? disabledTextStyle : unDisabledTextStyle,
        ]}>
        پیامک حاوی کد به شماره <Text style={styles.phone}>{phoneNumber}</Text>
        ارسال شد.
      </Text>
    </View>
  );
};

const disabledTextStyle = {
  fontSize: 23,
  fontFamily: 'YekanBakh-Bold',
  paddingHorizontal: 5,
};

const unDisabledTextStyle = {
  fontSize: 20,
  fontFamily: 'YekanBakh-Bold',
  paddingHorizontal: 30,
};

export default Index;
