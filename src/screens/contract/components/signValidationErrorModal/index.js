import React from 'react';
import {View, Text} from 'react-native';
import Button from '../../../../components/button';
import Modal from '../../../../components/modal';
import styles from '../../style';

const Index = props => {
  const {title, visible, onClose, description} = props;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onClose={onClose}
      title={title}>
      <Text style={[styles.contractDescriptionText, {textAlign: 'center'}]}>
        {description}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View style={{marginTop: 10, width: '60%'}}>
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
