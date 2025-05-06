import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';

const Index: React.FC = () => {
  const onCall = (): void => {
    Linking.openURL(`tel:021-89514219`);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.textWrapper}>
        <View style={{width: '7%'}}>
          <Image
            source={require('../../../../assets/img/png/info-circle-white.png')}
            resizeMode="contain"
            style={styles.infoIcon}
          />
        </View>
        <View style={{width: '92%'}}>
          <Text style={styles.text}>
            چنانچه مشخصات متقاضی با مشخصات شما یکی نیست با پشتیبانی پاراف به
            شماره 89514219-021 تماس بگیرید.
          </Text>
        </View>
      </View>
      <View style={styles.callBtnWrapper}>
        <TouchableOpacity style={styles.callBtn} onPress={onCall}>
          <Image
            source={require('../../../../assets/img/png/call_icon_active.png')}
            resizeMode="contain"
            style={{
              width: 20,
              height: 20,
            }}
          />
          <Text style={styles.text}>تماس با پشتیبانی</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 10,
    marginVertical: 20,
    padding: 10,
    backgroundColor: '#FFFBE6',
  },
  textWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: ' red',
  },
  infoIcon: {
    width: 25,
    height: 25,
  },
  text: {
    color: '#253858',
    fontSize: 14,
    fontFamily: 'YekanBakh-Bold',
  },
  detailsWrapper: {
    padding: 12,
    backgroundColor: '#FAFBFC',
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  callBtnWrapper: {
    flexDirection: 'row-reverse',
    marginVertical: 10,
  },
  callBtn: {
    borderWidth: 1,
    borderColor: '#DFE1E6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
});

export default Index;
