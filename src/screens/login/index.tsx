import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Image, Keyboard, StatusBar, Text, View} from 'react-native';

import {getUniqueId} from 'react-native-device-info';
import {
  authorizeService,
  handShakeService,
  podAuthorizeService,
} from '../../apis';
import AppLogoTitle from '../../components/appLogoTitle';
import Button from '../../components/button';
import Checkbox from '../../components/checkbox';
import Input from '../../components/input';
import toastAndroid from '../../components/toastAndroid';
import {
  APP_VERSION_STRING,
  AUTHORIZE_SCOPE,
  CLIENT_ID,
} from '../../config/APIConfig';
import * as keyStorage from '../../constants/keyStorage';
import * as routesName from '../../constants/routesName';
import {
  getAsyncStorage,
  removeAsyncStorage,
  setAsyncStorage,
} from '../../helpers/asyncStorage';
import {toPersianDigits} from '../../helpers/convertNumber';
import debugLogger from '../../helpers/debugLogger';
import {AuthorizeServiceInput} from '../../model/authorizeServiceInput';
import {HandshakeServiceInputModel} from '../../model/handshakeServiceInput.model';
import {Logger} from '../../modules/log/logger';
import {validNumberString} from '../../modules/validation/validation';
import styles from './style';

type Error = string | null;

const Index = () => {
  const {navigate} = useNavigation();
  const [mobile, setMobile] = useState<string>('');
  const [errorInput, setError] = useState<Error>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [asBusiness, setAsBusiness] = useState<boolean>(false);
  const [businessId, setBusinessId] = useState<string>('');
  const [businessError, setBusinessError] = useState<Error>(null);
  const [apiError, setApiError] = useState<Error>(null);
  const [retryNumber, setRetryNumber] = useState<number>(0);
  const [handshakeError, setHandshakeError] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      clearMemory();

      return () => {};
    }, []),
  );

  const clearMemory = () => {
    try {
      const processes = [
        removeAsyncStorage(keyStorage.CONTACT_INFO),
        removeAsyncStorage(keyStorage.ACCESS_TOKEN),
        removeAsyncStorage(keyStorage.POD_USER_PROFILE_INFO),
        removeAsyncStorage(keyStorage.EXPIRES_TOKEN_TIME),
        removeAsyncStorage(keyStorage.MOBILE_NUMBER),
        removeAsyncStorage(keyStorage.SECRET_KEY),
        removeAsyncStorage(keyStorage.REFRESH_TOKEN),
      ];

      return Promise.all(processes);
    } catch (error) {
      debugLogger(error);
    }
  };

  useEffect(() => {
    handShake().then(r => null);

    return () => {};
  }, []);

  const handShake = async (): Promise<void> => {
    try {
      setLoading(true);
      const device_uid: string = await getUniqueId();
      const params: HandshakeServiceInputModel = {
        device_uid,
      };
      const response = await handShakeService(params);
      if (!response.data) return;
      await setAsyncStorage('text', keyStorage.KEY_ID, response.data.keyId);
      setLoading(false);
    } catch (error: any) {
      console.log('errorerror', error);
      if (error && error.errorMessage && error.errorMessage[0]) {
        toastAndroid(error.errorMessage[0], 'short', 'bottom');
      }
      Logger.debugLogger('error in handShake: ', error);

      setLoading(false);
    }
  };

  const onSubmit = async (): Promise<void> => {
    const keyId = await getAsyncStorage('text', keyStorage.KEY_ID);

    if (keyId) {
      if (keyId) {
        if (validation(mobile)) {
          const params: Partial<AuthorizeServiceInput> = {
            keyId,
            mobile,
            businessClientId: CLIENT_ID,
            scope: AUTHORIZE_SCOPE,
            ...(asBusiness && {loginAsUserId: businessId}),
          };

          onDismiss();

          await authorize(params);
        }
      } else {
        toastAndroid('مشکلی در ارتباط با سرور رخ داده است!', 'long', 'bottom');
      }
    } else {
      if (retryNumber < 2) {
        await handShake();
        setRetryNumber(retryNumber + 1);
      } else {
        setHandshakeError('خطا در دریافت handshake_key_id');
      }
    }
  };

  const validation = (value: string) => {
    if (!validNumberString(value)) {
      setError('شماره تلفن همراه خود را وارد نمایید!');
      return false;
    }

    if (value && value.length === 11) {
      if (asBusiness && businessId === '') {
        setBusinessError('شناسه کاربری شخص حقوقی را وارد نمایید!');
        return false;
      }
      if (asBusiness && businessId !== '') {
        setBusinessError(null);
        return true;
      }
      setBusinessError(null);
      setError(null);
      return true;
    }
    setError('شماره تلفن همراه خود را وارد نمایید!');
    return false;
  };

  const onChange = (value: string) => {
    setMobile(value);

    if (value !== '') {
      if (value.length < 11 || value.length > 11) {
        setError('شماره وارد شده باید ۱۱ رقمی باشد!');
      } else {
        setError(null);
      }
    } else {
      setError('شماره تلفن همراه خود را وارد نمایید!');
    }
  };

  const businessIdOnChange = (value: string) => {
    setBusinessId(value);

    if (value !== '') {
      setBusinessError(null);
    } else {
      setBusinessError('شناسه کاربری شخص حقوقی را وارد نمایید!');
    }
  };

  const onDismiss = () => Keyboard.dismiss();

  const authorize = async (params: Partial<AuthorizeServiceInput>) => {
    try {
      setLoading(true);

      const response = await podAuthorizeService(params);

      if (!response.data) return;
      await setAsyncStorage('text', keyStorage.MOBILE_NUMBER, mobile);

      // @ts-ignore
      await navigate(routesName.VERIFY, {
        loginData: response.data[0],
        asBusiness,
      });
      setLoading(false);
    } catch (error: any) {
      debugLogger('error in authorize: ', error);
      const notPermissionError =
        'You do not have permission to login as selected user';
      setLoading(false);

      if (error.errorMessage[0] === notPermissionError) {
        setApiError('شما اجازه ورود به عنوان کاربر انتخابی را ندارید');
      } else {
        setApiError(error.errorMessage[0]);
      }
    }
  };

  return (
    <>
      <StatusBar hidden={true} />
      <Image
        source={require('../../assets/img/auth_page_top_wave.png')}
        style={styles.topWaveImg}
      />
      <View style={styles.wrapper}>
        <AppLogoTitle />

        <View style={styles.form}>
          <Input
            onChangeText={(value: string) => onChange(value)}
            placeholder="تلفن همراه خود را وارد نمایید"
            label="تلفن همراه"
            error={errorInput}
            icon={<Image source={require('../../assets/img/phone_icon.png')} />}
            iconPosition="right"
            keyboardType="number-pad"
          />
          {asBusiness && (
            <Input
              onChangeText={(value: string) => businessIdOnChange(value)}
              placeholder="شناسه کاربری شخص حقوقی"
              error={businessError}
              keyboardType="number-pad"
            />
          )}
          <Checkbox
            label="ورود شخص حقوقی"
            error={null}
            type="success"
            value={asBusiness}
            onChange={() => setAsBusiness(!asBusiness)}
          />
          <Button
            title="ارسال کد"
            disabled={loading}
            loading={loading}
            onPress={onSubmit}
            type="success"
          />
          <Text style={styles.error}>{apiError}</Text>
          <Text style={[styles.error, {color: '#2a2a2a', textAlign: 'center'}]}>
            نسخه {toPersianDigits(APP_VERSION_STRING)}
          </Text>
        </View>
        {handshakeError && <Text style={styles.error}>{handshakeError}</Text>}
      </View>
      {/*<Image*/}
      {/*  source={require('../../assets/img/auth_page_bottom_wave.png')}*/}
      {/*  style={styles.bottomWaveImg}*/}
      {/*/>*/}
    </>
  );
};

export default Index;
