import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import colors from '../../assets/theme/colors';

const Index: React.FC = () => (
  <View style={styles.indicatorContainer}>
    <ActivityIndicator size="large" color={colors.primary.success} />
  </View>
);

const styles = StyleSheet.create({
  indicatorContainer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    zIndex: 200,
  },
});

export default Index;
