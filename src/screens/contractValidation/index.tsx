import {useFocusEffect, useNavigation} from '@react-navigation/native';
import axios from 'axios';
import React, {useCallback, useContext, useState} from 'react';
import {ScrollView, Text, View} from 'react-native';
import * as RNFS from 'react-native-fs';
import {
  getContractStatesService,
  getDocumentVerificationService,
} from '../../apis';
import {getDocVerificationCancelTokenSource} from '../../apis/services/getDocumentVerification';
import {getUserProfileCancelTokenSource} from '../../apis/services/getUserProfile';
import Button from '../../components/button';
import FileUploader from '../../components/fileUploader';
import UploadContractLoadingModal from '../../components/uploadContractLoadingModal';
import * as routesName from '../../constants/routesName';
import {GlobalContext} from '../../context';
import {GlobalAction} from '../../context/actions';
import {getCurRouteName} from '../../helpers/getActiveRouteState';
import {buildHash} from '../../helpers/hashManipulator';
import {ContractModel} from '../../model/contract.model';
import {ContractStatesModel} from '../../model/contractStates.model';
import {DocumentPickerResponseModel} from '../../model/documentPickerResponse.model';
import {Logger} from '../../modules/log/logger';
import loadContract from './modules/loadContract';
import styles from './style';

const Index: React.FC = () => {
  const {navigate, getState} = useNavigation();
  const {globalDispatch} = useContext<any>(GlobalContext);
  const [showUploadLoading, setShowUploadLoading] = useState<boolean>(false);
  const [hash, setHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [states, setStates] = useState<ContractStatesModel | null>(null);
  const [fileValue, setFileValue] =
    useState<DocumentPickerResponseModel | null>(null);

  useFocusEffect(
    useCallback(() => {
      const curRoute = getCurRouteName(getState);
      globalDispatch(GlobalAction.toggleActiveRouteName(curRoute));

      getContractStatesHandler().then(r => null);
    }, []),
  );

  const getContractStatesHandler = async (): Promise<ContractStatesModel> => {
    try {
      const response = await getContractStatesService();
      const data: ContractStatesModel = response && response.data;

      setStates(data);
      return Promise.resolve(data);
    } catch (error) {
      Logger.debugLogger('error in getContractStatesHandler:', error);
      return Promise.reject(error);
    }
  };

  const toggleUploadLoadingModal = () =>
    setShowUploadLoading(!showUploadLoading);

  const onFileChange = async (file: DocumentPickerResponseModel) => {
    const b64 = await RNFS.readFile(file.uri, 'base64')
      .then(res => buildHash(res))
      .then(hashString => setHash(hashString + ''))
      .then(() => {
        setFileValue(file);
        setError(null);
      })
      .catch(err => {
        Logger.debugLogger('error in onFileChange:', err);
      });
  };

  const uploader = async () => {
    try {
      if (!hash) {
        setError('لطفا فایل را انتخاب نمایید!');
        return;
      }
      setShowUploadLoading(true);

      const response = await getDocumentVerificationService(hash);
      const data = response && response.data;

      if (!data.errorMessage && data.message === 'hash verified') {
        await navigateToContractView(data.body);

        setShowUploadLoading(false);
        return;
      }
      // @ts-ignore
      navigate(routesName.CONTRACT_NOT_VALID, {value: fileValue});
      setError(data.errorMessage);
      setShowUploadLoading(false);
    } catch (error: any) {
      const {
        data: {errorMessage},
      } = error;
      Logger.debugLogger('error in uploader:', error);

      // @ts-ignore
      navigate(routesName.CONTRACT_NOT_VALID, {value: fileValue});
      setError(errorMessage);
      setShowUploadLoading(false);
    }
  };

  const navigateToContractView = async (list: ContractModel[]) => {
    try {
      const {contractStateDTOs, contract, signer, initiatorInfo} =
        await loadContract(list, list[0]?.contractDto.id);

      // @ts-ignore
      navigate(routesName.CONTRACT_VALID, {
        contract,
        contractStateDTOs,
        signer,
        initiatorInfo,
        states,
        value: fileValue,
      });
    } catch (error) {
      Logger.debugLogger('error in navigateToContractView: ', error);
      return Promise.resolve(error);
    }
  };

  // @ts-ignore
  const backToDashboardScreen = () => navigate(routesName.HOME);

  const cancelRequest = () => {
    getDocVerificationCancelTokenSource.current.cancel();
    getUserProfileCancelTokenSource.current.cancel();

    getDocVerificationCancelTokenSource.current = axios.CancelToken.source();
    getUserProfileCancelTokenSource.current = axios.CancelToken.source();

    toggleUploadLoadingModal();
    setShowUploadLoading(false);
  };

  return (
    <ScrollView>
      <View style={styles.wrapper}>
        <View style={styles.headerWrapper}>
          <Text style={styles.title}>اعتبار سنجی اسناد</Text>
          <Text style={styles.headerText}>
            جهت بررسی اعتبار سند و دریافت رسید امضای آن، فایل مورد نظر خود را
            بارگذاری نمایید.
          </Text>
        </View>

        <View style={styles.form}>
          <FileUploader
            label="بارگذاری فایل سند*"
            onChange={onFileChange}
            value={null}
            error={error}
            size="sm"
          />
          <View style={styles.buttonWrapper}>
            <View style={{marginTop: 10, marginHorizontal: 5, width: '40%'}}>
              <Button
                title="لغو"
                disabled={showUploadLoading}
                loading={false}
                onPress={backToDashboardScreen}
                type="success-outline"
              />
            </View>
            <View style={{marginTop: 10, marginHorizontal: 5, width: '40%'}}>
              <Button
                title="بررسی اعتبار سند"
                disabled={showUploadLoading}
                loading={false}
                onPress={uploader}
                type="success"
              />
            </View>
          </View>
        </View>
      </View>
      <UploadContractLoadingModal
        visible={showUploadLoading}
        title="درحال بارگذاری فایل انتخاب شده"
        disabled={false}
        onClose={toggleUploadLoadingModal}
        cancelRequest={cancelRequest}
      />
    </ScrollView>
  );
};

export default Index;
