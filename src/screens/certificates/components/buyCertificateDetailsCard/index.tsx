import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

type PropsModel = {
  instruction: string;
  expiration: string;
  cost: string;
  description: string;
};

const Index: React.FC<PropsModel> = props => {
  const {instruction, expiration, cost, description} = props;

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.textTitle}>مشخصات گواهی امضا</Text>
      </View>
      <View style={styles.detailsWrapper}>
        <View style={styles.detailsRow}>
          <Text style={[styles.textTitle, {fontSize: 16}]}>صادر کننده:</Text>
          <Text style={[styles.text]}>{instruction}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={[styles.textTitle, {fontSize: 16}]}>مدت اعتبار:</Text>
          <Text style={[styles.text]}>{expiration}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={[styles.textTitle, {fontSize: 16}]}>هزینه صدور</Text>
          <Text style={[styles.text]}>{cost} تومان</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={[styles.textTitle, {fontSize: 16}]}>توضیحات</Text>
          <Text style={[styles.text]}>{description}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 10,
    marginVertical: 20,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  header: {
    backgroundColor: '#EBECF0',
    padding: 12,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  textTitle: {
    color: '#00091A',
    fontSize: 18,
    fontFamily: 'YekanBakh-Bold',
  },
  text: {
    color: '#253858',
    fontSize: 14,
    fontFamily: 'YekanBakh-Bold',
    marginVertical: 6,
  },
  detailsWrapper: {
    padding: 12,
    backgroundColor: '#FAFBFC',
  },
  detailsRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default Index;
