import {View, Text} from 'react-native';
import React from 'react';
import styles from './style';

export default function Index(props) {
  const {text, borderColor = '#9747FF', textColor = '#9747FF'} = props;
  return (
    <View style={[styles.card, {borderColor: borderColor}]}>
      <Text
        style={{
          fontFamily: 'YekanBakh-Bold',
          textAlign: 'center',
          fontSize: 15,
          color: textColor,
        }}>
        {text}
      </Text>
    </View>
  );
}
