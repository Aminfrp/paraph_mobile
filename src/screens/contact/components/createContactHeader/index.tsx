import React from 'react';
import {View, Image} from 'react-native';
import styles from '../../create/style';

const Index: React.FC = props => {
  const {} = props;

  return (
    <View style={styles.wrapper}>
      <View style={styles.screenHeader}>
        <View style={styles.imgWrapper}>
          <Image
            source={require('../../../../assets/img/mobile_in_hand.png')}
            resizeMode="contain"
            style={styles.stretch}
          />
          <Image source={require('../../../../assets/img/black_line.png')} />
        </View>
      </View>
    </View>
  );
};

export default Index;
