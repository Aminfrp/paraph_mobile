import React from 'react';
import {View} from 'react-native';
import Button from '../../../../components/button';
import styles from '../../style';

const Index = props => {
  const {disabled, loading, onSubmit, onResendCode, onResendCodeLoading} =
    props;

  return (
    <View style={[styles.btnGroup, {marginTop: 10}]}>
      <View style={styles.btnWrapper}>
        <Button
          title="ارسال مجدد کد"
          disabled={onResendCodeLoading}
          loading={onResendCodeLoading}
          onPress={onResendCode}
          type="dark"
        />
      </View>
      <View style={styles.btnWrapper}>
        <Button
          title="تایید کد وارد شده"
          disabled={loading}
          loading={loading}
          onPress={onSubmit}
          type={disabled ? 'gray' : 'success'}
        />
      </View>
    </View>
  );
};

export default Index;
