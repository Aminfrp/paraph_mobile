import React, {useState, useCallback, useEffect} from 'react';
import {View, ScrollView, Text, TouchableOpacity, Image} from 'react-native';
import Form from '../components/createContactForm';
import {addContactService, editContactService} from '../../../apis';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import useParamsState from '../../../hooks/useParamsState';
import * as routesName from '../../../constants/routesName';
import * as Toast from '../../../components/toastNotification/utils';
import useCurrentRoute from '../../../hooks/useCurrentRoute';
import TabSwitcher from '../../../components/tabSwitcher';
import {ContactServiceInputModel} from '../../../model/contactServiceInput.model';
import styles from './style';
import {Logger} from '../../../modules/log/logger';
import {isNationalIdValid} from '../../../modules/validation/validation.ts';

const Index: React.FC = () => {
  const navigation = useNavigation();
  const paramsState = useParamsState();

  const {goBack, navigate} = navigation;
  const [createContactLoading, setCreateContactLoading] = useState(false);

  const [firstName, setFirstName] = useState(
    paramsState?.contact ? paramsState.contact.firstName : '',
  );
  const [lastName, setLastName] = useState(
    paramsState?.contact ? paramsState.contact.lastName : '',
  );
  const [nationalId, setNationalId] = useState('');
  const [cellphoneNumber, setCellphoneNumber] = useState(
    paramsState?.contact ? paramsState.contact.cellphoneNumber : '',
  );
  const [companyId, setCompanyId] = useState(
    paramsState?.contact ? paramsState.contact.nationalId : '',
  );
  const [companyName, setCompanyName] = useState(
    paramsState?.contact ? paramsState.contact.firstName : '',
  );
  const [isNationalCode, setIsNationalCode] = useState(false);
  const [error, setError] = useState<any>(null);
  const tabModes = ['شخص حقوقی', 'شخص حقیقی'];
  const isLegalUserEditMode = paramsState?.contact?.legalUser;

  const [tabMode, setTabMod] = useState(
    !paramsState?.contact ? tabModes[0] : tabModes[1],
  );

  const onTabToggle = (item: string) => {
    setTabMod(item);
    setFirstName('');
    setLastName('');
    setNationalId('');
    setCellphoneNumber('');
    setCompanyId('');
    setCompanyName('');
  };

  useCurrentRoute(true);

  useEffect(() => {
    setFirstName(paramsState?.contact ? paramsState.contact.firstName : '');
    setLastName(paramsState?.contact ? paramsState.contact.lastName : '');
    setNationalId(paramsState?.contact ? paramsState.contact.nationalId : '');
    setCellphoneNumber(
      paramsState?.contact ? paramsState.contact.cellphoneNumber : '',
    );
    setCompanyId(paramsState?.contact ? paramsState.contact.nationalId : '');
    setCompanyName(paramsState?.contact ? paramsState.contact.firstName : '');
    if (isLegalUserEditMode === 'true') {
      setTabMod(tabModes[0]);
    } else setTabMod(tabModes[1]);
  }, [paramsState]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        resetForm();
      };
    }, []),
  );

  const onCheckBox = () => {
    setIsNationalCode(!isNationalCode);
  };

  const onFirstName = (value: string) => {
    resetError('firstName');
    setFirstName(value);
  };

  const onLastName = (value: string) => {
    resetError('lastName');
    setLastName(value);
  };

  const onCellphoneNumberName = (value: string) => {
    resetError('cellphoneNumber');
    setCellphoneNumber(value);
  };

  const onCompanyId = (value: string) => {
    resetError('companyId');
    setCompanyId(value);
  };

  const onCompanyName = (value: string) => {
    resetError('companyName');
    setCompanyName(value);
  };

  const onNationalId = (value: string) => {
    resetError('nationalId');
    setNationalId(value);
  };

  const resetError = (key: string) => {
    if (error !== null) {
      const errorObj = {...error};

      if (error.hasOwnProperty(key)) {
        delete errorObj[key];
      }

      setError(errorObj);
    }
  };

  const submit = async () => {
    let postData: Partial<ContactServiceInputModel> = {};
    let validationPostData: Partial<
      Exclude<ContactServiceInputModel, {companyId: string}>
    > = {};

    if (paramsState && paramsState.contact) {
      postData = {
        firstName: tabMode === 'شخص حقوقی' ? companyName : firstName,
        lastName,
        ...(nationalId && {nationalId}),
        ...(cellphoneNumber && {cellphoneNumber}),
        ...(isLegalUserEditMode === 'true' && {legalUser: true}),
      };
      validationPostData = {
        firstName: tabMode === 'شخص حقوقی' ? companyName : firstName,
        companyName: tabMode === 'شخص حقوقی' ? companyName : firstName,
        lastName,
        companyId: companyId,
        ...(cellphoneNumber && {cellphoneNumber}),
        ...(isLegalUserEditMode === 'true' && {legalUser: true}),
      };

      const isValid = validation(validationPostData);

      isValid && (await editContact(postData));

      return;
    }

    if (tabMode === 'شخص حقوقی') {
      postData = {
        firstName: companyName,
        lastName: new Date().getTime().toString(),
        nationalId: companyId,
        legalUser: true,
      };
    } else {
      postData = {
        firstName,
        lastName,
        ...(isNationalCode && {nationalId}),
        ...(!isNationalCode && {cellphoneNumber}),
      };
    }

    validationPostData = {
      ...postData,
    };

    const isValid = validation(validationPostData);

    isValid && (await createContact([postData]));
  };

  const editContact = async (postData: Partial<ContactServiceInputModel>) => {
    try {
      setCreateContactLoading(true);

      const response = await editContactService(postData);
      const data = response && response.data;

      if (data && data.body) {
        Toast.showToast('success', 'مخاطب', 'مخاطب با موفقیت ویرایش شد');
        // @ts-ignore
        navigate(routesName.CONTACT_LIST);
      }

      setCreateContactLoading(false);
    } catch (error) {
      Logger.debugLogger('error in editContact:', error);
      setCreateContactLoading(false);
      Toast.showToast('danger', 'مخاطب', 'ویرایش مخاطب با خطا مواجه شد');
    }
  };

  const validation = (
    postData: Partial<Exclude<ContactServiceInputModel, {companyId: string}>>,
  ) => {
    let isValid = true;
    const errorFields: any = {};

    for (let el in postData) {
      // @ts-ignore
      const value = postData[el];

      if (
        el === 'companyId' ||
        el === 'nationalId' ||
        el === 'cellphoneNumber'
      ) {
        if (isNaN(Number(value))) {
          errorFields[el] = `${getPersianFieldName(el)} را وارد نمایید.`;
          isValid = false;
        }
      }

      if (value === '') {
        errorFields[el] = `${getPersianFieldName(el)} را وارد نمایید.`;
        isValid = false;
      }
    }
    if (postData.nationalId) {
      if (tabMode === 'شخص حقیقی') {
        const isNationalValid = isNationalIdValid(postData.nationalId);
        if (!isNationalValid) {
          errorFields['nationalId'] = `کد ملی معتبر نمی باشد.`;
          isValid = false;
        }
      }
    }

    if (Object.keys(errorFields).length > 0) {
      setError(errorFields);
    }
    return isValid;
  };

  const getPersianFieldName = (key: string) => {
    let map: {[name: string]: string} = {};

    if (tabMode === 'شخص حقوقی') {
      map = {
        firstName: 'نام شرکت/سازمان',
        lastName: 'نام شرکت/سازمان',
        nationalId: 'شناسه ملی شرکت/سازمان',
        companyName: 'نام شرکت/سازمان',
        companyId: 'شناسه ملی شرکت/سازمان',
      };
    } else {
      map = {
        firstName: 'نام',
        lastName: 'نام خانوادگی',
        cellphoneNumber: 'شماره تماس',
        nationalId: 'شماره ملی',
      };
    }

    return map[key];
  };

  const createContact = async (
    postData: [Partial<ContactServiceInputModel>],
  ) => {
    try {
      setCreateContactLoading(true);
      const response = await addContactService(postData);
      const data =
        response &&
        response.data &&
        response.data.body &&
        response.data.body[0];

      const responseStatus = data.savedContactStatus;

      if (responseStatus === 'NOT_SAVED') {
        Toast.showToast('danger', 'مخاطب', 'مخاطب ثبت نشد');
      } else {
        Toast.showToast('success', 'مخاطب', 'مخاطب با موفقیت ثبت شد');
        resetForm();
        // @ts-ignore
        navigate(routesName.CONTACT_LIST);
      }

      setCreateContactLoading(false);
    } catch (error) {
      Logger.debugLogger('error in createContact error:', error);

      Toast.showToast('danger', 'مخاطب', 'مخاطب ثبت نشد');
      setCreateContactLoading(false);
    }
  };

  const onGoBack = () => {
    resetForm();
    goBack();
  };

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setNationalId('');
    setCellphoneNumber('');
    setError(null);
    setCompanyId('');
    setCompanyName('');
    setIsNationalCode(false);
  };

  const navigateDeviceContactListScreen = () => {
    // @ts-ignore
    navigation.navigate(routesName.DEVICE_CONTACT_LIST);
  };

  return (
    <View style={{flex: 1}}>
      {paramsState?.contact === null && (
        <View style={styles.createContactHeaderWrapper}>
          <Text style={styles.screenTitle} />
          <Text style={styles.screenTitle}>ایجاد مخاطب جدید</Text>
          <TouchableOpacity onPress={navigateDeviceContactListScreen}>
            <Image
              source={require('../../../assets/img/png/contact_select.png')}
              resizeMode="contain"
              style={styles.contactSelect}
            />
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.wrapper}>
        {!paramsState?.contact && (
          <View style={styles.tabSwitcherWrapper}>
            <View style={styles.tabSwitcher}>
              <TabSwitcher
                options={tabModes}
                activeItem={tabMode}
                toggle={onTabToggle}
                disabled={isLegalUserEditMode}
              />
            </View>
          </View>
        )}

        {/*<CreateContactHeader />*/}
        <Form
          loading={createContactLoading}
          goBack={onGoBack}
          submit={submit}
          disabled={false}
          firstName={firstName}
          lastName={lastName}
          nationalId={nationalId}
          cellphoneNumber={cellphoneNumber}
          isNationalCode={isNationalCode}
          error={error}
          onCheckBox={onCheckBox}
          onFirstName={onFirstName}
          onLastName={onLastName}
          onCellphoneNumberName={onCellphoneNumberName}
          onNationalId={onNationalId}
          contactData={paramsState?.contact}
          isLegal={tabMode === 'شخص حقوقی'}
          onCompanyName={onCompanyName}
          companyName={companyName}
          onCompanyId={onCompanyId}
          companyId={companyId}
        />
      </ScrollView>
    </View>
  );
};

export default Index;
