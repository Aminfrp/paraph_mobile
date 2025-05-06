import {StyleSheet, View} from 'react-native';
import Button from '../../../../components/button';
import Input from '../../../../components/input';
import React, {useState} from 'react';

const Index = props => {
  const {loading, onSign, onCancel} = props;
  const [password, setPassword] = useState('');

  return (
    <View>
      <View style={styles.inputWrapper}>
        <Input
          onChangeText={value => setPassword(value)}
          placeholder="رمز"
          error={null}
          style={{
            textAlign: 'right',
            width: '100%',
          }}
        />
      </View>
      <View style={{...styles.btnWrapper, width: '30%', padding: 2}}>
        <Button
          title={'امضا'}
          type={'success'}
          onPress={() => onSign(password)}
          disabled={loading}
          loading={loading}
        />
        <Button
          title={'لغو'}
          type={'dark-outline'}
          onPress={onCancel}
          disabled={false}
          loading={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  btnWrapper: {
    width: '50%',
    paddingHorizontal: 10,
  },
  inputWrapper: {
    paddingHorizontal: 10,
  },
});

export default Index;
