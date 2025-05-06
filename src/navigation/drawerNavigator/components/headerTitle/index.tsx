import React from 'react';
import {Image, View} from 'react-native';
import styles from '../../style';

const Index: React.FC = () => {
  return (
    <View style={styles.headerTitleWrapper}>
      <Image
        source={require('../../../../assets/img/png/new_app_logo.png')}
        style={styles.headerTitleLogo}
        resizeMethod="resize"
      />
    </View>
  );
};

export default Index;
