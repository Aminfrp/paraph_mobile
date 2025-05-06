import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image, ScrollView} from 'react-native';
import styles from '../../../contact/contactList/style';
import colors from '../../../../assets/theme/colors';
import RbSheet from '../../../../components/rbSheet';
import Button from '../../../../components/button';
import SelectOrderPicker from '../../components/selectOrderPicker';

const Index = props => {
  const {
    visible,
    onClose,
    refRBSheet,
    data,
    onSubmit,
    error,
    setData,
    setList,
  } = props;
  const [contacts, setContacts] = useState([
    ...data.map(i => ({...i, order: i.order ? i.order : 1})),
  ]);

  useEffect(
    () =>
      setContacts([...data.map(i => ({...i, order: i.order ? i.order : 1}))]),
    [data],
  );

  const onOrder = (item, value) => {
    const list =
      contacts &&
      contacts.length > 0 &&
      contacts.map(el => {
        if (el.id === item.id) {
          return {
            ...el,
            order: Number(value),
          };
        }
        return {
          ...el,
        };
      });

    list && setContacts(list);
  };

  const onRemove = id => {
    const updatedList =
      contacts.length > 0 && contacts.filter(i => i.id !== id);

    if (updatedList) {
      setContacts(updatedList);
      setData(updatedList);
      setList(updatedList);
    }
  };

  const submitHandler = () => {
    onSubmit(contacts);
  };

  const getContactName = contact => {
    if (contact.legalUser && contact.legalUser === 'true') {
      return contact.firstName;
    }
    return `${contact.firstName} ${contact.lastName}`;
  };

  return (
    <RbSheet
      ref={refRBSheet}
      title={`انتخاب اولویت ها`}
      height={540}
      visible={visible}
      closeOnDragDown={false}
      onClose={onClose}>
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
            paddingVertical: 15,
          }}>
          انتخاب اولویت
        </Text>
        <View style={{height: 25}}>
          {error && <Text style={styles.error}>{error}</Text>}
        </View>
      </View>
      <View style={{height: 380}}>
        <ScrollView style={{padding: 10, height: '100%'}}>
          {contacts &&
            contacts.length > 0 &&
            contacts.map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View
                  style={[
                    styles.contactCardWrapper,
                    {
                      width: '55%',
                      borderColor: colors.primary.gray,
                      paddingVertical: 10,
                    },
                  ]}>
                  <View style={styles.contactCardInfoWrapper}>
                    <Text style={styles.contactCardInfoText} numberOfLines={1}>
                      {getContactName(item)}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    borderRadius: 8,
                    overflow: 'hidden',
                    marginBottom: 10,
                    width: '29%',
                    borderColor: colors.primary.gray,
                    borderWidth: 1,
                  }}>
                  <SelectOrderPicker item={item} onOrder={onOrder} />
                  <Text
                    style={{
                      width: '100%',
                      height: 60,
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                    }}></Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.contactCardWrapper,
                    {
                      width: '10%',
                      backgroundColor: colors.primary.danger,
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderColor: colors.primary.danger,
                    },
                  ]}
                  onPress={() => onRemove(item.id)}>
                  <View style={[styles.contactCardInfoWrapper]}>
                    <Image
                      source={require('../../../../assets/img/png/close_icon.png')}
                      resizeMethod="resize"
                      style={{width: 30, height: 30}}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            ))}
        </ScrollView>
      </View>
      <View
        style={{
          padding: 10,
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}>
        <View style={{width: '49%'}}>
          <Button
            title="بازگشت"
            disabled={false}
            loading={false}
            onPress={onClose}
            type="primary-outline"
          />
        </View>
        <View style={{width: '49%'}}>
          <Button
            title="انتخاب"
            disabled={false}
            loading={false}
            onPress={submitHandler}
            type="success"
          />
        </View>
      </View>
    </RbSheet>
  );
};

export default Index;
