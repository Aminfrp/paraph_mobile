import React from 'react';
import {View, Text, Image} from 'react-native';
import styles from '../../style';
import Button from '../../../../components/button';

type PropsModel = {
  onBuy: () => void;
  onMoreDetails: () => void;
};

const Index: React.FC<PropsModel> = props => {
  const {onBuy, onMoreDetails} = props;
  return (
    <View style={styles.noCertificateBought}>
      <View style={styles.noCertificateBoughtCertificateImgWrapper}>
        <Image
          source={require('../../../../assets/img/png/Certificate.png')}
          style={styles.noCertificateBoughtCertificateImg}
        />
      </View>
      <View style={styles.noCertificateBoughtCertificateTextWrapper}>
        <Text style={styles.noCertificateBoughtCertificateTextBold}>
          هنوز گواهی امضایی خریداری نکرده‌اید
        </Text>
        <Text style={styles.noCertificateBoughtCertificateText}>
          یک گواهی امضا خریداری کنید
        </Text>
      </View>
      <View style={styles.noCertificateBoughtCertificateBtnGroup}>
        <View style={styles.noCertificateBoughtCertificateBtnWrapper}>
          <Button
            title="اطلاعات بیشتر"
            type="white-outline"
            onPress={onMoreDetails}
            loading={false}
            disabled={false}
          />
        </View>
        <View style={styles.noCertificateBoughtCertificateBtnWrapper}>
          <Button
            title="خرید گواهی امضا"
            type="success"
            onPress={onBuy}
            loading={false}
            disabled={false}
          />
        </View>
      </View>
    </View>
  );
};

export default Index;
