import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

type PropsModel = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  nationalCode: string;
};

const Index: React.FC<PropsModel> = props => {
  const {firstName, lastName, phoneNumber, nationalCode} = props;

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.textTitle}>مشخصات متقاضی</Text>
      </View>
      <View style={styles.detailsWrapper}>
        <View style={styles.detailsRow}>
          <Text style={[styles.textTitle, {fontSize: 16}]}>نام:</Text>
          <Text style={[styles.text]}>{firstName}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={[styles.textTitle, {fontSize: 16}]}>نام خانوادگی:</Text>
          <Text style={[styles.text]}>{lastName}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={[styles.textTitle, {fontSize: 16}]}>کد ملی:</Text>
          <Text style={[styles.text]}>{nationalCode}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={[styles.textTitle, {fontSize: 16}]}>شماره همراه:</Text>
          <Text style={[styles.text]}>{phoneNumber}</Text>
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
    backgroundColor: '#FFFBE6',
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
