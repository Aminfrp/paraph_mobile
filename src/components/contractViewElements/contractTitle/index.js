import React from 'react';
import {View, Text} from 'react-native';
import styles from '../style';

const Index = props => {
  const {type, companyName, name} = props;

  return (
    <View style={styles.contractTitleWrapper}>
      <Text style={styles.contractTitleCompanyName}>{companyName}</Text>

      {/*<Text style={styles.contractTitleType}>{type}</Text>*/}
      {/*<Text style={styles.contractTitleName}>{name}</Text>*/}
      {/*<View style={styles.contractTitleFooterWrapper}>*/}
      {/*  <Text style={styles.contractTitleFooterText}>در</Text>*/}
      {/*  <Text style={styles.contractTitleCompanyName}>{companyName}</Text>*/}
      {/*</View>*/}
    </View>
  );
};

export default Index;
