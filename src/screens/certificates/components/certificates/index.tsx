import {useNavigation} from '@react-navigation/native';
import forge from 'node-forge';
import React, {useContext} from 'react';
import {FlatList, Text, View} from 'react-native';
import {
  NAMAD_CERTIFICATE_PAYMENT_HISTORY,
  NAMAD_CERTIFICATE_REQUEST_PAYMENT,
  RISHE_CERTIFICATE_PAYMENT_HISTORY,
  RISHE_CERTIFICATE_REQUEST_PAYMENT,
} from '../../../../constants/routesName';
import {CertificateContext} from '../../../../context';
import {toPersianDigits} from '../../../../helpers/convertNumber';
import {CertificateModel} from '../../../../model/certificateList.model';
import {CertificateTypeEnum} from '../../../../model/certificateType.enum';
import {ProductInvoice} from '../../../../model/productInvoice.model';
import numberSeparator from '../../../../modules/converter/numberSeparator';
import styles from '../../style';
import CertificateDataCard from '../certificateDataCard';
import PasswordModal from '../passwordModal/PasswordModal.tsx';
import {compareCertificateWithFile} from '../../../../modules/certificate/rishe/certificate';
type PropsModel = {
  onInfo: (show: boolean, type: string) => void;
  onRevoke: (type: string, certificate: CertificateModel) => void;
  certificates: CertificateModel[];
};

const Index: React.FC<PropsModel> = props => {
  const {onInfo, onRevoke, certificates} = props;
  const {navigate} = useNavigation();
  const {certificateState} = useContext<any>(CertificateContext);
  const namadProduct: ProductInvoice = certificateState?.namadProduct?.data;
  const risheProduct: ProductInvoice = certificateState?.risheProduct?.data;
  const [showPasswordModal, setShowPasswordModal] = React.useState(false);
  const [showCertificate, setShowCertificate] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const namadCost =
    (namadProduct &&
      toPersianDigits(numberSeparator(`${namadProduct.price / 10}`))) ||
    '';
  const risheCost =
    (risheProduct &&
      toPersianDigits(numberSeparator(`${risheProduct.price / 10}`))) ||
    '';

  // @ts-ignore
  const onBuyRishe = () => navigate(RISHE_CERTIFICATE_REQUEST_PAYMENT);

  // @ts-ignore
  const onBuyNamad = () => navigate(NAMAD_CERTIFICATE_REQUEST_PAYMENT);
  // @ts-ignore
  const onNamadHistory = () => navigate(NAMAD_CERTIFICATE_PAYMENT_HISTORY);

  const onNamadInfo = () => onInfo(true, 'namad');

  const onRisheInfo = () => onInfo(true, 'rishe');

  const getCertDate = (item: CertificateModel) => {
    const cert = forge.pki.certificateFromPem(item.certificate);
    return `تاریخ انقضا : ${new Date(
      cert.validity.notBefore,
    ).toLocaleDateString('fa-IR')}`;
  };

  const onInquiry = () => {
    setShowPasswordModal(true);
  };

  const handleInquiry = async (certificate: string, password: string) => {
    try {
      setLoading(true);
      const res = await compareCertificateWithFile(certificate, password);
      if (res) {
        setShowCertificate(true);
      }
      setShowPasswordModal(false);
      setLoading(false);
    } catch (e) {
      setShowPasswordModal(false);
      setLoading(false);
    }
  };
  return (
    <View style={{}}>
      <Text style={styles.textTitle}>گواهی‌های امضای دیجیتال شما</Text>
      <View style={styles.certificateDataCardsWrapper}>
        <FlatList
          data={certificates}
          keyExtractor={(_, index) => index.toString()}
          renderItem={item => (
            <>
              <CertificateDataCard
                isBought={certificates.length > 0}
                title={item.item.cn}
                state="شما یک گواهی فعال با مشخصات بالا دارید"
                dateText={() => getCertDate(item.item)}
                isDate={certificates.length > 0}
                onBuy={onBuyRishe}
                onRevoke={() => onRevoke(CertificateTypeEnum.rishe, item.item)}
                onInfo={onRisheInfo}
                price={risheCost}
                onInquiry={onInquiry}
                showCertificate={showCertificate}
              />
              <PasswordModal
                show={showPasswordModal}
                onInquiry={password =>
                  handleInquiry(item.item.certificate, password)
                }
                loading={loading}
                onClose={() => {
                  setShowPasswordModal(false);
                }}
              />
            </>
          )}
        />

        {/*  todo: commit namad for main release... */}

        {/*<CertificateDataCard*/}
        {/*  isBought={isNamadCertificateExist}*/}
        {/*  title="گواهی امضای نماد بانک مرکزی"*/}
        {/*  state="ویژه امضای چک دیجیتال"*/}
        {/*  isDate={isNamadCertificateExist}*/}
        {/*  onBuy={onBuyNamad}*/}
        {/*  onRevoke={() => onRevoke(CertificateTypeEnum.namad)}*/}
        {/*  onHistory={onNamadHistory}*/}
        {/*  onInfo={onNamadInfo}*/}
        {/*  price={namadCost}*/}
        {/*/>*/}
      </View>
    </View>
  );
};

export default Index;
