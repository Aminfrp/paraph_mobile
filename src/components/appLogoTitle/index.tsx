import React from 'react';
import {View, Text, Image} from 'react-native';
import styles from './style';

type PropsModel = {
  title?: string;
};

const Index: React.FC<PropsModel> = props => {
  const {title} = props;

  return (
    <View style={styles.appTitleWrapper}>
      <View>
        <Image
          source={require('../../assets/img/png/app_logo_w250.png')}
          resizeMethod="resize"
        />
      </View>
      {title && <Text style={styles.appTitleText}>{title}</Text>}
    </View>
  );
};

export default Index;
