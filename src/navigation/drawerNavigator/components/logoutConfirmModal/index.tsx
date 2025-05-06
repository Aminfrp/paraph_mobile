import React from 'react';
import {View, Text} from 'react-native';
import Button from '../../../../components/button';
import Modal from '../../../../components/modal';
import logout from '../../../../helpers/logout';
import styles from '../../style';

type PropsModel = {visible: boolean; onClose: any};

const Index: React.FC<PropsModel> = props => {
  const {visible, onClose} = props;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onClose={onClose}
      title="خروج از حساب کاربری">
      <Text style={[styles.modalTextDescription, {textAlign: 'center'}]}>
        می خواهید از حساب کاربری خود خارج شوید؟
      </Text>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View style={{marginHorizontal: 5, width: '40%'}}>
          <Button
            title="خارج شدن"
            disabled={false}
            loading={false}
            onPress={logout}
            type="success"
          />
        </View>
        <View style={{marginHorizontal: 5, width: '40%'}}>
          <Button
            title="لغو"
            disabled={false}
            loading={false}
            onPress={onClose}
            type="primary-outline"
          />
        </View>
      </View>
    </Modal>
  );
};

export default Index;
