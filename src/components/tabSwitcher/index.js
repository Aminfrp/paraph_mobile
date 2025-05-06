import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import styles from './style';

const Index = props => {
  const {options, activeItem, toggle, disabled = false} = props;

  const getTabBackground = index => {
    return activeItem === index ? '#7401B8' : 'transparent';
  };

  const getTabTextColor = index => {
    if (activeItem === index) {
      return '#fff';
    } else {
      if (disabled) return '#919191';
      return '#000';
    }
  };

  return (
    <View style={styles.container}>
      {options &&
        options.length &&
        options.map((i, key) => (
          <TouchableOpacity
            disabled={Boolean(disabled)}
            key={key}
            onPress={() => toggle(i)}
            style={[styles.tab, {backgroundColor: getTabBackground(i)}]}>
            <Text style={[styles.tabTitle, {color: getTabTextColor(i)}]}>
              {i}
            </Text>
          </TouchableOpacity>
        ))}
    </View>
  );
};

export default Index;
