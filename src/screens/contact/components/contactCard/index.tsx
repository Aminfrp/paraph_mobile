import React from 'react';
import {View, Image, TouchableOpacity, Text} from 'react-native';
import styles from '../../contactList/style';
import {toPersianDigits} from '../../../../helpers/convertNumber';
import {ContactModel} from '../../../../model/contact.model';

type PropsModel = {
  item: ContactModel;
  getCardBorderColor: (value: string) => string;
  holdContactHandler: (input: ContactModel) => void;
  onContactHandler: (input: ContactModel) => void;
};

const Index: React.FC<PropsModel> = props => {
  const {item, getCardBorderColor, holdContactHandler, onContactHandler} =
    props;

  const {cellphoneNumber, firstName, lastName, username, contactSSoId} = item;

  return (
    <TouchableOpacity
      style={[
        styles.contactCardWrapper,
        {borderColor: getCardBorderColor(contactSSoId)},
      ]}
      // delayLongPress={100}
      onPress={() => onContactHandler(item)}
      onLongPress={() => holdContactHandler(item)}>
      <View style={{}}>
        {item.legalUser ? (
          <Image
            source={require('../../../../assets/img/png/buildings-light.png')}
            resizeMethod="resize"
            style={{width: 30, height: 30, borderRadius: 4}}
          />
        ) : (
          <Image
            source={require('../../../../assets/img/png/user.png')}
            resizeMethod="resize"
            style={{width: 30, height: 30, borderRadius: 4}}
          />
        )}
      </View>
      <View style={styles.contactCardInfoWrapper}>
        <Text
          style={styles.contactCardInfoText}
          numberOfLines={1}>{`${firstName} ${
          !item.legalUser ? lastName : ''
        }`}</Text>
        <Text style={styles.contactCardPhoneText}>
          {`${username}     ${toPersianDigits(cellphoneNumber) || ''}`}
        </Text>
      </View>
      <View style={styles.contactCardImgWrapper}>
        <Image
          source={require('../../../../assets/img/png/additem.png')}
          resizeMethod="resize"
          style={{width: 30, height: 30, borderRadius: 4}}
        />
      </View>
    </TouchableOpacity>
  );
};

export default Index;
