import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import styles from './style';
import {useNavigation, useRoute} from '@react-navigation/native';
import {RISHE_CERTIFICATE_PAYMENT_HISTORY} from '../../constants/routesName.ts';
import * as routesName from '../../constants/routesName.ts';

type PropsModel = {
  title: string;
  onPress?: () => void;
};

const Index: React.FC<PropsModel> = props => {
  const {title, onPress = null} = props;
  const navigation = useNavigation();
  const {goBack} = navigation;
  const {name} = useRoute();

  return (
    <View style={styles.titleWrapper}>
      <TouchableOpacity onPress={onPress || goBack}>
        <Image
          source={require('../../assets/img/png/arrow-right.png')}
          resizeMethod="resize"
          style={styles.backBtnImg}
        />
      </TouchableOpacity>
      {title && <Text style={styles.titleText}>{title}</Text>}
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(RISHE_CERTIFICATE_PAYMENT_HISTORY as never);
        }}
        style={styles.buyHistoryButton}>
        {name === routesName.CERTIFICATES && (
          <Text style={styles.buyHistoryText}>تاریخچه خرید</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Index;
