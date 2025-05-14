import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
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
import risheInquiry from '../../apis/services/risheInquiry.ts';
import getLoggedInUserSSOID from '../../helpers/getLoggedInUserSSOID.ts';
import {
  getAsyncStorage,
  removeAsyncStorage,
} from '../../helpers/asyncStorage.js';
import sleep from '../../helpers/sleep';
import {encryptCertificateData} from '../../modules/certificate/utils/cryption.ts';
import {writeCertificateFile} from '../../modules/certificate/utils/fileManager.ts';
import certificateLogger from '../../modules/certificate/utils/certificateLogger.ts';
import Modal from '../../components/modal';
import colors from '../../assets/theme/colors.ts';
import * as Toast from '../../components/toastNotification/utils';

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
  const [showInquiryModal, setShowInquiryModal] = useState<boolean>(false);
  const [certificateListLoading, setCertificateListLoading] =
    useState<boolean>(false);
  const [certificates, setCertificates] = useState<CertificateModel[]>([]);
  const navigation = useNavigation();

  const onBuy = () =>
    navigation.navigate(routesName.RISHE_CERTIFICATE_REQUEST_PAYMENT as never);

  const toggleCertificateInfoBanner = (show = false, type = 'rishe'): void =>
    setShowBanner({show, type});

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

  const checkRequestIdExist = async () => {
    try {
      const ssoId = await getLoggedInUserSSOID();
      const keyId = await getAsyncStorage('text', ssoId + '-keyId');
      const requestId = await getAsyncStorage('text', ssoId + '-requestId');
      const password = await getAsyncStorage('text', ssoId + '-password');
      const pairs = await getAsyncStorage('object', ssoId + '-pairs');
      let certificate = '';

      if (!requestId) return;
      setShowInquiryModal(true);
      while (true) {
        const response = await risheInquiry(keyId, requestId);
        if (response.data.certificate !== null) {
          certificate = response.data.certificate;
          await removeAsyncStorage(ssoId + '-keyId');
          await removeAsyncStorage(ssoId + '-pairs');
          await removeAsyncStorage(ssoId + '-password');
          break;
        }
        await sleep(30000);
      }
      if (certificate) {
        const certificateFileObjectData = {
          certificate,
          keyId,
          pairs,
        };

        const encryptedCertificateData = await encryptCertificateData(
          ssoId,
          password,
          certificateFileObjectData,
        );

        await writeCertificateFile(
          CertificateTypeEnum.rishe,
          encryptedCertificateData.data,
        );

        await certificateLogger(
          'info',
          'certificate generated and saved in client, invoice status is file-created',
        );

        Toast.showToast(
          'success',
          'صدور گواهی',
          'گواهی امضا با موفقیت ساخته و ذخیره شد.',
        );
        setShowInquiryModal(false);
      }
    } catch (e) {
      setShowInquiryModal(false);
      console.error(e);
    }
  };

  useEffect(() => {
    certificateList();
  }, [certificates.length]);

  useEffect(() => {
    checkRequestIdExist();
  }, []);

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
      <Modal
        visible={showInquiryModal}
        onRequestClose={() => {}}
        title={'صدور گواهی ریشه'}>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{fontFamily: 'YekanBakh-Bold'}}>
            گواهی ریشه در حال صدور می باشد لطفا منتظر بمانید.
          </Text>
          <ActivityIndicator
            size="large"
            color={colors.primary.success}
            style={{padding: 20}}
          />
        </View>
      </Modal>
    </>
  );
};

// @ts-ignore
export default Index;
