import React from 'react';
import {View, Image, Text, TouchableOpacity} from 'react-native';
import styles from '../../create/style';

const Index = props => {
  const {title} = props;

  return (
    <View style={styles.screenHeader}>
      <Text style={styles.screenTitle}>{title}</Text>
    </View>
  );
};

export default Index;
