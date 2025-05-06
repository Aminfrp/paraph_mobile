import React from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';

const Index = () => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.textWrapper}>
        <Image
          source={require('../../../../assets/img/png/info-circle-white.png')}
          resizeMode="contain"
          style={styles.infoIcon}
        />
        <Text style={styles.textHeader}>نکات مهم درباره رمز عبور</Text>
      </View>
      <Text style={styles.text}>
        این رمز هنگام امضای سند از شما خواسته می‌شود در حفظ آن دقت کنید.
      </Text>
      <Text style={styles.text}>
        در صورت فراموش کردن رمز گواهی، گواهی خود را از دست می‌دهید و نیاز است تا
        گواهی جدیدی خریداری کنید. خواهد شد.
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
