import {useNavigation} from '@react-navigation/native';
import React, {useContext, useState} from 'react';
import {Image, ScrollView, StatusBar, View} from 'react-native';

import {
  authorizeService,
  checkRootCertificateServicesStabilityService,
  getPublicKeyService,
  getUserProfileService,
  ssoIdService,
  tokenService,
  verifyService,
} from '../../apis';
import AppLogoTitle from '../../components/appLogoTitle';
import {
  AUTHORIZE_SCOPE,
  CLIENT_ID,
  WE_POD_LEVEL_UP_LINK,
} from '../../config/APIConfig';
import * as keyStorage from '../../constants/keyStorage';
import * as routesName from '../../constants/routesName';
import {UserContext} from '../../context';
import {UserAction} from '../../context/actions';
import {getAsyncStorage, setAsyncStorage} from '../../helpers/asyncStorage';
import {toPersianDigits} from '../../helpers/convertNumber';
import debugLogger from '../../helpers/debugLogger';
import loadBrowserLink from '../../helpers/loadBrowserLink';
import {validNumberString} from '../../modules/validation/validation';
import EmptyView from './components/emptyView';
import Form from './components/form';
import LevelUpModalConfirm from './components/levelUpModalConfirm';
import MobileInformation from './components/mobileInformation';
import styles from './style';

const Index = props => {
  const {
    route: {
      params: {loginData, asBusiness},
    },
  } = props;
  const {goBack} = useNavigation();
  const {userDispatch} = useContext(UserContext);
  const {navigate} = useNavigation();
  const [code, setCode] = useState('');
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [isTimeEnded, setIsTimeEnded] = useState(false);
  const [userAuthData, setUserAuthData] = useState(loginData);
  const [userAuthorizeLoading, setUserAuthorizeLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState(null);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);

  const onSubmit = async _code => {
    let codeValue = code;

    if (typeof _code === 'string') {
      codeValue = _code;
    }
    const keyId = await getAsyncStorage('text', keyStorage.KEY_ID);
    if (validation(codeValue) && keyId && userAuthData?.identity) {
      const params = {
        keyId,
        otp: codeValue,
        mobile: userAuthData?.identity,
      };

      await onVerify(params);
    }
  };

  const validation = value => {
    if (!validNumberString(value)) {
      setVerifyError('کد تایید معتبر نمی باشد');
      return false;
    }
    if (userAuthData && userAuthData.codeLength) {
      return value && value.length === userAuthData.codeLength;
    }
    return value && value.length === 6;
  };

  const disableTimer = () => {
    setIsTimeEnded(true);
  };

  const editMobileNumber = async () => {
    await goBack();
    await setIsTimeEnded(false);
  };

  const onResendCode = async () => {
    const keyId = await getAsyncStorage('text', keyStorage.KEY_ID);
    setVerifyError(null);

    if (keyId) {
      await onUserAuthorize(keyId);
      setIsTimeEnded(false);
    }
  };

  const onUserAuthorize = async keyId => {
    try {
      setUserAuthorizeLoading(true);
      const params = {
        keyId,
        mobile: userAuthData?.identity,
        businessClientId: CLIENT_ID,
        scope: AUTHORIZE_SCOPE,
      };

      const response = await authorizeService(params);
      const data = response && response.data;
      await setAuthorizeData(data);
      setUserAuthorizeLoading(false);
    } catch (error) {
      debugLogger('error in onUserAuthorize: ', error);
      setUserAuthorizeLoading(false);
      return Promise.reject(error);
    }
  };

  const setAuthorizeData = async data => {
    await setUserAuthData(data);
    await setAsyncStorage('text', keyStorage.MOBILE_NUMBER, data?.identity);
  };

  const onVerify = async postData => {
    try {
      setVerifyLoading(true);
      const verifyResponse = await callVerifyService(postData);
      if (verifyResponse) {
        await setUserTokenData(verifyResponse);

        const ssoID = await getSSOId();
        if (ssoID) {
          await getUserPublicKey(ssoID);
          const podUserProfileInfo = await getPodUserProfile(ssoID);
          const podUserProfileForSaveToStore =
            normalizePodUserProfile(podUserProfileInfo);

          const hasBusiness = podUserProfileInfo?.hasBusiness;

          await setPodUserProfile(
            podUserProfileInfo,
            podUserProfileForSaveToStore,
            ssoID,
            hasBusiness,
          );

          const isCertificateStable = await isCertificateServicesStable();

          await onVerifySuccessful(isCertificateStable);
        }
      }
      setVerifyLoading(false);
    } catch (error) {
      debugLogger('error in onVerify: ', error);
      setVerifyLoading(false);

      if (error.errorMessage) {
        setVerifyError(error.errorMessage[0]);
      }

      return Promise.reject(error);
    }
  };

  const callVerifyService = async postData => {
    try {
      const response = await verifyService(postData);
      if (!response.data) return;

      return Promise.resolve(response.data);
    } catch (error) {
      debugLogger('error in callVerifyService: ', error);
      return Promise.reject(error);
    }
  };

  const getUserToken = async postData => {
    try {
      const response = await tokenService(postData);

      const data = response && response.data;
      return Promise.resolve(data[0]);
    } catch (error) {
      debugLogger('error in getUserToken:', error);
      return Promise.reject(error);
    }
  };

  const setUserTokenData = async tokenResponse => {
    try {
      await setAsyncStorage(
        'text',
        keyStorage.ACCESS_TOKEN,
        tokenResponse.access_token,
      );

      await setAsyncStorage(
        'text',
        keyStorage.REFRESH_TOKEN,
        tokenResponse.refresh_token,
      );

      await setAsyncStorage('object', keyStorage.EXPIRES_TOKEN_TIME, {
        data: tokenResponse.expires_in,
        date: new Date().getTime(),
      });
      return Promise.resolve(true);
    } catch (error) {
      debugLogger('error in getUserToken:', error);
      return Promise.reject(error);
    }
  };

  const getSSOId = async () => {
    try {
      const response = await ssoIdService();
      const data = response && response.data;

      return Promise.resolve(data.id);
    } catch (error) {
      debugLogger('error in getSSOId:', error);
      return Promise.reject(error);
    }
  };

  const getUserPublicKey = async ssoId => {
    try {
      const response = await getPublicKeyService({ssoId});
      const data = response && response.data;

      return Promise.resolve(data);
    } catch (error) {
      debugLogger('error in getUserPublicKey:', error);
      return Promise.reject(error);
    }
  };

  const getPodUserProfile = async id => {
    try {
      const response = await getUserProfileService();
      const contactData = response && response.data.result;
      return Promise.resolve(contactData);
    } catch (error) {
      debugLogger('error in getPodUserProfile: ', error);
      return Promise.reject(error);
    }
  };

  const normalizePodUserProfile = contactData => {
    const userData = {
      link: '',
      info: '',
      financialLevelSrv: null,
    };
    if (contactData) {
      userData.financialLevelSrv = contactData.financialLevelSrv;
      if (contactData.firstName && contactData.lastName) {
        userData.info = `${contactData.firstName} ${contactData.lastName}`;
      } else if (contactData.username) {
        userData.info = `${contactData.username}`;
      }

      if (contactData.profileImage) {
        userData.link = `${contactData.profileImage}`;
      } else {
        userData.link =
          'https://podspace.pod.ir/api/files/SIETJDA2BR17GAA9?authorization=df5b769eb7b047b2b0b1c6dff1863121';
      }
    }
    return userData;
  };

  const setPodUserProfile = async (contactData, userData, id, hasBusiness) => {
    if (userData) {
      if (!asBusiness) {
        if (userData.financialLevelSrv?.value >= 4) {
          await setAsyncStorage('object', keyStorage.CONTACT_INFO, {
            ...contactData,
            id,
          });
        } else {
          !asBusiness && toggleLevelUpModal();
          return Promise.reject({
            errorMessage: ['جهت استفاده از پاراف ابتدا باید احرازهویت کنید.'],
          });
        }
      } else {
        await setAsyncStorage('object', keyStorage.CONTACT_INFO, {
          ...contactData,
          id,
          asBusiness: hasBusiness,
        });

        await userDispatch(UserAction.loginUserAsBusiness(true));
      }
    } else {
      return Promise.reject({
        errorMessage: ['اطلاعات پادی شما یافت نشد'],
      });
    }
  };

  const toggleLevelUpModal = () => setShowLevelUpModal(!showLevelUpModal);

  const levelUp = () => {
    loadBrowserLink(WE_POD_LEVEL_UP_LINK);
    navigate(routesName.LOGIN);
  };

  const onVerifySuccessful = async isCertificateStable => {
    if (!asBusiness && isCertificateStable) {
      // try {
      //   const certificate = await readCertificateFile();
      //   if (!certificate) navigate(routesName.CERTIFICATE);
      // } catch (error) {
      //   navigate(routesName.CERTIFICATE);
      //   debugLogger('error in onVerifySuccessful: ', error);
      // }
    }

    await userDispatch(UserAction.toggleUserIsAuthenticate(true));
  };

  const isCertificateServicesStable = async () => {
    try {
      const response = await checkRootCertificateServicesStabilityService();
      const data = response && response.data;
      return Promise.resolve(data);
    } catch (error) {
      debugLogger('error in isCertificateServicesStable: ', error);
      return Promise.reject(error);
    }
  };

  const onCloseLevelUpModal = () => {
    toggleLevelUpModal();
    navigate(routesName.LOGIN);
  };

  return (
    <>
      <StatusBar hidden={true} />

      <Image
        source={require('../../assets/img/auth_page_top_wave.png')}
        style={styles.topWaveImg}
      />
      <View style={styles.wrapper}>
        <ScrollView>
          <View style={{paddingVertical: 20, paddingHorizontal: 12}}>
            <View>{isFormDisabled ? <EmptyView /> : <AppLogoTitle />}</View>
            <MobileInformation
              phoneNumber={
                userAuthData &&
                userAuthData.identity &&
                toPersianDigits(userAuthData.identity)
              }
              disabled={isFormDisabled}
            />
            <Form
              pin={code}
              setPin={setCode}
              disabled={isFormDisabled}
              onResendCode={onResendCode}
              onSubmit={onSubmit}
              pinCount={userAuthData && userAuthData.codeLength}
              expiresIn={userAuthData && userAuthData.expires_in}
              disableTimer={disableTimer}
              loading={verifyLoading}
              editMobileNumber={editMobileNumber}
              isTimeEnded={isTimeEnded}
              onResendCodeLoading={userAuthorizeLoading}
              error={verifyError}
            />
          </View>
        </ScrollView>
      </View>
      <LevelUpModalConfirm
        visible={showLevelUpModal}
        onClose={onCloseLevelUpModal}
        description="جهت استفاده از پاراف ابتدا باید احرازهویت کنید. برای آغاز فرایند احرازهویت، کلیک کنید."
        onConfirm={levelUp}
      />
    </>
  );
};

export default Index;
