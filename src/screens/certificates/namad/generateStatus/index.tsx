import React, {useEffect, useState} from 'react';
import {StatusBar, ScrollView, Text, View, Image} from 'react-native';
import Button from '../../../../components/button';
import styles from '../style';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import CertificateGenerateStatusCard from '../../components/certificateGenerateStatusCard';
import {
  APP,
  NAMAD_CERTIFICATE_GENERATE,
} from '../../../../constants/routesName';
import {UserModel} from '../../../../model/user.model';
import {getAsyncStorage} from '../../../../helpers/asyncStorage';
import * as keyStorage from '../../../../constants/keyStorage';
import {toPersianDigits} from '../../../../helpers/convertNumber';

const Index: React.FC = () => {
  const {navigate, goBack} = useNavigation();
  const {params} = useRoute<RouteProp<any>>();
  const keyId = params?.keyId;
  const status = params?.payload;
  const [userData, setUserData] = useState<UserModel | null>(null);

  useEffect(() => {
    userDataInitializer().then(r => {});

    return () => {};
  }, []);

  const userDataInitializer = async () => {
    const userInfo = await getAsyncStorage('object', keyStorage.CONTACT_INFO);
    const phone = await getAsyncStorage('text', keyStorage.MOBILE_NUMBER);
    setUserData({
      ...userInfo,
      phone,
    });
  };

  // @ts-ignore
  const onBack = () => navigate(APP, {keyId});

  // @ts-ignore
  const onRetry = () => navigate(NAMAD_CERTIFICATE_GENERATE, {keyId});

  return (
    <>
      <StatusBar />
      <ScrollView contentContainerStyle={styles.wrapper}>
        <View style={styles.card}>
          {status ? (
            <Image
              source={require('../../../../assets/img/certificate-success.png')}
              style={{
                width: 112,
                height: 112,
              }}
            />
          ) : (
            <Image
              source={require('../../../../assets/img/png/Certificate.png')}
              style={{
                width: 112,
                height: 112,
              }}
            />
          )}

          <Text
            style={[styles.textTitle, {color: status ? '#1AC48B' : '#FF4D4F'}]}>
            {status
              ? 'گواهی امضا شما با موفقیت صادر شد'
              : 'دریافت گواهی امضا شما با خطا مواجه شد'}
          </Text>

          <Text style={[styles.text, {textAlign: 'center'}]}>
            {status
              ? 'جزییات مربوط به گواهی امضای شما در بخش گواهی های امضا دیجیتال در دسترس است'
              : ' پرداخت شما با موفقیت انجام شد. لطفا در ساعاتی دیگر مجددا تلاش کنید'}
          </Text>
        </View>
        <CertificateGenerateStatusCard
          isSuccess={status}
          status={status ? 'فعال' : 'دریافت نشده'}
          initiator="بانک مرکزی"
          expirationDate={'*'}
          requester={userData?.firstName + ' ' + userData?.lastName || ''}
          phoneNumber={toPersianDigits(userData?.phone)}
          nationalCode={
            userData &&
            userData.nationalCode_verified &&
            toPersianDigits(userData.nationalCode_verified)
          }
        />
        <View style={[{width: '100%', marginTop: 20}]}>
          {status ? (
            <Button
              title="بازگشت به صفحه اصلی"
              type="success"
              onPress={onBack}
              loading={false}
              disabled={false}
            />
          ) : (
            <>
              <Button
                title="بازگشت به صفحه اصلی"
                type="success"
                onPress={onBack}
                loading={false}
                disabled={false}
              />
            </>
          )}
        </View>
      </ScrollView>
    </>
  );
};

export default Index;
