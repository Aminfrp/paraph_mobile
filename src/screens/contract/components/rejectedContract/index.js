import React from 'react';
import {View, Text, Image} from 'react-native';
import colors from '../../../../assets/theme/colors';
import styles from '../../style';

const Index = props => {
  const {text} = props;

  return (
    <View style={styles.acceptOrRejectContractWrapper}>
      <Image source={require('../../../../assets/img/reject_contract.png')} />
      <Text
        style={[
          styles.acceptOrRejectContractText,
          {color: colors.primary.danger},
        ]}>
        {text}
      </Text>
    </View>
  );
};

export default Index;
