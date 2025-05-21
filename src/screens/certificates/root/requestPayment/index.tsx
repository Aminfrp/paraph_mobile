import React, {useContext, useEffect, useMemo, useState} from 'react';
import {StatusBar, ScrollView, Text} from 'react-native';
import Header from '../../../../components/header';
import BuyCertificateDetailsCard from '../../components/buyCertificateDetailsCard';
import BuyCertificateRequesterDetailsCard from '../../components/buyCertificateRequesterDetailsCard';
import CallSupportCard from '../../components/callSupportCard';
import Checkbox from '../../../../components/checkbox';
import Button from '../../../../components/button';
import styles from '../style';
import {useNavigation} from '@react-navigation/native';
import {RISHE_CERTIFICATE_PAYMENT} from '../../../../constants/routesName';
import {getAsyncStorage} from '../../../../helpers/asyncStorage';
import * as keyStorage from '../../../../constants/keyStorage';
import {toPersianDigits} from '../../../../helpers/convertNumber';
import {UserModel} from '../../../../model/user.model';
import {CertificateContext} from '../../../../context';
import {ProductInvoice} from '../../../../model/productInvoice.model';
import numberSeparator from '../../../../modules/converter/numberSeparator';

const Index: React.FC = props => {
  const {} = props;
  const {navigate} = useNavigation();
  const [userData, setUserData] = useState<UserModel | null>(null);
  const [isConfirm, setIsConfirm] = useState(false);
  const [isConfirmError, setIsConfirmError] = useState<string | null>(null);
  const {certificateState} = useContext<any>(CertificateContext);
  const risheProduct: ProductInvoice = certificateState?.risheProduct?.data;
  const risheCost =
    (risheProduct &&
      toPersianDigits(numberSeparator(`${risheProduct.price / 10}`))) ||
    '';

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

  const onNext = () => {
    if (isConfirm) {
      setIsConfirmError(null);

      // @ts-ignore
      navigate(RISHE_CERTIFICATE_PAYMENT);
    } else {
      setIsConfirmError('راهنما و شرایط خرید گواهی را تایید نمایید');
    }
  };

  const getCheckboxLabel = (): string => {
    return `اینجانب ${userData?.firstName} ${userData?.lastName}، اطلاعات فوق را تایید می‌کنم`;
  };

  const checkBoxLabel = useMemo(() => getCheckboxLabel(), [userData]);

  const onCheckBox = () => {
    setIsConfirm(!isConfirm);
    isConfirmError && setIsConfirmError(null);
  };

  return (
    <>
      <StatusBar />
      <Header title="خرید گواهی ریشه وزارت صمت" />
      <ScrollView contentContainerStyle={styles.wrapper}>
        <Text style={styles.textTitle}>بازبینی مشخصات</Text>
        <Text style={styles.text}>
          قبل از اقدام به خرید گواهی امضای ورازت صمت از درست بودن مشخصات خود
          اطمینان حاصل کنید.
        </Text>
        <BuyCertificateDetailsCard
          instruction="مرکز ریشه وزارت صمت"
          expiration="یکسال سال"
          cost={risheCost}
          description="ویژه امضای سفته"
        />
        <BuyCertificateRequesterDetailsCard
          firstName={userData?.firstName || ''}
          lastName={userData?.lastName || ''}
          phoneNumber={toPersianDigits(userData?.phone)}
          nationalCode={
            userData &&
            userData.nationalCode_verified &&
            toPersianDigits(userData.nationalCode_verified)
          }
        />
        <CallSupportCard />
        <Checkbox
          error={isConfirmError}
          type="success"
          value={isConfirm}
          onChange={onCheckBox}
          label={checkBoxLabel.toString()}
          disabled={false}
        />
        <Button type="success" title="مرحله بعد" onPress={onNext} />
      </ScrollView>
    </>
  );
};

export default Index;
