import React from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';

type PropsModel = {
  isSuccess: boolean;
  phoneNumber: string;
  status: string;
  requester: string;
  initiator: string;
  nationalCode: string;
  expirationDate: string;
};

const Index: React.FC<PropsModel> = props => {
  const {
    isSuccess,
    phoneNumber,
    status,
    requester,
    initiator,
    nationalCode,
    expirationDate,
  } = props;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.textHeader}>مشخصات گواهی امضای صادر شده</Text>

      <View style={styles.row}>
        <View style={[styles.row]}>
          <Image
            source={require('../../../../assets/img/png/buildings-light.png')}
            style={{width: 25, height: 25}}
          />
          <Text style={styles.text}>صادر کننده</Text>
        </View>
        <Text style={styles.text}>{initiator}</Text>
      </View>
      <View style={styles.row}>
        <View style={[styles.row]}>
          <Image
            source={require('../../../../assets/img/png/notification-circle.png')}
            style={{width: 25, height: 25}}
          />
          <Text style={styles.text}>وضعیت</Text>
        </View>
        <Text style={styles.text}>{status}</Text>
      </View>

      <View style={styles.row}>
        <View style={[styles.row]}>
          <Image
            source={require('../../../../assets/img/png/user.png')}
            style={{width: 25, height: 25}}
          />
          <Text style={styles.text}>متقاضی</Text>
        </View>
        <Text style={styles.text}>{requester}</Text>
      </View>
      <View style={styles.row}>
        <View style={[styles.row]}>
          <Image
            source={require('../../../../assets/img/png/call_icon.png')}
            style={{width: 25, height: 25}}
          />
          <Text style={styles.text}>شماره همراه</Text>
        </View>
        <Text style={styles.text}>{phoneNumber}</Text>
      </View>

      <View style={styles.row}>
        <View style={[styles.row]}>
          <Image
            source={require('../../../../assets/img/png/personalcard.png')}
            style={{width: 25, height: 25}}
          />
          <Text style={styles.text}>شماره ملی</Text>
        </View>
        <Text style={styles.text}>{nationalCode}</Text>
      </View>
      <View style={styles.row}>
        <View style={[styles.row]}>
          <Image
            source={require('../../../../assets/img/png/calendar.png')}
            style={{width: 25, height: 25}}
          />
          <Text style={styles.text}>تاریخ اعتبار</Text>
        </View>
        <Text style={styles.text}>{expirationDate}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EBECF0',
    padding: 10,
  },
  infoIcon: {
    width: 25,
    height: 25,
  },
  textHeader: {
    color: '#00091A',
    fontSize: 18,
    fontFamily: 'YekanBakh-Bold',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  text: {
    color: '#253858',
    fontSize: 14,
    fontFamily: 'YekanBakh-Bold',
    marginVertical: 8,
  },
  row: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 5,
    marginVertical: 1,
  },
});

export default Index;
