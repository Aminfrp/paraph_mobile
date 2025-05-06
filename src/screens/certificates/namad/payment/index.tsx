import React, {useContext, useState} from 'react';
import {StatusBar, ScrollView, Text, View} from 'react-native';
import Header from '../../../../components/header';
import Button from '../../../../components/button';
import BuyPaymentDetailsCard from '../../components/buyPaymentDetailsCard';
import ImportantPointsBeforePaymentCard from '../../components/importantPointsBeforePaymentCard';
import {Logger} from '../../../../modules/log/logger';
import styles from '../style';
import {
  buyNamadCertificate,
  revokeAllNamadCertificate,
} from '../../../../modules/certificate/namadCertificate';
import {CertificateContext} from '../../../../context';
import {ProductInvoice} from '../../../../model/productInvoice.model';
import {toPersianDigits} from '../../../../helpers/convertNumber';
import numberSeparator from '../../../../modules/converter/numberSeparator';
import {CertificateAction} from '../../../../context/actions';

type PaymentScreenPropsModel = {};

const Index: React.FC<PaymentScreenPropsModel> = (
  props: PaymentScreenPropsModel,
) => {
  const {} = props;
  const {certificateDispatch} = useContext<any>(CertificateContext);

  const [loading, setLoading] = useState<boolean>(false);
  const {certificateState} = useContext<any>(CertificateContext);
  const namadProduct: ProductInvoice = certificateState?.namadProduct?.data;
  const namadCost =
    (namadProduct &&
      toPersianDigits(numberSeparator(`${namadProduct.price / 10}`))) ||
    '';
  const certificateInOtherDevice =
    certificateState?.namadProduct?.certificateInOtherDevice;

  const onPay = async (): Promise<void> => {
    try {
      setLoading(true);

      if (certificateInOtherDevice && certificateInOtherDevice.isActive) {
        await revokeAllNamadCertificate(certificateInOtherDevice.invoice);
        certificateDispatch(
          CertificateAction.setIsNamadCertificateInOtherDevice({
            invoice: undefined,
            isActive: false,
          }),
        );
      }

      await buyNamadCertificate();

      setLoading(false);
    } catch (error) {
      Logger.debugLogger('error in onPay: ', error);
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar />
      <Header title="خرید گواهی نماد بانک مرکزی" />
      <ScrollView contentContainerStyle={styles.wrapper}>
        <Text style={styles.textTitle}>مشخصات پرداخت</Text>
        <Text style={styles.text}>
          جزییات پرداخت را می‌توانید در جدول زیر مشاهده کرده و چنانچه کد تخفیف
          دارید، وارد کنید. اطمینان حاصل کنید.
        </Text>
        <BuyPaymentDetailsCard cost={namadCost} />
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
              {namadCost} تومان
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default Index;
