import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import colors from '../../assets/theme/colors';

const Index = () => {
  return (
    <View style={styles.indicatorContainer}>
      <ActivityIndicator size="large" color={colors.primary.success} />
    </View>
  );
};

const styles = StyleSheet.create({
  indicatorContainer: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
});

export default Index;
