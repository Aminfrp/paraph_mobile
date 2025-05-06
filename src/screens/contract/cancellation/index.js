import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import {Image, ScrollView, Text, View} from 'react-native';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {GlobalContext} from '../../../context';
import {GlobalAction} from '../../../context/actions';
import {getCurRouteName} from '../../../helpers/getActiveRouteState';
import GradientBorderMessage from '../components/gradientBorderMessage';
import styles from '../style';
import Divider from '../../../components/divider';
import CertificateRules from '../components/certificateRules';
import colors from '../../../assets/theme/colors';
import Container from '../../../components/container';
import Input from '../../../components/input';
import Button from '../../../components/button';
import {getPersianDate} from '../../../helpers/date';
import debugLogger from '../../../helpers/debugLogger';

const Index = props => {
  const {
    navigation: {navigate, goBack, getState},
    route,
  } = props;
  const {globalDispatch} = useContext(GlobalContext);
  const paramsState = route.params;
  const {onCancellation, userInfo, contractNumber} = paramsState;
  const isFocused = useIsFocused();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const curRoute = getCurRouteName(getState);
      globalDispatch(GlobalAction.toggleActiveRouteName(curRoute));
    }, []),
  );

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

  const onBack = () => goBack();

  const onCancellationHandler = async () => {
    try {
      setLoading(true);
      await onCancellation(message);
      setLoading(false);
    } catch (error) {
      debugLogger('error in onRejectHandler: ', error);
      setLoading(false);
    }
  };

  return (
    <Container style={styles.wrapper}>
      <View>
        <GradientBorderMessage
          text={`اینجانب ${userInfo?.firstName + ' ' + userInfo?.lastName}
با مطالعه سند و آگاهی از شرایط امضای دیجیتال پاراف`}
          borderColor="#c8c8c8"
          textColor="#202222"
        />
        <Text
          style={[
            styles.contractTitleFooterText,
            {color: getColor('danger'), textAlign: 'center'},
          ]}>
          سند {contractNumber} را در تاریخ{' '}
          {getPersianDate(new Date().getTime()).date} لغو میکنم.
        </Text>
      </View>
      <Divider />
      <CertificateRules />
      <View style={{marginVertical: 20}}>
        <Text style={styles.contractDescriptionTitle}>
          توضیحات رد سند خود را بنویسید
        </Text>
        <Input
          onChangeText={value => setMessage(value)}
          label="توضیحات"
          size="sm"
        />
      </View>

      <View style={styles.buttonsGroup}>
        <View style={styles.btnWrapper}>
          <Button
            title="انصراف"
            type="danger-outline"
            onPress={onBack}
            loading={false}
            disabled={false}
          />
        </View>
        <View style={styles.btnWrapper}>
          <Button
            title="لغو سند"
            type="danger"
            onPress={onCancellationHandler}
            loading={loading}
            disabled={loading}
          />
        </View>
      </View>
    </Container>
  );
};

export default Index;
