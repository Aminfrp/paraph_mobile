import {useNavigation} from '@react-navigation/native';
import React, {useContext, useEffect, useState} from 'react';
import {ScrollView, StatusBar} from 'react-native';
import Header from '../../components/header';
import Loading from '../../components/loading';
import * as routesName from '../../constants/routesName';
import {CertificateContext} from '../../context';
import {CertificateModel} from '../../model/certificateList.model';
import {CertificateTypeEnum} from '../../model/certificateType.enum';
import {namadRevoke} from '../../modules/certificate/namadCertificate';
import {risheRevoke as risheRevokeByCert} from '../../modules/certificate/rishe';
import {getCertificateList} from '../../modules/certificate/rishe/certificate';
import CertificateInfoModal from './components/certificateInfoModal';
import Certificates from './components/certificates';
import NoCertificateBought from './components/noCertificateBought';
import RevokeModal from './components/revokeModal';
import styles from './style';

const Index: React.FC = props => {
  const {} = props;
  const {certificateDispatch} = useContext<any>(CertificateContext);

  const [isReadyToRenderDom, setIsReadyToRenderDom] = useState<boolean>(false);
  const [isCertificateExist, setIsCertificateExist] = useState<boolean>(false);
  const [isRisheCertificateExist, setIsRisheCertificateExist] =
    useState<boolean>(false);
  const [isNamadCertificateExist, setIsNamadCertificateExist] =
    useState<boolean>(false);
  const [revokeModalData, setRevokeModalData] = useState<{
    show: boolean;
    type: string;
    certificate: CertificateModel | undefined;
  }>({show: false, type: '', certificate: undefined});

  const [showBanner, setShowBanner] = useState<{
    show: boolean;
    type: string | null;
  }>({show: false, type: null});
  const [revokeLoading, setRevokeLoading] = useState<boolean>(false);
  const [certificateListLoading, setCertificateListLoading] =
    useState<boolean>(false);
  const [certificates, setCertificates] = useState<CertificateModel[]>([]);
  const navigation = useNavigation();

  // useEffect(() => {
  //   certificatesExistChecker().then(async () => {
  //     await certificatesInOtherDeviceChecker();
  //   });
  // }, []);

  // const certificatesInOtherDeviceChecker = async () => {
  //   try {
  //     await isNamadCertificateInOtherDevice();
  //     await isRisheCertificateInOtherDevice();
  //   } catch (error) {
  //     Logger.debugLogger('error in certificatesInOtherDeviceChecker: ', error);
  //     setIsReadyToRenderDom(true);
  //   }
  // };

  // const isNamadCertificateInOtherDevice = async () => {
  //   try {
  //     const invoices = await getNamadInvoices(CertificateTypeEnum.namad, false);
  //     const map: {invoice: InvoiceModel | undefined; isActive: boolean} = {
  //       invoice: undefined,
  //       isActive: false,
  //     };

  //     if (invoices?.length) {
  //       if (invoices?.length === 1) {
  //         const lastInv = invoices[0];
  //         map.invoice = lastInv;
  //         map.isActive = isInvoiceActive(lastInv);
  //       } else {
  //         const {invoice, isActive} = findActiveInvoice(invoices);
  //         map.invoice = invoice;
  //         map.isActive = isActive;
  //       }
  //     }

  //     if (map.isActive && map.invoice) {
  //       certificateDispatch(
  //         CertificateAction.setIsNamadCertificateInOtherDevice(map),
  //       );
  //     }

  //     return Promise.resolve(true);
  //   } catch (error) {
  //     Logger.debugLogger('error in isNamadCertificateInOtherDevice: ', error);

  //     return Promise.resolve(false);
  //   }
  // };

  // const isRisheCertificateInOtherDevice = async () => {
  //   try {
  //     const invoices = await getRisheInvoices(CertificateTypeEnum.rishe, false);
  //     const map: {invoice: InvoiceModel | undefined; isActive: boolean} = {
  //       invoice: undefined,
  //       isActive: false,
  //     };

  //     if (invoices?.length) {
  //       if (invoices?.length === 1) {
  //         const lastInv = invoices[0];
  //         map.invoice = lastInv;
  //         map.isActive = isInvoiceActive(lastInv);
  //       } else {
  //         const {invoice, isActive} = findActiveInvoice(invoices);
  //         map.invoice = invoice;
  //         map.isActive = isActive;
  //       }
  //     }

  //     if (map.isActive && map.invoice) {
  //       certificateDispatch(
  //         CertificateAction.setIsRisheCertificateInOtherDevice(map),
  //       );
  //     }

  //     return Promise.resolve(true);
  //   } catch (error) {
  //     Logger.debugLogger('error in isRisheCertificateInOtherDevice: ', error);

  //     return Promise.resolve(false);
  //   }
  // };

  // const findActiveInvoice = (invoices: InvoiceModel[]) => {
  //   let isActive: boolean = false;
  //   let i: InvoiceModel;
  //   const map: {invoice: InvoiceModel | undefined; isActive: boolean} = {
  //     invoice: undefined,
  //     isActive: false,
  //   };

  //   for (i of invoices) {
  //     isActive = isInvoiceActive(i);

  //     if (isActive) {
  //       map.invoice = i;
  //       map.isActive = isActive;
  //       break;
  //     }
  //   }

  //   return map;
  // };

  // const isNamadCertificateBought = async () => {
  //   try {
  //     const namadCertificate = await isNamadCertificateActive();

  //     return Promise.resolve(namadCertificate);
  //   } catch (error) {
  //     Logger.debugLogger('error in isNamadCertificateBought: ', error);

  //     return Promise.resolve(false);
  //   }
  // };

  // const isRisheCertificateBought = async () => {
  //   try {
  //     const risheCertificate = await isRisheCertificateActive();

  //     return Promise.resolve(risheCertificate);
  //   } catch (error) {
  //     Logger.debugLogger('error in isRisheCertificateBought: ', error);
  //     return Promise.resolve(false);
  //   }
  // };

  // const isRisheCertificateActive = async () => {
  //   try {
  //     const isActive = await getRisheCertificateDetailsInTheWorld();
  //     if (isActive) {
  //       return Promise.resolve(!!isActive);
  //     }
  //     return Promise.resolve(false);
  //   } catch (error) {
  //     Logger.debugLogger('error in isRisheCertificateActive: ', error);
  //     return Promise.reject(error);
  //   }
  // };

  // const isNamadCertificateActive = async () => {
  //   try {
  //     const isActive = await getNamadCertificateDetailsInTheWorld();

  //     if (isActive) {
  //       return Promise.resolve(!!isActive);
  //     }
  //     return Promise.resolve(false);
  //   } catch (error) {
  //     Logger.debugLogger('error in isRisheCertificateActive: ', error);
  //     return Promise.reject(error);
  //   }
  // };

  // const certificatesExistChecker = async () => {
  //   try {
  //     setIsReadyToRenderDom(false);
  //     const isReisheExist = await isRisheCertificateBought();
  //     const isNamadExist = await isNamadCertificateBought();

  //     setIsRisheCertificateExist(isReisheExist);
  //     setIsNamadCertificateExist(isNamadExist);

  //     if (!isNamadExist && !isReisheExist) setIsCertificateExist(false);
  //     else setIsCertificateExist(true);
  //     setIsReadyToRenderDom(true);
  //   } catch (error) {
  //     Logger.debugLogger('error in isNotExistCertificates: ', error);
  //     setIsReadyToRenderDom(true);
  //   }
  // };

  const onBuy = () =>
    navigation.navigate(routesName.RISHE_CERTIFICATE_REQUEST_PAYMENT);

  const toggleCertificateInfoBanner = (show = false, type = 'rishe'): void =>
    setShowBanner({show, type});

  const revokeNamad = async (password: string) => {
    try {
      const result = await namadRevoke(password);
      // await certificatesExistChecker();

      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const revokeRishe = async (password: string, certificate: string) => {
    try {
      const result = await risheRevokeByCert(password, certificate);

      await certificateList();
      // await certificatesExistChecker();

      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const revokeHandler = async (password: string, certificate: string) => {
    try {
      setRevokeLoading(true);

      if (revokeModalData.type === CertificateTypeEnum.namad) {
        await revokeNamad(password);
      }
      if (revokeModalData.type === CertificateTypeEnum.rishe) {

        await revokeRishe(password, certificate);
      }
      setRevokeModalData({show: false, type: '', certificate: undefined});

      setRevokeLoading(false);
    } catch (error) {
      setRevokeLoading(false);
      setRevokeModalData({show: false, type: '', certificate: undefined});
      return Promise.reject(error);
    }
  };

  const certificateList = async () => {
    try {
      setCertificateListLoading(true);
      const response = await getCertificateList();

      setCertificates(response);
      setCertificateListLoading(false);
    } catch (error) {
      setCertificateListLoading(false);
    }
  };

  useEffect(() => {
    certificateList();
  }, [certificates.length]);

  if (certificateListLoading) {
    return (
      <>
        <StatusBar />
        <Header title="گواهی امضای دیجیتال" />
        <Loading />
      </>
    );
  }

  return (
    <>
      <StatusBar />
      <Header title="گواهی امضای دیجیتال" />
      <ScrollView contentContainerStyle={styles.wrapper}>
        {certificates && !certificates.length ? (
          <NoCertificateBought onBuy={onBuy} onMoreDetails={() => {}} />
        ) : (
          <Certificates
            onInfo={toggleCertificateInfoBanner}
            isRisheCertificateExist={isRisheCertificateExist}
            isNamadCertificateExist={isNamadCertificateExist}
            onRevoke={(type: string, certificate) =>
              setRevokeModalData({show: true, type, certificate})
            }
            certificates={certificates}
          />
        )}
        <CertificateInfoModal
          onClose={() => toggleCertificateInfoBanner(false, '')}
          show={showBanner.show}
          type={showBanner.type || ''}
        />
        <RevokeModal
          show={revokeModalData.show}
          loading={revokeLoading}
          onClose={() =>
            setRevokeModalData({show: false, type: '', certificate: undefined})
          }
          onRevoke={(password: string) =>
            revokeHandler(
              password,
              revokeModalData.certificate
                ? revokeModalData.certificate.certificate
                : '',
            )
          }
        />
      </ScrollView>
    </>
  );
};

export default Index;
