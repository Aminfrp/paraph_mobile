import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import styles from '../style';
import Container from '../../../components/container';
import ContractTitle from '../../../components/contractViewElements/contractTitle';
import ContractInformation from '../../../components/contractViewElements/contractInformation';
import {getPersianDate} from '../../../helpers/date';
import {toPersianDigits} from '../../../helpers/convertNumber';
import getSignerFullName from '../../../modules/dataNormalizers/getSignerFullName';
import RenderMessage from '../../../components/contractViewElements/renderMessage';
import ContractStatus from '../../../components/contractViewElements/contractStatus';
import Description from '../../../components/contractViewElements/description';
import Button from '../../../components/button';
import saveSignToFile, {
  generateReceiptFileSharing,
  renderPdf,
} from '../../../helpers/saveSignToFile';
import RNFetchBlob from 'rn-fetch-blob';
import sharePdf from '../../../helpers/sharePdf';
import useCurrentRoute from '../../../hooks/useCurrentRoute';
import {useNavigation} from '@react-navigation/native';
import * as routesName from '../../../constants/routesName';
import {getAsyncStorage} from '../../../helpers/asyncStorage';
import * as keyStorage from '../../../constants/keyStorage';
import debugLogger from '../../../helpers/debugLogger';
import {onBackPress} from '../../../helpers/deviceBackBtnPress';

const Index = props => {
  const {route} = props;
  const {navigate} = useNavigation();

  const {data, contractStateDTOs, states, initiatorInfo, signer} = route.params;
  const [downloadReceiptLoading, setDownloadReceiptLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const onBack = () =>
    navigate(routesName.HOME, {
      screen: routesName.DOCUMENTS,
      params: {
        screen: routesName.DOCUMENT_CREATED,
      },
    });

  useCurrentRoute(true, onBack);

  useEffect(() => {
    userInfoInitializer();
  }, [data, contractStateDTOs]);

  const userInfoInitializer = async () => {
    const userContactInfo = await getAsyncStorage(
      'object',
      keyStorage.CONTACT_INFO,
    );

    setUserInfo(userContactInfo);
  };

  useEffect(() => {
    onBackPress(() => {
      onBack();
      return true;
    });
  }, []);

  const onShareHandler = async () => {
    try {
      const fileName = data.contractFileName
        .split('\\')
        .reverse()[0]
        .split('.')[0];

      const user = getSignerFullName(signer);

      const {htmlContent, filename} = await generateReceiptFileSharing(
        `${fileName}-receipt`,
        data,
        contractStateDTOs,
        user,
        initiatorInfo,
        states,
      );

      let options = {
        html: htmlContent,
        fileName: filename,
        directory: 'Download',
      };

      let file = await RNHTMLtoPDF.convert(options).then(res => {
        RNFetchBlob.fs
          .readFile(res.filePath, 'base64')
          .then(data => sharePdf(data, `${fileName}-receipt.pdf`))
          .catch(err => {
            err && debugLogger('showError', err);
          });
      });
    } catch (e) {
      debugLogger('error in onShareHandler: ' + e);
    }
  };

  const downloadReceiptHandler = async () => {
    try {
      setDownloadReceiptLoading(true);

      const fileName = data.contractFileName
        .split('\\')
        .reverse()[0]
        .split('.')[0];

      const user = getSignerFullName(signer);

      const failureCbFn = () => setDownloadReceiptLoading(false);

      const contractCode = data.contractDto.code || fileName;

      await saveSignToFile(
        `${contractCode}-receipt`,
        data,
        contractStateDTOs,
        user,
        initiatorInfo,
        failureCbFn,
        states,
      );

      setDownloadReceiptLoading(false);
    } catch (error) {
      setDownloadReceiptLoading(false);
    }
  };

  return (
    <Container style={styles.wrapper}>
      <ContractTitle
        // type="قرارداد کار"
        // companyName="فناپ"
        // name={getSignerFullName(signer)}
        // date={getPersianDate(activeContractData.contractDto.fromDate).date}
        companyName={data.contractDto.title}
      />
      <ContractInformation
        date={getPersianDate(data.contractDto.fromDate).date}
        contractNumber={toPersianDigits(data.contractDto.code)}
        creator={getSignerFullName(initiatorInfo)}
        expireTime={getPersianDate(data.contractDto.toDate).date}
      />
      {data.contractStateDTOs && (
        <RenderMessage
          data={data.contractStateDTOs}
          isContractInitiator={data}
        />
      )}
      <ContractStatus
        data={contractStateDTOs}
        getSignerFullName={getSignerFullName}
        states={states}
        userId={userInfo?.ssoId}
      />
      <Description title="توضیحات" text={data.contractDto.description} />
      <View style={styles.footerWrapper}>
        <Text style={styles.footerText}>
          برای دانلود یا به اشتراک گذاری رسید این سند می توانید از کلید های زیر
          استفاده نمائید.
        </Text>

        <View style={styles.buttonsGroup}>
          <View style={styles.btnWrapper}>
            <Button
              title="به اشتراک گذاری"
              type="primary-outline"
              onPress={onShareHandler}
              loading={false}
              icon="share"
            />
          </View>
          <View style={styles.btnWrapper}>
            <Button
              title="دانلود و مشاهده رسید"
              type="success"
              onPress={downloadReceiptHandler}
              loading={downloadReceiptLoading}
              disabled={downloadReceiptLoading}
            />
          </View>
        </View>
      </View>
    </Container>
  );
};

export default Index;
