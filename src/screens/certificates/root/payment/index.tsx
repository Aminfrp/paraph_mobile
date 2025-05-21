import React, {useContext, useState} from 'react';
import {ScrollView, StatusBar, Text, View} from 'react-native';
import Button from '../../../../components/button';
import Header from '../../../../components/header';
import {CertificateContext} from '../../../../context';
import {toPersianDigits} from '../../../../helpers/convertNumber';
import {ProductInvoice} from '../../../../model/productInvoice.model';
import {buyRisheCertificate} from '../../../../modules/certificate/rishe';
import numberSeparator from '../../../../modules/converter/numberSeparator';
import {Logger} from '../../../../modules/log/logger';
import BuyPaymentDetailsCard from '../../components/buyPaymentDetailsCard';
import ImportantPointsBeforePaymentCard from '../../components/importantPointsBeforePaymentCard';
import styles from '../style';

const Index: React.FC = () => {
  const {certificateDispatch} = useContext<any>(CertificateContext);

  const [loading, setLoading] = useState<boolean>(false);
  const {certificateState} = useContext<any>(CertificateContext);
  const risheProduct: ProductInvoice = certificateState?.risheProduct?.data;
  const risheCost =
    (risheProduct &&
      toPersianDigits(numberSeparator(`${risheProduct.price / 10}`))) ||
    '';
  const certificateInOtherDevice =
    certificateState?.risheProduct?.certificateInOtherDevice;

  const onPay = async (): Promise<void> => {
    try {
      setLoading(true);

      // if (certificateInOtherDevice) {
      //   if (certificateInOtherDevice && certificateInOtherDevice.isActive) {
      //     // await revokeAllRisheCertificate(certificateInOtherDevice.invoice);
      //     certificateDispatch(
      //       CertificateAction.setIsRisheCertificateInOtherDevice({
      //         invoice: undefined,
      //         isActive: false,
      //       }),
      //     );
      //   }
      // }
      await buyRisheCertificate();

      setLoading(false);
    } catch (error) {
      Logger.debugLogger('error in onPay: ', error);
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar />
      <Header title="خرید گواهی ریشه وزارت صمت" />
      <ScrollView contentContainerStyle={styles.wrapper}>
        <Text style={styles.textTitle}>مشخصات پرداخت</Text>
        <Text style={styles.text}>
          جزییات پرداخت را می‌توانید در جدول زیر مشاهده کنید.
        </Text>
        <BuyPaymentDetailsCard cost={risheCost} />
        <ImportantPointsBeforePaymentCard />
        <View style={styles.paymentFooter}>
          <View style={{width: '50%'}}>
            <Button
              type="success"
              title="پرداخت"
              onPress={onPay}
              loading={loading}
            />
          </View>
          <View>
            <Text style={[styles.text, {marginTop: 0}]}>مبلغ قابل پرداخت:</Text>
            <Text style={[styles.textTitle, {marginTop: 5}]}>
              {risheCost} تومان
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default Index;
