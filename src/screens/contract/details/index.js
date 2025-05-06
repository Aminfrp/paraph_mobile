import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFetchBlob from 'rn-fetch-blob';
import Container from '../../../components/container';
import ContractTitle from '../../../components/contractViewElements/contractTitle';
import AcceptedContract from '../components/acceptedContract';
import RejectedContract from '../components/rejectedContract';
import Button from '../../../components/button';
import saveSignToFile, {
  generateReceiptFileSharing,
} from '../../../helpers/saveSignToFile';
import sharePdf from '../../../helpers/sharePdf';
import getSignerFullName from '../../../modules/dataNormalizers/getSignerFullName';
import styles from '../style';
import loadBrowserLink from '../../../helpers/loadBrowserLink';
import debugLogger from '../../../helpers/debugLogger';

const Index = props => {
  const {
    route: {
      params: {
        activeContractData,
        contractStateDTOs,
        signer,
        isContractInitiator,
        initiatorInfo,
        states,
      },
    },
  } = props;

  const [signed, setSigned] = useState(false);
  const [rejected, setRejected] = useState(false);
  const [notSigned, setNotSigned] = useState(false);
  const [downloadReceiptLoading, setDownloadReceiptLoading] = useState(false);

  useEffect(() => {
    if (activeContractData?.contractStateDTOs) {
      for (let i of activeContractData.contractStateDTOs) {
        if (i.contractStateType === 'SIGNED') {
          setSigned(true);
        } else if (i.contractStateType === 'NOT_SIGNED') {
          setNotSigned(true);
        } else if (i.contractStateType === 'REJECTED') {
          setRejected(true);
        }
      }
    }
  }, [activeContractData]);

  const downloadReceiptHandler = async () => {
    try {
      setDownloadReceiptLoading(true);

      const fileName = activeContractData.contractFileName
        .split('\\')
        .reverse()[0]
        .split('.')[0];

      const user = getSignerFullName(signer);

      const failureCbFn = () => setDownloadReceiptLoading(false);

      const contractCode = activeContractData.contractDto.code || fileName;

      await saveSignToFile(
        `${contractCode}-receipt`,
        activeContractData,
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

  const onRedirectPrevApp = () => {
    const state = getDocumentState();
    const documentDeepLink = activeContractData.contractDto.finishedDeepLink;
    const link = documentDeepLink.includes('?')
      ? documentDeepLink + `&state=${state}`
      : documentDeepLink + `?state=${state}`;

    link && loadBrowserLink(link);
  };
  const getDocumentState = () => {
    const contractStates = contractStateDTOs?.sort(
      (a, b) => b.submitTime - a.submitTime,
    );

    return contractStates[0]?.contractStateType;
  };

  const onShareHandler = async () => {
    try {
      const fileName = activeContractData.contractFileName
        .split('\\')
        .reverse()[0]
        .split('.')[0];

      const user = getSignerFullName(signer);

      const {htmlContent, filename} = await generateReceiptFileSharing(
        `${fileName}-receipt`,
        activeContractData,
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
          .then(data => {
            sharePdf(data, `${fileName}-receipt.pdf`);
          })
          .catch(err => {
            err && debugLogger('showError', err);
          });
      });
    } catch (e) {
      debugLogger('error in onShareHandler: ' + e);
    }
  };

  return (
    <Container style={styles.wrapper}>
      {!rejected && signed && (
        <AcceptedContract text="امضای شما با موفقیت ثبت شد." />
      )}
      {rejected && (
        <RejectedContract
          text={
            isContractInitiator
              ? 'شما سند را لغو کرده اید.'
              : ' سند شما لغو شده است.'
          }
        />
      )}
      {!rejected && notSigned && (
        <RejectedContract text="شما سند را رد کرده اید." />
      )}
      <ContractTitle
        // type="قرارداد کار"
        // companyName="فناپ"
        // name={getSignerFullName(signer)}
        // date={getPersianDate(activeContractData.contractDto.fromDate).date}
        companyName={activeContractData.contractDto.title}
      />
      {/*<ReceiptOfDocument title={renderReceiptOfDocumentTitle()} />*/}
      <View style={styles.footerWrapper}>
        <Text style={styles.footerText}>
          برای دانلود یا به اشتراک گذاری رسید این سند می توانید از کلید های زیر
          استفاده نمائید.
        </Text>
        <View style={styles.buttonsGroup}>
          <View style={styles.btnWrapper}>
            <Button
              title="به اشتراک گذاری"
              type="primary"
              onPress={onShareHandler}
              loading={false}
              icon="share"
            />
          </View>
          <View style={styles.btnWrapper}>
            <Button
              title="مشاهده رسید"
              type="primary-outline"
              onPress={downloadReceiptHandler}
              loading={downloadReceiptLoading}
            />
          </View>
        </View>
        {activeContractData.contractDto.finishedDeepLink && (
          <Button
            title="بازگشت به برنامه مبدا"
            type="success-outline"
            onPress={onRedirectPrevApp}
            loading={false}
            disabled={false}
          />
        )}
      </View>
    </Container>
  );
};

export default Index;
