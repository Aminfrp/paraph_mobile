import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import styles from '../../create/style';
import {toPersianDigits} from '../../../../helpers/convertNumber';
import Button from '../../../../components/button';
import {useNavigation} from '@react-navigation/native';

const Index = props => {
  const {onAddContact, onSubmit, totalContacts, error, goBack} = props;
  const navigation = useNavigation();
  const {navigate} = navigation;

  return (
    <View style={styles.formWrapper}>
      <View style={styles.contactListCounterWrapper}>
        <View style={styles.contactListCounter}>
          <Image
            source={require('../../../../assets/img/png/edit.png')}
            style={{width: 20, height: 20}}
          />
          <Text style={styles.contactListCounterText}>تعداد امضا کنندگان:</Text>
          <Text style={styles.contactListCounterNumberText}>
            {toPersianDigits(totalContacts)}
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.addContactsBtn} onPress={onAddContact}>
        <Text style={styles.addContactsBtnText}>افزودن امضاکننده</Text>
      </TouchableOpacity>
      {error && <Text style={styles.error}>{error}</Text>}
      {/*<View style={styles.btnGroup}>*/}
      {/*  <View style={styles.btnWrapper}>*/}
      {/*    <Button*/}
      {/*      title="بازگشت"*/}
      {/*      type="primary-outline"*/}
      {/*      onPress={goBack}*/}
      {/*      loading={false}*/}
      {/*      disabled={false}*/}
      {/*    />*/}
      {/*  </View>*/}
      {/*  <View style={styles.btnWrapper}>*/}
      {/*    <Button*/}
      {/*      title="ایجاد سند"*/}
      {/*      type="success"*/}
      {/*      onPress={onSubmit}*/}
      {/*      loading={false}*/}
      {/*      disabled={false}*/}
      {/*    />*/}
      {/*  </View>*/}
      {/*</View>*/}
    </View>
  );
};

export default Index;
