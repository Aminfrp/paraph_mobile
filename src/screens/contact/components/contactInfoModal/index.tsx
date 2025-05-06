import React from 'react';
import {View, Text} from 'react-native';
import Button from '../../../../components/button';
import Modal from '../../../../components/modal';
import styles from '../../contactList/style.ts';
import {toPersianDigits} from '../../../../helpers/convertNumber';
import {ContactModel} from '../../../../model/contact.model';

type PropsModel = {
  data: ContactModel;
  visible: boolean;
  onClose: () => void;
  createContract: () => void;
  editContact: () => void;
};

const Index: React.FC<PropsModel> = props => {
  const {data, visible, onClose, createContract, editContact} = props;

  const getTitle = () => {
    if (data) {
      if (data.legalUser) {
        return data.firstName;
      }

      return data.firstName + ' ' + data.lastName;
    }

    return '';
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onClose={onClose}
      title={getTitle()}>
      <Text style={styles.contactInfoModalDescription}>
        {data ? data.username : ''}
      </Text>
      <Text style={styles.contactInfoModalDescription}>
        {data ? toPersianDigits(data.cellphoneNumber) : ''}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View style={{marginTop: 10, width: '30%', marginHorizontal: 3}}>
          <Button
            title="بستن"
            disabled={false}
            loading={false}
            onPress={onClose}
            type="primary-outline"
          />
        </View>
        <View style={{marginTop: 10, marginHorizontal: 5, width: '30%'}}>
          <Button
            title="ایجاد سند"
            disabled={false}
            loading={false}
            onPress={createContract}
            type="primary"
          />
        </View>
        <View style={{marginTop: 10, width: '30%', marginHorizontal: 3}}>
          <Button
            title="ویرایش"
            disabled={false}
            loading={false}
            onPress={editContact}
            type="success"
          />
        </View>
      </View>
    </Modal>
  );
};

export default Index;
