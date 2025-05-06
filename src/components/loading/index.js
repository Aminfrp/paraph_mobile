import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import colors from '../../assets/theme/colors';

const Index = props => {
  const {size = 'large'} = props;
  return (
    <View style={styles.indicatorContainer}>
      <ActivityIndicator size={size} color={colors.primary.success} />
    </View>
  );
};

const styles = StyleSheet.create({
  indicatorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
});

export default Index;
