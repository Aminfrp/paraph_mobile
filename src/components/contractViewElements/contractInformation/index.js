import React from 'react';
import {View, Text} from 'react-native';
import Badge from '../../badge';
import styles from '../style';

const Index = props => {
  const {date, creator, contractNumber, expireTime} = props;

  return (
    <View style={styles.contractInformationWrapper}>
      <View style={styles.contractInformationItem}>
        <Text style={styles.contractInformationItemText}>مهلت امضا</Text>
        <Badge text={expireTime} type="secondary" isBold />
      </View>
      <View style={styles.contractInformationItem}>
        <Text style={styles.contractInformationItemText}>شماره سند</Text>
        <Badge text={contractNumber} type="secondary" isBold />
      </View>
      <View style={styles.contractInformationItem}>
        <Text style={styles.contractInformationItemText}>تاریخ</Text>
        <Badge text={date} type="secondary" isBold />
      </View>

      {/*<View style={styles.contractInformationItem}>*/}
      {/*  <Text style={styles.contractInformationItemText}>ایجاد کننده</Text>*/}
      {/*  <View style={styles.contractInformationItemBorderStyle}>*/}
      {/*    <Badge text={creator} type="secondary" isBold />*/}
      {/*  </View>*/}
      {/*</View>*/}
      {/*<View style={styles.contractInformationItem}>*/}
      {/*  <Text style={styles.contractInformationItemText}>شماره سند</Text>*/}
      {/*  <Badge text={contractNumber} type="secondary" isBold />*/}
      {/*</View>*/}
    </View>
  );
};

export default Index;
