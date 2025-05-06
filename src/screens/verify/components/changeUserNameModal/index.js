import React from 'react';
import {View, Text, TouchableOpacity, Linking} from 'react-native';
import RbSheet from '../../../../components/rbSheet';
import styles from '../../../profile/style';
import Input from '../../../../components/input';
import Button from '../../../../components/button';
import colors from '../../../../assets/theme/colors';

const Index = props => {
  const {
    disabled,
    visible,
    loading,
    refRBSheet,
    onSubmit,
    username,
    error,
    onUsername,
  } = props;

  return (
    <RbSheet
      ref={refRBSheet}
      disabled={disabled}
      closeOnPressBack={false}
      closeOnDragDown={false}
      closeOnPressMask={false}
      height={340}
      visible={visible}>
      <View
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 18,
            fontFamily: 'YekanBakh-Bold',
            paddingTop: 20,
            paddingBottom: 10,
          }}>
          تغیر نام کاربری
        </Text>
      </View>
      <View style={{paddingVertical: 10}}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 18,
            color: colors.accent,
            fontFamily: 'YekanBakh-Bold',
            paddingHorizontal: 10,
          }}>
          تغبر نام کاربری به معنای تغیر حساب پاد می باشد*
        </Text>
      </View>
      <View style={styles.form}>
        <Input
          onChangeText={value => onUsername(value)}
          label="نام کاربری"
          error={error}
          iconPosition="right"
          value={username}
          type="secondary"
          size="md"
        />

        <Button
          title="ذخیره"
          disabled={loading}
          loading={loading}
          onPress={onSubmit}
          type="success"
        />
      </View>
    </RbSheet>
  );
};

export default Index;
