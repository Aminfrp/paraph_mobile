import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useContext, useState} from 'react';
import {Text, View} from 'react-native';
import colors from '../../../assets/theme/colors';
import Button from '../../../components/button';
import Container from '../../../components/container';
import Divider from '../../../components/divider';
import Input from '../../../components/input';
import {GlobalContext} from '../../../context';
import {GlobalAction} from '../../../context/actions';
import {getPersianDate} from '../../../helpers/date';
import debugLogger from '../../../helpers/debugLogger';
import {getCurRouteName} from '../../../helpers/getActiveRouteState';
import CertificateRules from '../components/certificateRules';
import GradientBorderMessage from '../components/gradientBorderMessage';
import styles from '../style';
import CertificateExistErrorModal from '../../certificates/components/certificateExistErrorModal/CertificateExistErrorModal';

const Index = props => {
  const {
    navigation: {goBack, getState},
    route,
  } = props;
  const {globalDispatch} = useContext(GlobalContext);
  const paramsState = route.params;
  const {
    onSignByRootCertificate,
    onSignByNamadCertificate,
    onSign,
    isCertificate,
    userInfo,
    contractNumber,
    certificateType,
    trusted,
  } = paramsState;
  const [passwordError, setPasswordError] = useState(null);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [certExistModal, setCertExistModal] = useState(false);

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

  const onSignHandler = async () => {
    try {
      setLoading(true);

      if (isCertificate) {
        if (password === '') {
          if (certificateType === 'namad') {
            setPasswordError('رمز گواهی نماد خود را وارد نمایید');
          } else if (certificateType === 'rishe') {
            setPasswordError('رمز گواهی ریشه خود را وارد نمایید');
          }
        } else {
          if (certificateType === 'namad') {
            await onSignByNamadCertificate(password);
          } else if (certificateType === 'rishe') {
            await onSignByRootCertificate(password, () => {
              setCertExistModal(true);
            });
          }
        }
      } else {
        await onSign();
      }

      setLoading(false);
    } catch (error) {
      debugLogger('error in onSignHandler: ', error);
      setLoading(false);
    }
  };

  const getSignerName = () => {
    return userInfo?.firstName + ' ' + userInfo?.lastName;
  };

  const getGradientText = () => {
    return ` اینجانب ${getSignerName()} با مطالعه سند و آگاهی از شرایط امضای دیجیتال پاراف `;
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
        این سند را در پلتفرم امضای دیجیتال پاراف امضا می‌کنم.
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
              text={getGradientText()}
              borderColor="#c8c8c8"
              textColor="#202222"
            />
            <Text
              style={[
                styles.contractTitleFooterText,
                {color: getColor('success'), textAlign: 'center'},
              ]}>
              سند {contractNumber} را در تاریخ
              {getPersianDate(new Date().getTime()).date} امضا میکنم.
            </Text>
          </>
        )}
      </View>
      <Divider />
      <CertificateRules />
      {isCertificate && (
        <View style={{marginVertical: 20}}>
          <Text style={styles.contractDescriptionTitle}>
            رمز گواهی امضای خود را بنویسید
          </Text>
          <Input
            onChangeText={value => setPassword(value)}
            label="رمز گواهی امضا"
            error={passwordError}
            keyboardType="number-pad"
            size="sm"
            textHidden={true}
          />
        </View>
      )}

      <View style={styles.buttonsGroup}>
        <View style={styles.btnWrapper}>
          <Button
            title="انصراف"
            type="success-outline"
            onPress={onBack}
            loading={false}
            disabled={false}
          />
        </View>
        <View style={styles.btnWrapper}>
          <Button
            title="امضا"
            type="success"
            onPress={onSignHandler}
            loading={loading}
            disabled={loading}
          />
        </View>
      </View>
      <CertificateExistErrorModal
        show={certExistModal}
        onClose={() => setCertExistModal(false)}
      />
    </Container>
  );
};

export default Index;
