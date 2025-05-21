import React, {useCallback, useEffect, useState} from 'react';
import {StatusBar} from 'react-native';
import Header from '../../../../components/header';
import PaymentHistoryList from '../../components/paymentHistoryList';
import {useFocusEffect} from '@react-navigation/native';
import {InvoiceModel} from '../../../../model/invoice.model';
import {getAsyncStorage} from '../../../../helpers/asyncStorage';
import * as keyStorage from '../../../../constants/keyStorage';
import {UserModel} from '../../../../model/user.model';
import {toPersianDigits} from '../../../../helpers/convertNumber';
import {Logger} from '../../../../modules/log/logger';
import {getRisheInvoices} from '../../../../modules/certificate/rishe';
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
      const list: InvoiceModel[] = await getRisheInvoices(
        CertificateTypeEnum.rishe,
        true,
      );

      setData(list);
      setLoading(false);
    } catch (error) {
      Logger.debugLogger('error in getActiveCertificate: ', error);
      setLoading(false);
    }
  };

  const loadMoreData = () => {};

  return (
    <>
      <StatusBar />
      <Header title="تاریخچه خرید گواهی ریشه ورازت صمت" />

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
        title=" تاریخچه خرید گواهی امضای ریشه وزارت صمت"
      />
    </>
  );
};

export default Index;
