import React from 'react';
import {View, ActivityIndicator} from 'react-native';
import Button from '../button';
import Modal from '../modal';
import colors from '../../assets/theme/colors';

const Index = props => {
  const {
    title,
    visible,
    onClose,
    disabled,
    cancelRequest,
    cancelable = true,
  } = props;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      // onClose={onClose}
      title={title}>
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator size="large" color={colors.primary.success} />
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {cancelable && (
          <View style={{marginTop: 10, width: '60%'}}>
            <Button
              title="لغو بارگذاری"
              disabled={disabled}
              loading={false}
              onPress={cancelRequest}
              type="danger-outline"
            />
          </View>
        )}
      </View>
    </Modal>
  );
};

export default Index;
