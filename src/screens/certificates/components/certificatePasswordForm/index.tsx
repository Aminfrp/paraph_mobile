import React from 'react';
import {Image, StyleSheet, View, Text} from 'react-native';
import Input from '../../../../components/input';

type PropsModel = {
  passwordError: boolean;
  repeatPasswordError: boolean;
  value: string;
  setValue: (input: string) => void;
  repeatValue: string;
  onRepeatValue: (input: string) => void;
};

const Index: React.FC<PropsModel> = props => {
  const {
    passwordError,
    repeatPasswordError,
    value,
    setValue,
    repeatValue,
    onRepeatValue,
  } = props;

  const onChange = (value: string): void => {
    setValue(value);
  };

  return (
    <View style={[]}>
      <View>
        <Input
          onChangeText={(value: string) => onChange(value)}
          placeholder="رمز عبور مورد نظر خود را وارد کنید"
          label="رمز عبور"
          error={passwordError}
          keyboardType="number-pad"
          size="sm"
          value={value}
          textHidden={true}
        />
        <Input
          onChangeText={(value: string) => onRepeatValue(value)}
          placeholder="تکرار رمز عبور را وارد کنید"
          label="تکرار رمز عبور"
          // error={repeatPasswordError}
          keyboardType="number-pad"
          size="sm"
          value={repeatValue}
          textHidden={true}
        />
      </View>
      <View>
        <View style={styles.row}>
          {passwordError ? (
            <Image
              source={require('../../../../assets/img/certificate-reject.png')}
              style={styles.validationIcon}
            />
          ) : (
            <Image
              source={require('../../../../assets/img/certificate-success.png')}
              style={styles.validationIcon}
            />
          )}
          <Text style={styles.text}>رمز عبور حداقل شامل ۴ حرف نیست.</Text>
        </View>
        <View style={styles.row}>
          {repeatPasswordError ? (
            <Image
              source={require('../../../../assets/img/certificate-reject.png')}
              style={styles.validationIcon}
            />
          ) : (
            <Image
              source={require('../../../../assets/img/certificate-success.png')}
              style={styles.validationIcon}
            />
          )}
          <Text style={styles.text}>
            تکرار رمز عبور با رمز عبور یکسان نیست.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    color: '#253858',
    fontSize: 14,
    fontFamily: 'YekanBakh-Bold',
    marginVertical: 4,
  },

  row: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginVertical: 8,
    gap: 8,
  },
  validationIcon: {
    width: 22,
    height: 22,
  },
});

export default Index;
