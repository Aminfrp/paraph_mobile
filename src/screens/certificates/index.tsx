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

  const onBuy = () => navigation.navigate(routesName.RISHE_CERTIFICATE_REQUEST_PAYMENT as never);

  const toggleCertificateInfoBanner = (show = false, type = 'rishe'): void => setShowBanner({show, type});

  const revokeNamad = async (password: string) => {
    try {
      const result = await namadRevoke(password);
      await certificateList();
      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const revokeRishe = async (certificate: string) => {
    try {
      const result = await risheRevokeByCert(certificate);
      await certificateList();
      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const revokeHandler = async (certificate: string) => {
    try {
      setRevokeLoading(true);
      if (revokeModalData.type === CertificateTypeEnum.namad) {
        await revokeNamad(certificate);
      }
      if (revokeModalData.type === CertificateTypeEnum.rishe) {
        await revokeRishe(certificate);
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
          onRevoke={() =>
            revokeHandler(
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
