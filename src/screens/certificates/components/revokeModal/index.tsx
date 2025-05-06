import React, {useEffect, useRef, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import Button from '../../../../components/button';
import Input from '../../../../components/input';
import RbSheet from '../../../../components/rbSheet';
import * as keyStorage from '../../../../constants/keyStorage.ts';
import {getAsyncStorage} from '../../../../helpers/asyncStorage';
import {isCertificateExist} from "../../../../modules/certificate/rishe/certificate";

type PasswordFiledPropsModel = {
  loading: boolean;
  show: boolean;
  onClose: () => void;
  onRevoke: (password: string) => void;
};

type ConditionPropsModel = {
  loading: boolean;
  show: boolean;
  onClose: () => void;
  onRevoke: () => void;
};

type ModalPropsModel = {
  onClose: () => void;
  show: boolean;
  isSuccess: boolean;
  message?: string;
};

type RevokeModalPropsModel = {
  loading: boolean;
  show: boolean;
  onClose: () => void;
  onRevoke: (password: string) => Promise<void>;
};

const PasswordFiledSheet: React.FC<PasswordFiledPropsModel> = props => {
  const {loading, show, onClose, onRevoke} = props;
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const refRBSheet = useRef();

  const onPasswordChange = (_pass: string) => {
    if (passwordError) {
      setPasswordError(null);
    }
    setPassword(_pass);
  };

  const revokeHandler = () => {
    if (password && password !== '') {
      return onRevoke(password);
    }
    setPasswordError('لطفا رمز خود را وارد نمایید');
  };

  return (
    <View>
      <RbSheet
        ref={refRBSheet}
        disabled={true}
        height={380}
        visible={show}
        onClose={onClose}
        closeOnPressBack={false}
        closeOnDragDown={false}
        closeOnPressMask={false}>
        <View style={{padding: 10}}>
          <Text
            style={[
              styles.titleText,
              {
                textAlign: 'center',
                borderColor: '#EBECF0',
                borderBottomWidth: 1,
              },
            ]}>
            ابطال گواهی امضاء دیجیتال
          </Text>

          <Text style={[styles.titleText, {fontSize: 18, borderWidth: 0}]}>
            وارد کردن رمز عبور
          </Text>

          <Text style={[styles.text]}>
            برای ابطال گواهی امضای دیجیتال خود، رمز عبوری که موقع صدور گواهی
            تعیین کرده‌اید را وارد کنید
          </Text>

          <View style={{paddingHorizontal: 10}}>
            <Input
              onChangeText={(value: string) => onPasswordChange(value)}
              label="رمز عبور"
              error={passwordError}
              keyboardType="number-pad"
              placeholder="رمز عبور گواهی امضای خود را بنویسید"
              size="sm"
              textHidden={true}
            />

            <View style={styles.btnGroupWrapper}>
              <View style={styles.btnWrapper}>
                <Button
                  title="تایید"
                  type="success"
                  onPress={revokeHandler}
                  loading={loading}
                  disabled={loading}
                />
              </View>
              <View style={styles.btnWrapper}>
                <Button
                  title="انصراف"
                  type="white-outline"
                  onPress={onClose}
                  loading={false}
                  disabled={loading}
                />
              </View>
            </View>
          </View>
        </View>
      </RbSheet>
    </View>
  );
};

const RevokedStatusSheet: React.FC<ModalPropsModel> = props => {
  const {show, onClose, isSuccess, message} = props;
  const refRBSheet = useRef();

  return (
    <View>
      <RbSheet
        ref={refRBSheet}
        disabled={true}
        height={220}
        visible={show}
        onClose={onClose}
        closeOnPressBack={false}
        closeOnDragDown={false}
        closeOnPressMask={false}>
        <View style={{padding: 10}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginVertical: 10,
            }}>
            {isSuccess ? (
              <Image
                source={require('../../../../assets/img/certificate-success.png')}
                resizeMethod="resize"
              />
            ) : (
              <Image
                source={require('../../../../assets/img/certificate-reject.png')}
                resizeMethod="resize"
              />
            )}
          </View>

          {isSuccess ? (
            <Text
              style={[
                styles.titleText,
                {
                  textAlign: 'center',
                  color: '#1AC48B',
                  borderBottomWidth: 0,
                },
              ]}>
              گواهی امضا شما باطل شد
            </Text>
          ) : (
            <Text
              style={[
                styles.titleText,
                {
                  textAlign: 'center',
                  color: '#D20F29',
                  borderBottomWidth: 0,
                },
              ]}>
              {message !== '' ? message : 'ابطال گواهی با خطا مواجه شد!'}
            </Text>
          )}
          <View style={{paddingHorizontal: 10}}>
            <Button title="متوجه شدم!" type="success" onPress={onClose} />
          </View>
        </View>
      </RbSheet>
    </View>
  );
};

const RevokeConditionsSheet: React.FC<ConditionPropsModel> = props => {
  const {loading, show, onClose, onRevoke} = props;
  const refRBSheet = useRef();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    setUserInfoHandler();
  }, []);

  const setUserInfoHandler = async () => {
    const userContactInfo = await getAsyncStorage(
      'object',
      keyStorage.CONTACT_INFO,
    );
    setUserInfo(userContactInfo);
  };

  const getSignerName = () => {
    // @ts-ignore
    return userInfo?.firstName + ' ' + userInfo?.lastName;
  };

  return (
    <View>
      <RbSheet
        ref={refRBSheet}
        disabled={true}
        height={440}
        visible={show}
        onClose={onClose}
        closeOnPressBack={false}
        closeOnDragDown={false}
        closeOnPressMask={false}>
        <View style={{padding: 10}}>
          <Text
            style={[
              styles.titleText,
              {
                textAlign: 'center',
                borderColor: '#EBECF0',
                borderBottomWidth: 1,
              },
            ]}>
            ابطال گواهی امضاء دیجیتال
          </Text>

          <Text style={[styles.titleText, {fontSize: 18, borderWidth: 0}]}>
            شرایط ابطال گواهی امضاء دیجیتال
          </Text>

          <Text style={[styles.text]}>
            در صورت ابطال گواهی امضاء دیجیتال، امکان استفاده از آن از دست خواهد
            رفت.
          </Text>
          <Text style={[styles.text]}>
            پس از ابطال گواهی امضاء دیجیتال، در صورت نیاز به امضای سند با آن،
            لازم است دوباره گواهی امضاء دیجیتال خریداری کنید.
          </Text>

          <View style={styles.infoWrapper}>
            <View style={styles.infoTextWrapper}>
              <View style={{width: '7%'}}>
                <Image
                  source={require('../../../../assets/img/png/info-circle-white.png')}
                  resizeMode="contain"
                  style={styles.infoIcon}
                />
              </View>
              <View style={{width: '92%'}}>
                <Text style={styles.text}>
                  اینجانب {getSignerName()}، با آگاهی و پذیرش شرایط ابطال گواهی
                  امضای دیجیتال، درخواست ابطال گواهی امضای دیجیتال خود را دارم.
                </Text>
              </View>
            </View>
          </View>

          <View style={{paddingHorizontal: 10}}>
            <View style={styles.btnGroupWrapper}>
              <View style={styles.btnWrapper}>
                <Button
                  title="ابطال گواهی امضاء"
                  type="danger"
                  onPress={onRevoke}
                  loading={loading}
                  disabled={loading}
                />
              </View>
              <View style={styles.btnWrapper}>
                <Button
                  title="انصراف"
                  type="white-outline"
                  onPress={onClose}
                  loading={false}
                  disabled={loading}
                />
              </View>
            </View>
          </View>
        </View>
      </RbSheet>
    </View>
  );
};

const Index: React.FC<RevokeModalPropsModel> = props => {
  const {loading, show, onClose, onRevoke} = props;
  const [step, setStep] = useState('CONDITIONS'); // CONDITIONS | PASSWORD | STATUS ? STATUS-FAILED
  const [statusMessage, setStatusMessage] = useState<string>('');

  const closeHandler = () => {
    setStep('CONDITIONS');
    setStatusMessage('');
    onClose();
  };

  const revokeHandler = async (password: string) => {
    try {
      await onRevoke(password);

      setStep('STATUS-SUCCESS');
      setStatusMessage('');
    } catch (error: any) {
      setStep('STATUS-FAILED');
      error.error_description && setStatusMessage(error.error_description);
    }
  };

  if (step === 'CONDITIONS')
    return (
      <RevokeConditionsSheet
        loading={loading}
        show={show}
        onClose={closeHandler}
        onRevoke={() => {
          // isCertificateExist()
          setStep('PASSWORD')
        }}
      />
    );

  if (step === 'PASSWORD')
    return (
      <PasswordFiledSheet
        loading={loading}
        show={show}
        onClose={closeHandler}
        onRevoke={revokeHandler}
      />
    );

  if (step === 'STATUS-SUCCESS')
    return (
      <RevokedStatusSheet show={show} onClose={closeHandler} isSuccess={true} />
    );

  if (step === 'STATUS-FAILED')
    return (
      <RevokedStatusSheet
        show={show}
        onClose={closeHandler}
        isSuccess={false}
        message={statusMessage}
      />
    );

  return <></>;
};

const styles = StyleSheet.create({
  text: {
    color: '#253858',
    fontSize: 14,
    fontFamily: 'YekanBakh-Bold',
    marginVertical: 4,
  },
  titleText: {
    color: '#00091A',
    fontSize: 22,
    fontFamily: 'YekanBakh-Bold',
    marginVertical: 10,
    paddingBottom: 10,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    gap: 8,
  },
  validationIcon: {
    width: 22,
    height: 22,
  },
  btnGroupWrapper: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
  },
  btnWrapper: {
    width: '50%',
  },

  infoWrapper: {
    borderRadius: 10,
    marginVertical: 20,
    padding: 10,
    backgroundColor: '#FFFBE6',
  },
  infoTextWrapper: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  infoIcon: {
    width: 25,
    height: 25,
  },

  infoTextHeader: {
    color: '#00091A',
    fontSize: 18,
    fontFamily: 'YekanBakh-Bold',
  },
});

export default Index;
