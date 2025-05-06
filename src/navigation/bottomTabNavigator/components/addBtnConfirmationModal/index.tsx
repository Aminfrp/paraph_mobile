import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {refRBSheet} from '../../../../helpers/appVersion';
import RbSheet from '../../../../components/rbSheet';
import styles from '../../style';
import * as routesName from '../../../../constants/routesName';

type PropsModel = {
  visible: boolean;
  onHide: () => void;
  navigate: any;
};

const Index: React.FC<PropsModel> = props => {
  const {visible, onHide, navigate} = props;

  const onCreateContact = () => {
    onHide();
    navigate(routesName.CREATE_CONTACT, {contact: null});
  };

  const onCreateContract = () => {
    onHide();
    navigate(routesName.CREATE_CONTRACT, {contact: null});
  };

  return (
    <RbSheet
      ref={refRBSheet}
      type="primary"
      height={240}
      visible={visible}
      onHide={onHide}
      onClose={onHide}>
      <View style={styles.confirmModalWrapper}>
        <TouchableOpacity
          style={styles.confirmModalRow}
          onPress={onCreateContract}>
          <Image
            source={require('../../../../assets/img/png/document_icon.png')}
            resizeMode="contain"
            style={styles.confirmModalIcon}
          />
          <View style={styles.confirmModalRowTextWrapper}>
            <Text style={styles.confirmModalRowBoldText}>ایجاد سند جدید</Text>
            <Text style={styles.confirmModalRowText}>
              در این بخش می توانید سند جدید ایجاد نمایید.
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.confirmModalRow, {borderBottomWidth: 0}]}
          onPress={onCreateContact}>
          <Image
            source={require('../../../../assets/img/png/call_icon.png')}
            resizeMode="contain"
            style={styles.confirmModalIcon}
          />
          <View style={styles.confirmModalRowTextWrapper}>
            <Text style={styles.confirmModalRowBoldText}>ایجاد مخاطب جدید</Text>
            <Text style={styles.confirmModalRowText}>
              در این بخش می توانید مخاطب جدید ایجاد نمایید.
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </RbSheet>
  );
};

export default Index;
