import React, {useCallback, useEffect, useState} from 'react';
import {StatusBar} from 'react-native';
import Header from '../../../../components/header';
import PaymentHistoryList from '../../components/paymentHistoryList';
import {useFocusEffect} from '@react-navigation/native';
import debugLogger from '../../../../helpers/debugLogger';
import {InvoiceModel} from '../../../../model/invoice.model';
import {getNamadInvoices} from '../../../../modules/certificate/namadCertificate';
import {getAsyncStorage} from '../../../../helpers/asyncStorage';
import * as keyStorage from '../../../../constants/keyStorage';
import {UserModel} from '../../../../model/user.model';
import {toPersianDigits} from '../../../../helpers/convertNumber';
import {CertificateTypeEnum} from '../../../../model/certificateType.enum';

const Index: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<InvoiceModel[]>([]);
  const [userData, setUserData] = useState<UserModel | null>(null);

  useFocusEffect(
    useCallback(() => {
      const handler = async () => await getActiveCertificate();
      handler().then(r => null);

      return () => {};
    }, []),
  );

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

  const getActiveCertificate = async () => {
    try {
      setLoading(true);
      const list: InvoiceModel[] = await getNamadInvoices(
        CertificateTypeEnum.namad,
        true,
      );

      setData(list);
      setLoading(false);
    } catch (error) {
      debugLogger('error in getActiveCertificate: ', error);
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar />
      <Header title="تاریخچه خرید گواهی نماد بانک مرکزی" />

      <PaymentHistoryList
        loading={loading}
        data={data}
        requester={userData?.firstName + ' ' + userData?.lastName || ''}
        phoneNumber={toPersianDigits(userData?.phone)}
        nationalCode={
          userData &&
          userData.nationalCode_verified &&
          toPersianDigits(userData.nationalCode_verified)
        }
        title=" تاریخچه خرید گواهی امضای نماد بانک مرکزی"
      />
    </>
  );
};

export default Index;
