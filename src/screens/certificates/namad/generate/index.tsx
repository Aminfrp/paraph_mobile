import React, {useState} from 'react';
import {StatusBar, ScrollView, Text} from 'react-native';
import Header from '../../../../components/header';
import Button from '../../../../components/button';
import styles from '../style';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import UserDataForm from '../../components/userDataForm';
import CertificatePasswordForm from '../../components/certificatePasswordForm';
import ImportantPointAboutPasswordCard from '../../components/importantPointAboutPasswordCard';
import {
  isAddressValid,
  isEmail,
  isEnglishCharacter,
} from '../../../../modules/validation/validation';
import * as routesName from '../../../../constants/routesName';
import {Logger} from '../../../../modules/log/logger';
import {namadGenerate} from '../../../../modules/certificate/namadCertificate';
import getLoggedInUserSSOID from '../../../../helpers/getLoggedInUserSSOID';
import {NamadGenerateInputModel} from '../../../../model/namadGenerateInput.model';
import {FieldErrors} from './fieldErrros.model';

const Index: React.FC = () => {
  const {navigate} = useNavigation();
  const {params} = useRoute<RouteProp<any>>();
  const keyId = params && params.keyId;

  const [isPassword, setIsPassword] = useState<boolean>(true);
  const [password, setPassword] = useState<string>('');
  const [repeatPassword, setRepeatPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<boolean>(true);
  const [repeatPasswordError, setRepeatPasswordError] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [emailError, setEmailError] = useState<null | string>(null);
  const [addressError, setAddressError] = useState<null | string>(null);
  const [generateLoading, setGenerateLoading] = useState<boolean>(false);

  const onPasswordSet = (): void => {
    if (passwordValidation()) {
      setIsPassword(false);
      setPasswordError(false);
      setRepeatPasswordError(false);
    }
  };

  const onPasswordChange = (_password: string): void => {
    setPassword(_password);
    if (_password.length < 4) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
    setRepeatPassword('');
    setRepeatPasswordError(true);
  };

  const onRepeatPasswordChange = (value: string): void => {
    setRepeatPassword(value);
    if (value === password) {
      setRepeatPasswordError(false);
    } else {
      setRepeatPasswordError(true);
    }
  };

  const passwordValidation = () => {
    if (password === '') {
      setPasswordError(true);
      return false;
    }
    if (repeatPassword === '') {
      setRepeatPasswordError(true);
      return false;
    }
    if (password !== repeatPassword) {
      setRepeatPasswordError(true);
      return false;
    }

    if (password.length < 4) {
      setPasswordError(true);
      setRepeatPasswordError(true);
      return false;
    }

    return true;
  };

  const onEmail = (value: string): void => {
    setEmail(value);
    if (isEmail(value)) {
      setEmailError(null);
    } else {
      setEmailError(FieldErrors.notEmailValid);
    }
  };

  const onAddress = (value: string): void => {
    setAddress(value);
    if (isAddressValid(value)) {
      setAddressError(null);
    } else {
      setAddressError(FieldErrors.notAddressValid);
    }
  };

  const userFieldsValidation = (): boolean => {
    let isValid: boolean = true;

    if (address === '') {
      setAddressError(FieldErrors.writeAddress);
      isValid = false;
    }
    if (email === '') {
      setEmailError(FieldErrors.writeEmail);
      isValid = false;
    }
    if (!isAddressValid(address)) {
      setAddressError(FieldErrors.notAddressValid);
      isValid = false;
    }
    if (!isEmail(email)) {
      setEmailError(FieldErrors.notEmailValid);
      isValid = false;
    }

    return isValid;
  };

  const onGenerate = async () => {
    try {
      setGenerateLoading(true);
      if (userFieldsValidation()) {
        const ssoId: number = await getLoggedInUserSSOID();

        const params: NamadGenerateInputModel = {
          keyId,
          address,
          email,
        };

        const isSucceeded = await namadGenerate(params, password, ssoId);
        if (isSucceeded) {
          // @ts-ignore
          navigate(routesName.NAMAD_CERTIFICATE_GENERATE_STATUS, {
            payload: true,
            keyId,
          });
        } else {
          // @ts-ignore
          navigate(routesName.NAMAD_CERTIFICATE_GENERATE_STATUS, {
            payload: false,
            keyId,
          });
          setIsPassword(true);
        }
      }
      setGenerateLoading(false);
    } catch (error) {
      Logger.debugLogger('error in onGenerate: ', error);

      setGenerateLoading(false);
      // @ts-ignore
      navigate(routesName.NAMAD_CERTIFICATE_GENERATE_STATUS, {
        payload: false,
        keyId,
      });
      setIsPassword(true);
    }
  };

  return (
    <>
      <StatusBar />
      <Header
        title="صدور گواهی امضای نماد بانک مرکزی"
        onPress={!isPassword ? () => setIsPassword(true) : () => {}}
      />
      <ScrollView contentContainerStyle={styles.wrapper}>
        {isPassword ? (
          <>
            <Text style={styles.textTitle}>
              تعیین رمز گواهی امضای نماد بانک مرکزی
            </Text>
            <Text style={styles.text}>
              یک رمز که حداقل شامل 4 عدد باشد برای گواهی امضا خود مشخص کنید.
            </Text>
            <CertificatePasswordForm
              value={password}
              setValue={onPasswordChange}
              repeatValue={repeatPassword}
              onRepeatValue={onRepeatPasswordChange}
              passwordError={passwordError}
              repeatPasswordError={repeatPasswordError}
            />
            <ImportantPointAboutPasswordCard />
            <Button type="success" title="مرحله بعد" onPress={onPasswordSet} />
          </>
        ) : (
          <>
            <Text style={styles.textTitle}>تکمیل مشخصات متقاضی</Text>
            <Text style={styles.text}>
              برای صدور گواهی امضای بانک مرکزی فیلدهای زیر را کامل کنید، دقت
              کنید حتما نام و نام خانوادگی شما به انگلیسی وارد شود.
            </Text>
            <UserDataForm
              address={address}
              onAddress={onAddress}
              addressError={addressError}
              email={email}
              emailError={emailError}
              onEmail={onEmail}
              showEmail={true}
              isFullName={false}
              loading={generateLoading}
            />
            <Button
              type="success"
              title="دریافت گواهی امضا"
              onPress={onGenerate}
              loading={generateLoading}
              disabled={generateLoading}
            />
          </>
        )}
      </ScrollView>
    </>
  );
};

export default Index;
