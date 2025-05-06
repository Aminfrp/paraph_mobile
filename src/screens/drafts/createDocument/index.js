import React, {useContext, useState, useEffect, useCallback} from 'react';
import {View, Text} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import * as RNFS from 'react-native-fs';
import {useFocusEffect} from '@react-navigation/native';
import {GlobalContext} from '../../../context';
import {GlobalAction} from '../../../context/actions';
import {getCurRouteName} from '../../../helpers/getActiveRouteState';
import ContractTitle from '../../../components/contractViewElements/contractTitle';
import ContractInformation from '../../../components/contractViewElements/contractInformation';
import {
  getDateByDaysCountAfterSpecialDate,
  getPersianDate,
} from '../../../helpers/date';
import getSignerFullName from '../../../modules/dataNormalizers/getSignerFullName';
import styles from '../../contract/style';
import Container from '../../../components/container';
import Badge from '../../../components/badge';
import GradientBorderMessage from '../../contract/components/gradientBorderMessage';
import Description from '../../../components/contractViewElements/description';
import ContractStatus from '../../../components/contractViewElements/contractStatus';
import {getAsyncStorage} from '../../../helpers/asyncStorage';
import * as keyStorage from '../../../constants/keyStorage';
import debugLogger from '../../../helpers/debugLogger';
import Button from '../../../components/button';
import AbsoluteLoading from '../../../components/absoluteLoading';
import DocumentCreator from '../../../modules/document/documentCreator';
import refIdGenerator from '../../../helpers/refIdGenerator';
import {buildHash} from '../../../helpers/hashManipulator';
import {str2base64} from '../../../modules/converter/stringBase64Converter';
import {showToast} from '../../../components/toastNotification/utils';
import {getDownloadFilePath} from '../../../modules/document/constant';
import fileDownloader from '../../../modules/fileDownloader';

const Index = props => {
  const {
    navigation: {navigate},
    navigation,
    route,
  } = props;
  const {globalDispatch} = useContext(GlobalContext);
  const paramsState = route.params;
  const {draft, states} = paramsState;
  const [isDocumentExpired, setIsDocumentExpired] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [selectedContacts, setSelectedContacts] = useState(
    paramsState.contact ? [paramsState.contact] : [],
  );
  const [file, setFile] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [expireTime, setExpireTime] = useState(null);
  const [isCertificateChecked, setIsCertificateChecked] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [encryptedFileName, setEncryptedFileName] = useState(
    draft.documentTitle +
      '-' +
      refIdGenerator().split('-')[1] +
      '.draft-document.pdf',
  );

  useFocusEffect(
    useCallback(() => {
      const curRoute = getCurRouteName(navigation.getState);
      globalDispatch(GlobalAction.toggleActiveRouteName(curRoute));
    }, []),
  );

  useEffect(() => {
    componentStateSetter();
  }, [draft]);

  const componentStateSetter = async () => {
    await setUserInfoHandler();
    await setDraftData();
  };

  const setUserInfoHandler = async () => {
    const userContactInfo = await getAsyncStorage(
      'object',
      keyStorage.CONTACT_INFO,
    );

    setUserInfo(userContactInfo);
  };

  const setDraftData = async () => {
    if (draft) {
      const file_data = await downloadFileByPreDocumentUrl(draft.fileUrl);

      const documentCode = await buildHash(
        str2base64(new Date().getTime().toString()),
      );

      setCode(documentCode.slice(0, 8));
      setTitle(draft.documentTitle);
      setDescription(draft.documentDescription);
      setFileInfo({title: draft.documentTitle, size: ''});
      setSelectedContacts([...draft.draftSigners]);
      draft.signDeadLineDays &&
        setExpireTime(
          getDateByDaysCountAfterSpecialDate(
            draft.signDeadLineDays,
            draft.draftStateDtos[0].submitTime,
          )._d,
        );
    }
  };

  const getFileStat = async filePath => {
    try {
      return Promise.resolve(RNFetchBlob.fs.stat(filePath));
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const downloadFileByPreDocumentUrl = async url => {
    try {
      setDownloadLoading(true);

      const response = await fileDownloader(
        {
          url,
          fileName: encryptedFileName,
        },
        true,
      );

      const fileBase64 = await RNFS.readFile(response.data.filePath, 'base64');

      const stat = await getFileStat(response.data.filePath);

      setFile(fileBase64);
      setFileInfo({title: stat?.filename, size: stat?.size});

      setDownloadLoading(false);
      return Promise.resolve(fileBase64);
    } catch (error) {
      const errorData = error && error.data && error.data?.message;

      if (errorData && errorData === 'NOT_VALID') {
        showToast('danger', 'ذخیره فایل', 'فایل ذخیره شده مخرب شناسایی شد.');
      }

      debugLogger('error in downloadFileByPreDocumentUrl: ', error);
      setDownloadLoading(false);
      return Promise.reject(error);
    }
  };

  const onCreate = async () => {
    try {
      setLoading(true);

      const documentCreator = new DocumentCreator(
        fileInfo,
        file,
        selectedContacts,
        userInfo.id,
        expireTime,
        description,
        code,
        title,
        isCertificateChecked,
        true,
        draft.id,
      );

      await documentCreator.createDocument();
      setLoading(false);
    } catch (error) {
      debugLogger('error in onCreate: ', error);
      setLoading(false);
    }
  };

  const onOpenDocument = async () => {
    const stat = await getFileStat(getDownloadFilePath(encryptedFileName));
    await RNFetchBlob.android.actionViewIntent(stat.path, 'application/pdf');
  };

  return (
    <>
      {downloadLoading && <AbsoluteLoading />}
      <Container style={styles.wrapper}>
        <ContractTitle companyName={draft.documentTitle} />
        <ContractInformation
          date={getPersianDate(draft.draftStateDtos[0].submitTime).date}
          expireTime={
            getPersianDate(
              getDateByDaysCountAfterSpecialDate(
                draft.signDeadLineDays,
                draft.draftStateDtos[0].submitTime,
              ),
            ).date
          }
          contractNumber="پیشنویس"
          creator={getSignerFullName(draft.initiatorInfo)}
        />
        <View>
          <Text style={[styles.contractInformationItemText]}>ایجاد کننده</Text>
          <Badge
            text={getSignerFullName(draft.creator)}
            type="secondary"
            isBold
          />
        </View>
        {isDocumentExpired && (
          <GradientBorderMessage
            text="این سند منقضی شده است"
            borderColor="#D20F29"
            textColor="#D20F29"
          />
        )}
        <Description title="توضیحات" text={draft.documentDescription || ''} />
        <ContractStatus
          data={draft.signers}
          getSignerFullName={getSignerFullName}
          states={states}
          userId={userInfo?.ssoId}
        />
        <Button
          title="امضا و ارسال برای دیگر امضا کنندگان"
          type="success"
          onPress={onCreate}
          loading={loading}
        />
        <Button
          title=" مشاهده سند"
          type="success-outline"
          onPress={onOpenDocument}
        />
      </Container>
    </>
  );
};

export default Index;
