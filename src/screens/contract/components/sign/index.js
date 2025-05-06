import React from 'react';
import {Text, View} from 'react-native';
import GradientBorderMessage from '../gradientBorderMessage';
import colors from '../../../../assets/theme/colors';
import styles from '../../../../components/message/style';
import Divider from '../../../../components/divider';
import CertificateRules from '../certificateRules';

const Index = props => {
  const {} = props;

  const getColor = type => {
    switch (type) {
      case 'danger':
        return colors.primary.danger;
      case 'primary':
        return colors.primary.purple;
      case 'success':
        return colors.primary.success;
      case 'secondary':
        return colors.primary.gray;
      case 'info':
        return colors.primary.info;
      default:
        return colors.primary.purple;
    }
  };

  return (
    <View>
      <View>
        <GradientBorderMessage
          text={`اینجانب سیده زهرا حسینی با کدملی ۲۳۴۰۷۸۶۵۰۲
با مطالعه سند و آگاهی از شرایط امضای دیجیتال پاراف`}
          borderColor="#c8c8c8"
          textColor="#202222"
        />
        <Text style={[styles.textMessage, {color: getColor('success')}]}>
          سند صادق محمدی درفناپ را در تاریخ ۱۴۰۱/۱۱/۲۵ امضا کردم.
        </Text>
      </View>
      <Divider />
      <CertificateRules />
    </View>
  );
};

export default Index;
