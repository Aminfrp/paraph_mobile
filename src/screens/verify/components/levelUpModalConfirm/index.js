import React from 'react';
import {View, Text} from 'react-native';
import Button from '../../../../components/button';
import Modal from '../../../../components/modal';
import styles from '../../style';

const Index = props => {
  const {title, visible, onClose, description, onConfirm} = props;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onClose={onClose}
      title={title}>
      <Text
        style={[
          styles.modalTextDescription,
          {textAlign: 'center', paddingTop: 10},
        ]}>
        {description}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View style={{marginHorizontal: 5, width: '40%'}}>
          <Button
            title="احرازهویت"
            disabled={false}
            loading={false}
            onPress={onConfirm}
            type="success"
          />
        </View>
        <View style={{marginHorizontal: 5, width: '40%'}}>
          <Button
            title="بستن"
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
