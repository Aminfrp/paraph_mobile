import React from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';

type PropsModel = {};

const Index: React.FC<PropsModel> = props => {
  const {} = props;

  return (
    <View style={styles.wrapper}>
      <View style={styles.textWrapper}>
        <Image
          source={require('../../../../assets/img/png/info-circle-white.png')}
          resizeMode="contain"
          style={styles.infoIcon}
        />
        <Text style={styles.textHeader}>نکات مهم قبل از پرداخت</Text>
      </View>
      <Text style={styles.text}>
        پاک کردن نرم افزار باعث می‌شود گواهی امضای شما نیز پاک شود.
      </Text>
      <Text style={styles.text}>
        گواهی امضای خریداری شده، فقط روی همین دستگاه فعال است. بنابراین چنانچه
        در نسخه دسکتاپ پاراف گواهی امضا خریداری کرده‌اید، گواهی امضا شما باطل
        خواهد شد.
      </Text>
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
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  infoIcon: {
    width: 25,
    height: 25,
  },
  textHeader: {
    color: '#00091A',
    fontSize: 18,
    fontFamily: 'YekanBakh-Bold',
  },
  text: {
    color: '#253858',
    fontSize: 14,
    fontFamily: 'YekanBakh-Bold',
    marginVertical: 8,
  },
});

export default Index;
