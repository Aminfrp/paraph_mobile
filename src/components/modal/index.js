import React from 'react';
import {View, Text, Modal, StatusBar} from 'react-native';
import styles from './style';
import RBSheet from 'react-native-raw-bottom-sheet';
import colors from '../../assets/theme/colors';

const Index = props => {
  const {
    animationType = 'slide',
    transparent = true,
    visible,
    onClose,
    title,
    children,
  } = props;

  return (
    <>
      {visible && (
        <View style={styles.centeredView}>
          <Modal
            animationType={animationType}
            transparent={transparent}
            visible={visible}
            onRequestClose={onClose}>
            <View style={styles.overlay} />
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                {title && (
                  <View style={styles.headerWrapper}>
                    <Text style={styles.title}>{title}</Text>
                  </View>
                )}
                <View>{children}</View>
              </View>
            </View>
          </Modal>
        </View>
      )}
    </>
  );
};

export default Index;
