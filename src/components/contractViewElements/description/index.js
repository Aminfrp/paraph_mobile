import React from 'react';
import {View, Text, Image} from 'react-native';
import styles from '../style';

const Index = props => {
  const {text, title} = props;

  return (
    <View style={styles.contractDescriptionWrapper}>
      <Text style={styles.contractDescriptionTitle}>{title}</Text>
      <Text style={styles.contractDescriptionText}>{text}</Text>
    </View>
  );
};

export default Index;
