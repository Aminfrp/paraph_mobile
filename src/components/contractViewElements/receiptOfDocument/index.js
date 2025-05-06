import React from 'react';
import {View, Text, Image} from 'react-native';
import styles from '../style';

const Index = props => {
  const {title} = props;

  return (
    <View>
      <Text style={styles.receiptOfDocumentTitle}>{title}</Text>
      <View style={styles.receiptOfDocumentBox}>
        <Image
          source={require('../../../../assets/img/contract.png')}
          style={styles.receiptOfDocumentImage}
        />
        <Text style={styles.receiptOfDocumentText}>نمایش فایل رسید</Text>
      </View>
    </View>
  );
};

export default Index;
