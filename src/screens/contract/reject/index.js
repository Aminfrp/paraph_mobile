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
  const {onReject, userInfo, contractNumber, trusted} = paramsState;
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

  const onRejectHandler = async () => {
    try {
      setLoading(true);
      await onReject(message);
      setLoading(false);
    } catch (error) {
      debugLogger('error in onRejectHandler: ', error);
      setLoading(false);
    }
  };

  const getSignerName = () => {
    return ` اینجانب ${userInfo?.firstName + ' ' + userInfo?.lastName}
با مطالعه سند و آگاهی از شرایط امضای دیجیتال پاراف`;
  };

  const TrustedConfirmation = () => {
    const signerName = ` ${userInfo?.firstName + ' ' + userInfo?.lastName} `;
    const signDate = ` ${getPersianDate(new Date().getTime()).date} `;

    return (
      <Text
        style={{
          fontFamily: 'YekanBakh-Bold',
          textAlign: 'center',
          fontSize: 14,
        }}>
        اینجانب
        <Text
          style={{
            fontSize: 18,
          }}>
          {signerName} توضیحات سند
        </Text>
        را به دقت مطالعه کرده و در تاریخ
        <Text
          style={{
            fontSize: 18,
          }}>
          {signDate}
        </Text>
        این سند را در پلتفرم امضای دیجیتال پاراف رد می‌کنم.
      </Text>
    );
  };

  return (
    <Container style={styles.wrapper}>
      <View>
        {trusted ? (
          <View
            style={[
              styles.card,
              {
                borderWidth: 1,
                borderStyle: 'solid',
                paddingHorizontal: 5,
                paddingVertical: 8,
                borderRadius: 8,
                marginVertical: 20,
                borderColor: '#0EA49E',
              },
            ]}>
            <TrustedConfirmation />
          </View>
        ) : (
          <>
            <GradientBorderMessage
              text={getSignerName()}
              borderColor="#c8c8c8"
              textColor="#202222"
            />
            <Text
              style={[
                styles.contractTitleFooterText,
                {color: getColor('danger'), textAlign: 'center'},
              ]}>
              سند {contractNumber} را در تاریخ
              {getPersianDate(new Date().getTime()).date} رد میکنم.
            </Text>
          </>
        )}
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
            title="رد"
            type="danger"
            onPress={onRejectHandler}
            loading={loading}
            disabled={loading}
          />
        </View>
      </View>
    </Container>
  );
};

export default Index;
