import React, {useState, useEffect} from 'react';
import {ScrollView, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import useCurrentRoute from '../../../hooks/useCurrentRoute';
import CreateContractForm from '../components/createContractFrom';
import CreateContractHeader from '../components/createContractHeader';
import CreateContractContactList from '../components/createContractContactList';
import UploadContractLoadingModal from '../../../components/uploadContractLoadingModal';
import {getAsyncStorage} from '../../../helpers/asyncStorage';
import * as keyStorage from '../../../constants/keyStorage';
import * as routesName from '../../../constants/routesName';
import useParamsState from '../../../hooks/useParamsState';
import debugLogger from '../../../helpers/debugLogger';
import DocumentCreator from '../../../modules/document/documentCreator';
import CertificateSelector from '../components/certificateSelector';
import Button from '../../../components/button';
import styles from './style';

const Index = () => {
  const navigation = useNavigation();
  const {navigate, goBack} = navigation;
  const paramsState = useParamsState();

  const [selectedContacts, setSelectedContacts] = useState(
    paramsState.contact ? [paramsState.contact] : [],
  );
  const [file, setFile] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [expireTime, setExpireTime] = useState(null);
  const [error, setError] = useState(null);
  const [initiatorSSOID, setInitiatorSSOID] = useState(null);
  const [createContractLoading, setCreateContractLoading] = useState(false);
  const [isCertificateChecked, setIsCertificateChecked] = useState(false);
  const [isNamadCertificateChecked, setIsNamadCertificateChecked] =
    useState(false);
  const [asBusiness, setAsBusiness] = useState(false);

  useCurrentRoute(true);

  useEffect(() => {
    initiatorInfoInitializer();

    return () => {};
  }, []);

  const initiatorInfoInitializer = async () => {
    const contactInfo = await getAsyncStorage(
      'object',
      keyStorage.CONTACT_INFO,
    );
    contactInfo.asBusiness && setAsBusiness(contactInfo.asBusiness);

    setInitiatorSSOID(contactInfo.id);
  };

  const onFile = async _file => {
    if (_file) {
      resetError('file');
    }
    setFile(_file);
    setFileInfo({title: _file.name, size: _file.size});
  };

  const onTitle = value => {
    if (value !== '') {
      resetError('title');
    }
    setTitle(value);
  };

  const onCode = value => {
    if (value !== '') {
      resetError('code');
    }
    setCode(value);
  };

  const onExpireTime = value => {
    const incomingDate = new Date(value._d).getTime();
    const now = new Date().getTime();

    if (now < incomingDate) {
      resetError('expireTime');

      setExpireTime(value);
      return;
    }

    setError({...error, expireTime: 'تاریخ انتخابی معتبر نمی باشد.'});
    setExpireTime(null);
  };

  const onDescription = value => {
    setDescription(value);
  };

  const onForceCertificate = type => {
    if (type === 'rishe') {
      resetError('certificateChecked');
      setIsCertificateChecked(!isCertificateChecked);
      isNamadCertificateChecked && setIsNamadCertificateChecked(false);
    }
    if (type === 'namad') {
      resetError('namdCertificateChecked');
      setIsNamadCertificateChecked(!isNamadCertificateChecked);
      isCertificateChecked && setIsCertificateChecked(false);
    }
  };

  const submitContract = async () => {
    const postData = {
      title,
      code,
      selectedContacts,
      file,
    };

    const isValid = validation(postData);
    // todo: certificate file exist if rishe is forced...
    const isCertificateValid = true;
    // const isCertificateValid = await validationCertificateOption();

    if (isValid && isCertificateValid) {
      return createContract();
    }
  };

  const createContract = async () => {
    try {
      setCreateContractLoading(true);

      const documentCreator = new DocumentCreator(
        fileInfo,
        file,
        selectedContacts,
        initiatorSSOID,
        expireTime,
        description,
        code,
        title,
        isCertificateChecked,
        false,
        null,
        isNamadCertificateChecked,
      );

      await documentCreator.createDocument();
      setCreateContractLoading(false);
    } catch (error) {
      debugLogger('error in createContract: ', error);
      setCreateContractLoading(false);
    }
  };

  const validation = postData => {
    let isValid = true;
    const errorFields = {};

    for (let el in postData) {
      if (el === 'selectedContacts') {
        if (postData[el].length === 0) {
          errorFields[el] = `${getPersianFieldName(el)} را وارد نمایید.`;
          isValid = false;
        }
      } else if (el === 'file') {
        if (postData[el] === null) {
          errorFields[el] = `${getPersianFieldName(el)} را وارد نمایید.`;
          isValid = false;
        }
      } else {
        if (postData[el] === '') {
          errorFields[el] = `${getPersianFieldName(el)} را وارد نمایید.`;
          isValid = false;
        }
      }
    }

    if (Object.keys(errorFields).length > 0) {
      setError(errorFields);
    }

    return isValid;
  };

  const getPersianFieldName = key => {
    const map = {
      title: 'عنوان سند',
      code: 'شماره سند',
      selectedContacts: 'مخاطبین سند',
      file: 'فایل سند',
    };

    return map[key];
  };

  const resetError = key => {
    if (error !== null) {
      const errorObj = {...error};

      if (error.hasOwnProperty(key)) {
        delete errorObj[key];
      }

      setError(errorObj);
    }
  };

  const onBackContacts = () => {
    navigation.navigate(routesName.CREATE_CONTRACT);
  };

  const onAddContact = () => {
    navigation.navigate(routesName.CREATE_CONTRACT_CONTACT_LIST, {
      onBack: onBackContacts,
      setSelectContactList: setSelectedContacts,
      selectContactsList: selectedContacts,
      resetError: resetError,
    });
  };

  const onGetCertificate = () =>
    navigate(routesName.CERTIFICATE, {
      screen: routesName.CERTIFICATES,
    });

  return (
    <>
      <CreateContractHeader title="ایجاد سند" />
      <ScrollView>
        <CreateContractForm
          onFile={onFile}
          file={file}
          onTitle={onTitle}
          onCode={onCode}
          onExpireTime={onExpireTime}
          title={title}
          code={code}
          description={description}
          expireTime={expireTime}
          onDescription={onDescription}
          error={error}
        />
        <CreateContractContactList
          onAddContact={onAddContact}
          onSubmit={submitContract}
          totalContacts={selectedContacts.length}
          error={error && error.selectedContacts}
          goBack={goBack}
          // disabled={!!paramsState.contact}
          disabled={false}
        />
        <CertificateSelector
          error={error}
          isCertificateChecked={isCertificateChecked}
          onForceCertificate={onForceCertificate}
          onGetCertificate={onGetCertificate}
          showBuyCertificate={!asBusiness}
          isNamadCertificateChecked={isNamadCertificateChecked}
        />

        <View style={styles.btnGroup}>
          <View style={styles.btnWrapper}>
            <Button
              title="بازگشت"
              type="primary-outline"
              onPress={goBack}
              loading={false}
              disabled={createContractLoading}
            />
          </View>
          <View style={styles.btnWrapper}>
            <Button
              title="ایجاد سند"
              type="success"
              onPress={submitContract}
              loading={createContractLoading}
              disabled={createContractLoading}
            />
          </View>
        </View>
      </ScrollView>
      <UploadContractLoadingModal
        visible={createContractLoading}
        title="درحال بارگذاری فایل انتخاب شده"
        disabled={false}
        onClose={() => setCreateContractLoading(false)}
        cancelRequest={() => setCreateContractLoading(false)}
        cancelable={false}
      />
    </>
  );
};

export default Index;
