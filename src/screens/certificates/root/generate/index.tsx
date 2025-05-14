import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  ScrollView,
  StatusBar,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import Button from '../../../../components/button';
import Header from '../../../../components/header';
import * as routesName from '../../../../constants/routesName';
import getLoggedInUserSSOID from '../../../../helpers/getLoggedInUserSSOID';
import {RisheGenerateInputModel} from '../../../../model/risheGenerateInput.model';
import {risheGenerate} from '../../../../modules/certificate/rishe';
import {Logger} from '../../../../modules/log/logger';
import {isEnglishCharacter} from '../../../../modules/validation/validation';
import CertificatePasswordForm from '../../components/certificatePasswordForm';
import ImportantPointAboutPasswordCard from '../../components/importantPointAboutPasswordCard';
import UserDataForm from '../../components/userDataForm';
import styles from '../style';
import {FieldErrors} from './fieldErrros.model';
import Modal from '../../../../components/modal';
import colors from '../../../../assets/theme/colors';

const Index: React.FC = () => {
  const {navigate} = useNavigation();
  const {params} = useRoute<RouteProp<any>>();
  const keyId = params && params.keyId;

  const [isPassword, setIsPassword] = useState<boolean>(true);
  const [password, setPassword] = useState<string>('');
  const [repeatPassword, setRepeatPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<boolean>(true);
  const [repeatPasswordError, setRepeatPasswordError] = useState<boolean>(true);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [firstNameError, setFirstNameError] = useState<null | string>(null);
  const [lastNameError, setLastNameError] = useState<null | string>(null);
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

  const onFirstName = (value: string): void => {
    setFirstName(value);
    if (isEnglishCharacter(value)) {
      setFirstNameError(null);
    } else {
      setFirstNameError(FieldErrors.justEnglishChar);
    }
  };

  const onLastName = (value: string): void => {
    setLastName(value);
    if (isEnglishCharacter(value)) {
      setLastNameError(null);
    } else {
      setLastNameError(FieldErrors.justEnglishChar);
    }
  };

  const userFieldsValidation = (): boolean => {
    let isValid: boolean = true;
    if (firstName === '') {
      setFirstNameError(FieldErrors.writeFirstName);
      isValid = false;
    }
    if (lastName === '') {
      setLastNameError(FieldErrors.writeLastName);
      isValid = false;
    }

    if (!isEnglishCharacter(firstName)) {
      setFirstNameError(FieldErrors.justEnglishChar);
      isValid = false;
    }
    if (!isEnglishCharacter(lastName)) {
      setLastNameError(FieldErrors.justEnglishChar);
      isValid = false;
    }

    return isValid;
  };

  const onGenerate = async () => {
    try {
      setGenerateLoading(true);
      if (userFieldsValidation()) {
        const ssoId: number = await getLoggedInUserSSOID();
        const params: RisheGenerateInputModel = {
          keyId,
          latinName: firstName,
          latinLastName: lastName,
          province: 'Tehran',
        };
        const isSucceeded = await risheGenerate(params, password, ssoId);
        if (isSucceeded) {
          // @ts-ignore
          navigate(routesName.RISHE_CERTIFICATE_GENERATE_STATUS, {
            payload: true,
            keyId,
          });
        } else {
          // @ts-ignore
          navigate(routesName.RISHE_CERTIFICATE_GENERATE_STATUS, {
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
      navigate(routesName.RISHE_CERTIFICATE_GENERATE_STATUS, {
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
        title="صدور گواهی ریشه وزارت صمت"
        onPress={!isPassword ? () => setIsPassword(true) : () => {}}
      />
      <ScrollView contentContainerStyle={styles.wrapper}>
        {isPassword ? (
          <>
            <Text style={styles.textTitle}>
              تعیین رمز گواهی امضای ریشه وزارت صمت
            </Text>
            <Text style={styles.text}>
              یک رمز که حداقل شامل 4 حرف باشد برای گواهی امضا خود مشخص کنید.
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
              برای صدور گواهی امضای ریشه وزارت صمت فیلدهای زیر را کامل کنید، دقت
              کنید حتما نام و نام خانوادگی شما به انگلیسی وارد شود.
            </Text>
            <UserDataForm
              firstName={firstName}
              lastName={lastName}
              onFirstName={onFirstName}
              onLastName={onLastName}
              firstNameError={firstNameError}
              lastNameError={lastNameError}
              loading={false}
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
        <Modal
          visible={generateLoading}
          onRequestClose={() => {}}
          title={'صدور گواهی ریشه'}>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{fontFamily: 'YekanBakh-Bold'}}>
              گواهی ریشه در حال صدور می باشد لطفا منتظر بمانید.
            </Text>
            <ActivityIndicator
              size="large"
              color={colors.primary.success}
              style={{padding: 20}}
            />
          </View>
        </Modal>
      </ScrollView>
    </>
  );
};

export default Index;
