import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import styles from './style';
import {useNavigation} from '@react-navigation/native';

type PropsModel = {
  title: string;
  onPress?: () => void;
};

const Index: React.FC<PropsModel> = props => {
  const {title, onPress = null} = props;
  const navigation = useNavigation();
  const {goBack} = navigation;

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
    </View>
  );
};

export default Index;
