import {
  StackActions,
  useFocusEffect,
  useIsFocused,
} from '@react-navigation/native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {Alert, Text, View} from 'react-native';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import {
  getPodSpaceFileDetailsService,
  getSecretKeyBusinessService,
  getSecretKeyByContractIdService,
  updateStateService,
} from '../../apis';
import logService from '../../apis/services/log';
import Badge from '../../components/badge';
import Banner from '../../components/banner';
import Container from '../../components/container';
import ContractInformation from '../../components/contractViewElements/contractInformation';
import ContractStatus from '../../components/contractViewElements/contractStatus';
import ContractTitle from '../../components/contractViewElements/contractTitle';
import Description from '../../components/contractViewElements/description';
import RenderMessage from '../../components/contractViewElements/renderMessage';
import FullScreenLoading from '../../components/fullScreenLoading';
import toastAndroid from '../../components/toastAndroid';
import * as Toast from '../../components/toastNotification/utils';
import * as keyStorage from '../../constants/keyStorage';
import * as routesName from '../../constants/routesName';
import {GlobalContext} from '../../context';
import {GlobalAction} from '../../context/actions';
import {getAsyncStorage, setAsyncStorage} from '../../helpers/asyncStorage';
import {toPersianDigits} from '../../helpers/convertNumber';
import {getPersianDate} from '../../helpers/date';
import debugLogger from '../../helpers/debugLogger';
import decryptFile from '../../helpers/decryptFile';
import {getCurRouteName} from '../../helpers/getActiveRouteState';
import saveSignToFile from '../../helpers/saveSignToFile';
import {deniedPermissionAlert} from '../../helpers/utils';
import {getNamadCertificateDetails} from '../../modules/certificate/namadCertificate';
import {
  checkCertificateList,
  getRisheCertificateDetails,
} from '../../modules/certificate/rishe';
import getSignerFullName from '../../modules/dataNormalizers/getSignerFullName';
import loadContract from '../../modules/dataNormalizers/loadContract';
import {getDownloadFilePath} from '../../modules/document/constant';
import {DocumentActionsUtils} from '../../modules/document/documentActionsUtils';
import fileDownloader from '../../modules/fileDownloader';
import {Logger} from '../../modules/log/logger';
import getStoragePermission from '../../modules/permissions/storage/getStoragePermission';
import CheckSignOrRejectButtons from './components/checkSignOrRejectButtons';
import ConfirmModal from './components/confirmModal';
import DownloadAndDecryptModal from './components/downloadAndDecryptModal';
import GradientBorderMessage from './components/gradientBorderMessage';
import Sign from './components/sign';
import SignOrRejectButtons from './components/signOrRejectButtons';
import SignValidationErrorModal from './components/signValidationErrorModal';
import styles from './style';

const Index = props => {
  const {
    navigation: {navigate},
    navigation,
    route,
  } = props;
  const {globalDispatch} = useContext(GlobalContext);
  const refRBSheet = useRef();
  const refRBSheetDownloadDocument = useRef();
  const paramsState = route.params;
  const isFocused = useIsFocused();
  const [buttonStateType, setButtonStateType] = useState(1);
  const [isContractInitiator, setIsContractInitiator] = useState(false);
  const [signContractLoading, setSignContractLoading] = useState(false);
  const [rejectContractLoading, setRejectContractLoading] = useState(false);
  const [cancelContractLoading, setCancelContractLoading] = useState(false);
  const [updateContractLoading, setUpdateContractLoading] = useState(false);
  const [downloadContractLoading, setDownloadContractLoading] = useState(false);
  const [decryptContractLoading, setDecryptContractLoading] = useState(false);
  const [downloadReceiptLoading, setDownloadReceiptLoading] = useState(false);
  const [modalType, setModalType] = useState('');
  const [signValidationErrorModal, setSignValidationErrorModal] = useState({
    show: false,
    title: '',
    description: '',
  });
  const [signer, setSigner] = useState(paramsState.signer);
  const [activeContractData, setActiveContractData] = useState(
    paramsState.contract,
  );
  const [contractStateDTOs, setContractStateDTOs] = useState(
    paramsState.contractStateDTOs,
  );
  const [isDocumentExpired, setIsDocumentExpired] = useState(false);

  const [timestamp] = useState(new Date().getTime());
  const savedFilename = timestamp + '-' + activeContractData?.id;

  const resourceLink = activeContractData.resourceLink;
  const initiatorInfo = paramsState.initiatorInfo;
  const states = paramsState.states;
  const [downloadError, setDownloadError] = useState(null);
  const [countDecryptError, setCountDecryptError] = useState(0);
  const [userInfo, setUserInfo] = useState(null);
  const [tabState, setTabState] = useState('DOWNLOAD');
  const [openDocumentLoading, setOpenDocumentLoading] = useState(false);
  const [showOpenDocumentModal, setShowOpenDocumentModal] = useState(false);
  const [showFileUrlBanner, setShowFileUrlBanner] = useState(true);
  const [checkSignCertificatesLoading, setCheckSignCertificatesLoading] =
    useState(false);
  const isRisheForced = activeContractData.contractDto.risheForced;
  const isNamadForced = activeContractData.contractDto.namadForced;
  const isCertificate = isRisheForced || isNamadForced;
  let isOpenDocumentContinue = true;

  const ContractUtilsInstance = new DocumentActionsUtils(
    activeContractData,
    timestamp,
  );

  const toggleOpenDocumentModal = (show = false) =>
    setShowOpenDocumentModal(show);

  useFocusEffect(
    useCallback(() => {
      componentFocusCallback();

      return () => componentOnMountCallback();
    }, []),
  );

  const componentFocusCallback = () => {
    const curRoute = getCurRouteName(navigation.getState);
    globalDispatch(GlobalAction.toggleActiveRouteName(curRoute));
  };

  const componentOnMountCallback = () => {
    disableOpenDocument();
  };

  useEffect(() => {
    setUserInfoHandler();
    isDocumentExpiredHandler();
  }, [activeContractData, contractStateDTOs]);

  const setUserInfoHandler = async () => {
    const userContactInfo = await getAsyncStorage(
      'object',
      keyStorage.CONTACT_INFO,
    );
    const isUserInitiator =
      Number(userContactInfo.id) ===
      activeContractData.contractDto.initiatorSSOId;

    setUserInfo(userContactInfo);
    setIsContractInitiator(isUserInitiator);
  };

  const isDocumentExpiredHandler = () => {
    const isExpired = !dateValidation(activeContractData.contractDto.toDate);
    setIsDocumentExpired(isExpired);
  };

  useEffect(() => {
    retryDecryptErrorListener();
  }, [countDecryptError]);

  const retryDecryptErrorListener = async () => {
    if (countDecryptError === 2) {
      await deleteFiles(getDownloadFilePath(`${savedFilename}.pdf.enc`));
      setDownloadError(
        'مشاهده فایل با خطا مواجه شد لطفا سند را مجددا دانلود نمایید.',
      );

      Alert.alert(
        'سند',
        'مشاهده فایل با خطا مواجه شد لطفا سند را مجددا دانلود نمایید.',
        [
          {
            text: 'بستن',
            onPress: () => null,
          },
        ],
        {
          cancelable: false,
        },
      );
    }
  };

  const downloadContractHandler = async () => {
    try {
      setDownloadContractLoading(true);
      setCountDecryptError(0);

      const isDownloaded = await activeContractData.contractStateDTOs.find(
        item => item.contractStateType === 'DOWNLOADED',
      );
      const isRejected = await activeContractData.contractStateDTOs.find(
        item => item.contractStateType === 'REJECTED',
      );

      await downloadContract(resourceLink, savedFilename);

      if (!!isDownloaded === false && !!isRejected === false) {
        const updateParams = {
          contractStateType: 'DOWNLOADED',
          stateMessage: 'contract downloaded successfully',
          submitTime: new Date().getTime(),
          id: activeContractData.id,
        };

        const contactInfo = await getAsyncStorage(
          'object',
          keyStorage.CONTACT_INFO,
        );

        if (
          Number(contactInfo.id) !==
          activeContractData.contractDto.initiatorSSOId
        ) {
          await updateContractState(
            updateParams,
            activeContractData.contractDto.id,
            activeContractData.signerDto.SSOId,
            false,
          );
        }
      }

      await setButtonStateType(2);
      setDownloadContractLoading(false);
    } catch (error) {
      debugLogger('error in downloadContractHandler:', error);
      setDownloadContractLoading(false);
    }
  };

  const downloadContract = async (url, fileNamePodSpace) => {
    try {
      const encryptedFileName = fileNamePodSpace + '.pdf.enc';
      const filename = fileNamePodSpace + '.pdf';

      const {granted, readGranted, writeGranted} = await getStoragePermission();

      if (!readGranted || !writeGranted) {
        await logService(
          'error',
          `cannot get permission for download from podSpace`,
        );

        deniedPermissionAlert();

        return;
      }

      const result = await fileDownloader({
        url,
        fileName: encryptedFileName,
      });

      const {size} = await RNFetchBlob.fs
        .stat(result.data.filePath)
        .catch(error => {
          setDownloadError('دانلود فایل با خطا مواجه شد.');

          return Promise.reject(error);
        });

      const fileDetails = await getPodSpaceFileDetailsService(resourceLink);
      const fileSize = fileDetails && fileDetails.data.size;

      if (fileSize === size) {
        if (downloadError) {
          setDownloadError(null);
        }

        return Promise.resolve(result);
      }

      setDownloadError('دانلود فایل با خطا مواجه شد.');

      Alert.alert(
        'دانلود',
        'دانلود فایل با خطا مواجه شد.',
        [
          {
            text: 'بستن',
            onPress: () => null,
          },
        ],
        {
          cancelable: false,
        },
      );
      return Promise.reject({errorMessage: 'دانلود فایل با خطا مواجه شد.'});
    } catch (error) {
      debugLogger('download contract error:', error);

      return Promise.reject(error);
    }
  };

  const deleteFiles = async filepath => {
    let exists = await RNFS.exists(filepath);
    if (exists) {
      // exists call delete
      await RNFS.unlink(filepath);
      debugLogger('File Deleted');
    } else {
      debugLogger('File Not Available');
    }
  };

  const updateContractState = async (
    params,
    contractId,
    contactId,
    setLoading = true,
  ) => {
    try {
      setLoading && setUpdateContractLoading(true);
      const response = await updateStateService(params, contractId, contactId);
      const data = response && response.data;

      if (data) {
        const loadedContract = await loadContract(contractId, contactId);

        setContractStateDTOs(loadedContract.contractStateDTOs);
        setActiveContractData(loadedContract.contract);
        setSigner(loadedContract.signer);
      }
      setLoading && setUpdateContractLoading(false);
    } catch (error) {
      debugLogger('error in updateContractState:', error);
      setLoading && setUpdateContractLoading(false);
      return Promise.reject(error);
    }
  };

  const contractDecryptHandler = async () => {
    try {
      setDecryptContractLoading(true);

      const file = {
        filePath: getDownloadFilePath(`${savedFilename}.pdf.enc`),
        encryptedFileName: savedFilename + '.pdf.enc',
        fileName: savedFilename + '.pdf',
      };

      if (userInfo && file) {
        const securityParams = {
          userIdentity: userInfo.id,
          userIdentityType: 'id',
        };

        await getSecretKeyBusiness(securityParams, file);

        const isSeen = await activeContractData.contractStateDTOs.find(
          item => item.contractStateType === 'OPENED',
        );
        const isRejected = await activeContractData.contractStateDTOs.find(
          item => item.contractStateType === 'REJECTED',
        );

        const isSignOrNotSigned =
          await activeContractData.contractStateDTOs.find(
            item =>
              item.contractStateType === 'SIGNED' ||
              item.contractStateType === 'NOT_SIGNED' ||
              item.contractStateType === 'REJECTED',
          );

        if (!!isSeen === false && !!isRejected === false) {
          const updateParams = {
            contractStateType: 'OPENED',
            stateMessage: 'contract opened successfully',
            submitTime: new Date().getTime(),
            id: activeContractData.id,
          };

          const contactInfo = await getAsyncStorage(
            'object',
            keyStorage.CONTACT_INFO,
          );

          if (
            Number(contactInfo.id) !==
            activeContractData.contractDto.initiatorSSOId
          ) {
            await updateContractState(
              updateParams,
              activeContractData.contractDto.id,
              activeContractData.signerDto.SSOId,
              false,
            );
          }
        }

        if (!isSignOrNotSigned) {
          await setButtonStateType(3);
        } else {
          setButtonStateType(4);
        }
      }

      setDecryptContractLoading(false);
    } catch (error) {
      debugLogger('error in contractDecryptHandler: ', error);

      setCountDecryptError(countDecryptError + 1);
      setDecryptContractLoading(false);

      return Promise.reject(error);
    }
  };

  // todo: work on download, decrypt, open document...
  const openDocument = async () => {
    try {
      setOpenDocumentLoading(true);
      toggleOpenDocumentModal(true);
      await downloadContractHandler();

      if (isOpenDocumentContinue) {
        await contractDecryptHandler();
        toggleOpenDocumentModal(false);
      }
      setOpenDocumentLoading(false);
    } catch (error) {
      debugLogger('error in openDocument: ', error);
      setOpenDocumentLoading(false);
      toggleOpenDocumentModal(false);
    }
  };

  const disableOpenDocument = () => {
    isOpenDocumentContinue = false;
  };

  const getSecretKeyBusiness = async (postData, file, show = true) => {
    try {
      let response = null;
      if (activeContractData.contractDto.version === 1) {
        response = await getSecretKeyBusinessService(postData);
      } else if (activeContractData.contractDto.version === 2) {
        response = await getSecretKeyByContractIdService({
          ssoIdList: [userInfo?.ssoId || userInfo?.id],
          contractId: activeContractData.contractDto.id,
        });
      }
      const data = response && response.data;
      const secretKey = data && data[0].secretKey;

      if (secretKey) {
        await setAsyncStorage('text', keyStorage.SECRET_KEY, secretKey);

        await decryptFile(secretKey, file, activeContractData.Base64IV, show);
      }

      return Promise.resolve(secretKey);
    } catch (error) {
      if (error && error.errorMessage && error.errorMessage[0]) {
        toastAndroid(error.errorMessage[0], 'short', 'bottom');
      }

      debugLogger('error in getSecretKeyBusiness: ', error);

      return Promise.reject(error);
    }
  };

  const decryptAndSeeContract = async () => {
    try {
      setDecryptContractLoading(true);

      const file = {
        filePath: getDownloadFilePath(`${savedFilename}.pdf.enc`),
        encryptedFileName: savedFilename + '.pdf.enc',
        fileName: savedFilename + '.pdf',
      };

      if (userInfo && file) {
        const securityParams = {
          userIdentity: userInfo.id,
          userIdentityType: 'id',
        };

        await getSecretKeyBusiness(securityParams, file);
      }
      setDecryptContractLoading(false);
    } catch (error) {
      debugLogger('error in decryptAndSeeContract: ', error);
      setDecryptContractLoading(false);
      setCountDecryptError(countDecryptError + 1);
    }
  };

  const dateValidation = timestamp => {
    if (timestamp === 0) {
      return true;
    }

    return new Date().getTime() <= timestamp;
  };

  const downloadReceiptHandler = async () => {
    try {
      setDownloadReceiptLoading(true);
      const user = getSignerFullName(signer);

      const failureCbFn = () => null;

      const documentCode = activeContractData.contractDto.code || savedFilename;

      await saveSignToFile(
        `${documentCode}-receipt`,
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

  const toggleSignValidationErrorModal = (show, title = '', description = '') =>
    setSignValidationErrorModal({show, title, description});

  const checkRisheCertificateExist = async () => {
    try {
      const isActive = await checkCertificateList();

      if (isActive) {
        return Promise.resolve(isActive);
      }
      return Promise.resolve(false);
    } catch (error) {
      Logger.debugLogger('error in checkRisheCertificateExist: ', error);
      return Promise.reject('risheCertificate doesnt exist');
    }
  };

  const checkNamadCertificateExist = async () => {
    try {
      const isActive = await getNamadCertificateDetails();
      if (isActive) {
        return Promise.resolve(!!isActive);
      }
      return Promise.resolve(false);
    } catch (error) {
      Logger.debugLogger('error in checkNamadCertificateExist: ', error);
      return Promise.reject('namadCertificateExist doesnt exist');
    }
  };

  // todo: refactor codes...
  const signedCallback = async () => {
    try {
      const loadedContract = await loadContract(
        activeContractData.contractDto.id,
        activeContractData.signerDto.SSOId,
      );

      setContractStateDTOs(loadedContract.contractStateDTOs);
      setActiveContractData(loadedContract.contract);
      setSigner(loadedContract.signer);

      const popAction = StackActions.pop(2);

      navigation.dispatch(popAction);

      await navigate(routesName.CONTRACT_DETAILS, {
        contractStateDTOs: loadedContract.contractStateDTOs,
        activeContractData: loadedContract.contract,
        signer: loadedContract.signer,
        isContractInitiator,
        initiatorInfo,
        states,
      });
    } catch (error) {
      Logger.debugLogger('error in signedCallback: ', error);
      return Promise.reject(error);
    }
  };

  const signByRootCertificateHandler = async (
    password,
    fileNotExistCallback,
  ) => {
    try {
      setSignContractLoading(true);
      await ContractUtilsInstance.signByRishe(
        password,
        '',
        fileNotExistCallback,
      );
      await signedCallback();
      setSignContractLoading(false);
    } catch (error) {
      debugLogger('error in signByRootCertificateHandler error: ', error);
      setSignContractLoading(false);
      if (
        error &&
        error.type === 'DOCUMENT_VALIDATION_ERROR' &&
        error.message
      ) {
        toggleSignValidationErrorModal(true, 'خطا', error.message);
      }
    }
  };
  const signByNamadCertificateHandler = async password => {
    try {
      setSignContractLoading(true);
      await ContractUtilsInstance.signByNamad(password);
      await signedCallback();
      setSignContractLoading(false);
    } catch (error) {
      debugLogger('error in signByNamadCertificateHandler error: ', error);
      setSignContractLoading(false);
      if (
        error &&
        error.type === 'DOCUMENT_VALIDATION_ERROR' &&
        error.message
      ) {
        toggleSignValidationErrorModal(true, 'خطا', error.message);
      }
    }
  };
  const signContractHandler = async () => {
    try {
      setSignContractLoading(true);
      await ContractUtilsInstance.signById();
      await signedCallback();
      setSignContractLoading(false);
    } catch (error) {
      debugLogger('error in signContractHandler error: ', error);
      setSignContractLoading(false);
      if (
        error &&
        error.type === 'DOCUMENT_VALIDATION_ERROR' &&
        error.message
      ) {
        toggleSignValidationErrorModal(true, 'خطا', error.message);
      }
    }
  };
  const rejectContractHandler = async message => {
    try {
      setSignContractLoading(true);
      await ContractUtilsInstance.rejectById(message);
      await signedCallback();
      setSignContractLoading(false);
    } catch (error) {
      debugLogger('error in rejectContractHandler error: ', error);
      setSignContractLoading(false);
      if (
        error &&
        error.type === 'DOCUMENT_VALIDATION_ERROR' &&
        error.message
      ) {
        toggleSignValidationErrorModal(true, 'خطا', error.message);
      }
    }
  };
  const cancelContractHandler = async message => {
    try {
      setSignContractLoading(true);
      await ContractUtilsInstance.cancelById(message);
      await signedCallback();
      setSignContractLoading(false);
    } catch (error) {
      debugLogger('error in cancelContractHandler error: ', error);
      setSignContractLoading(false);
      if (
        error &&
        error.type === 'DOCUMENT_VALIDATION_ERROR' &&
        error.message
      ) {
        toggleSignValidationErrorModal(true, 'خطا', error.message);
      }
    }
  };

  // todo: ends refactor...

  // const cancelContractHandler = async message => {
  //   try {
  //     setCancelContractLoading(true);
  //
  //     const updateParams = {
  //       contractStateType: 'REJECTED',
  //       stateMessage: message,
  //       submitTime: new Date().getTime(),
  //       id: activeContractData.contractDto.id,
  //     };
  //
  //     const response = await rejectContractByIdService(updateParams);
  //
  //     if (response) {
  //       const loadedContract = await loadContract(
  //           activeContractData.contractDto.id,
  //           activeContractData.signerDto.SSOId,
  //       );
  //
  //       setContractStateDTOs(loadedContract.contractStateDTOs);
  //       setActiveContractData(loadedContract.contract);
  //       setSigner(loadedContract.signer);
  //
  //       const popAction = StackActions.pop(2);
  //
  //       navigation.dispatch(popAction);
  //
  //       await navigate(routesName.CONTRACT_DETAILS, {
  //         contractStateDTOs: loadedContract.contractStateDTOs,
  //         activeContractData: loadedContract.contract,
  //         signer: loadedContract.signer,
  //         isContractInitiator,
  //         initiatorInfo,
  //         states,
  //       });
  //     }
  //
  //     setCancelContractLoading(false);
  //   } catch (error) {
  //     if (error.errorMessage?.response?.status === 400) {
  //       Alert.alert(
  //           'لغو قرارداد',
  //           'همه امضا کنندگان، این قرارداد را تایید نموده اند!',
  //           [
  //             {
  //               text: 'بستن',
  //               onPress: () => null,
  //             },
  //           ],
  //           {
  //             cancelable: false,
  //           },
  //       );
  //     }
  //
  //     debugLogger('error in cancelHandler:', error);
  //     setCancelContractLoading(false);
  //   }
  // };

  // const fileHashValidation = async () => {
  //   try {
  //     if (activeContractData.contractDto.trusted) return Promise.resolve(true);
  //
  //     const filePath = getDownloadFilePath(`${savedFilename}.pdf`);
  //
  //     const fileResponse = await RNFS.readFile(filePath, 'base64');
  //
  //     const originalHash = activeContractData.contractDto.hash;
  //     const hash = getFileHash(fileResponse);
  //
  //     if (hash === originalHash) {
  //       return Promise.resolve(true);
  //     }
  //
  //     return Promise.resolve(false);
  //   } catch (error) {
  //     debugLogger('error in fileHashValidationByRemoteHash:', error);
  //     return Promise.reject(error);
  //   }
  // };

  // const getFileHash = base64File => {
  //   try {
  //     let localHash;
  //     let localHashString;
  //
  //     localHash = CryptoES.SHA256(base64File);
  //     localHashString = localHash.toString();
  //
  //     return localHashString;
  //   } catch (error) {
  //     debugLogger('error in getFileHash:', error);
  //     return error;
  //   }
  // };

  // const rejectContractHandler = async message => {
  //   try {
  //     if (dateValidation(activeContractData.contractDto.toDate)) {
  //       setRejectContractLoading(true);
  //
  //       const isHashValid = await fileHashValidation();
  //
  //       if (isHashValid) {
  //         const updateParams = {
  //           contractStateType: 'NOT_SIGNED',
  //           stateMessage: message,
  //           submitTime: new Date().getTime(),
  //           id: activeContractData.id,
  //         };
  //
  //         const updateStateResponse = await updateStateService(
  //             updateParams,
  //             activeContractData.contractDto.id,
  //             activeContractData.signerDto.SSOId,
  //         );
  //
  //         if (updateStateResponse) {
  //           const loadedContract = await loadContract(
  //               activeContractData.contractDto.id,
  //               activeContractData.signerDto.SSOId,
  //           );
  //
  //           setContractStateDTOs(loadedContract.contractStateDTOs);
  //           setActiveContractData(loadedContract.contract);
  //           setSigner(loadedContract.signer);
  //
  //           const popAction = StackActions.pop(2);
  //
  //           navigation.dispatch(popAction);
  //
  //           await navigate(routesName.CONTRACT_DETAILS, {
  //             contractStateDTOs: loadedContract.contractStateDTOs,
  //             activeContractData: loadedContract.contract,
  //             signer: loadedContract.signer,
  //             isContractInitiator,
  //             initiatorInfo,
  //             states,
  //           });
  //         }
  //
  //         await setButtonStateType(4);
  //       } else {
  //         toggleSignValidationErrorModal(
  //             true,
  //             'خطا',
  //             'فایل ذخیره شده با فایل قرارداد مغایرت دارد!',
  //         );
  //       }
  //
  //       setRejectContractLoading(false);
  //     } else {
  //       contractExpiredAlert();
  //     }
  //   } catch (error) {
  //     setRejectContractLoading(false);
  //   }
  // };

  // const signContractHandler = async () => {
  //   try {
  //     setSignContractLoading(true);
  //
  //     if (dateValidation(activeContractData.contractDto.toDate)) {
  //       const isHashValid = await fileHashValidation();
  //
  //       if (isHashValid) {
  //         const signParams = {
  //           contractDtoId: activeContractData.contractDto.id,
  //           contactId: activeContractData.signerDto.SSOId,
  //
  //           id: activeContractData.id,
  //           description: {
  //             documentSignDescription: '',
  //           },
  //         };
  //
  //         const response = await signContractByIdService(signParams);
  //         const data = response && response.data;
  //
  //         if (data) {
  //           const loadedContract = await loadContract(
  //             activeContractData.contractDto.id,
  //             activeContractData.signerDto.SSOId,
  //           );
  //
  //           setContractStateDTOs(loadedContract.contractStateDTOs);
  //           setActiveContractData(loadedContract.contract);
  //           setSigner(loadedContract.signer);
  //
  //           const popAction = StackActions.pop(2);
  //
  //           navigation.dispatch(popAction);
  //
  //           await navigate(routesName.CONTRACT_DETAILS, {
  //             contractStateDTOs: loadedContract.contractStateDTOs,
  //             activeContractData: loadedContract.contract,
  //             signer: loadedContract.signer,
  //             isContractInitiator,
  //             initiatorInfo,
  //             states,
  //           });
  //         }
  //       } else {
  //         toggleSignValidationErrorModal(
  //           true,
  //           'خطا',
  //           'فایل ذخیره شده با فایل قرارداد مغایرت دارد!',
  //         );
  //       }
  //
  //       setSignContractLoading(false);
  //     } else {
  //       toggleSignValidationErrorModal(
  //         true,
  //         'قرارداد',
  //         'قرارداد منقضی شده است!',
  //       );
  //     }
  //
  //     setSignContractLoading(false);
  //   } catch (error) {
  //     debugLogger(error);
  //     setSignContractLoading(false);
  //   }
  // };

  // const signByRootCertificateHandler = async password => {
  //   try {
  //     setSignContractLoading(true);
  //
  //     if (dateValidation(activeContractData.contractDto.toDate)) {
  //       const isHashValid = await fileHashValidation();
  //
  //       if (isHashValid) {
  //         setSignContractLoading(true);
  //
  //         let hash = '';
  //         if (activeContractData.contractDto?.content) {
  //           // if (isBase64Content(activeContractData.contractDto?.content)) {
  //           //   hash = atob(activeContractData.contractDto?.content);
  //           // }
  //           hash = activeContractData.contractDto.content;
  //         } else {
  //           hash = activeContractData.contractDto.hash;
  //         }
  //
  //         const ssoID = await getLoggedInUserSSOID();
  //
  //         if (ssoID) {
  //           ;
  //
  //           const signData = await generateCertificateSignature(
  //             password,
  //             hash,
  //             ssoID,
  //           );
  //
  //           ;
  //
  //           const filePath = getDownloadFilePath(`${savedFilename}.pdf`);
  //
  //           const fileResponse = await RNFS.readFile(filePath, 'base64');
  //
  //           await NativeEncryptionModule.signPdfByCertificate(
  //             fileResponse,
  //             signData.pairs.private,
  //             signData.certificate,
  //             'محمدرضا دهقانی',
  //           );
  //
  //           ;
  //
  //           const signParams = {
  //             sign: signData.signature,
  //             id: activeContractData.id,
  //             keyId: signData.keyId,
  //             certType: 'rishe',
  //           };
  //
  //           const response = await signByCertificateService(signParams);
  //
  //           const data = response && response.data;
  //
  //           if (data) {
  //             const loadedContract = await loadContract(
  //               activeContractData.contractDto.id,
  //               activeContractData.signerDto.SSOId,
  //             );
  //
  //             setContractStateDTOs(loadedContract.contractStateDTOs);
  //             setActiveContractData(loadedContract.contract);
  //             setSigner(loadedContract.signer);
  //
  //             const popAction = StackActions.pop(2);
  //
  //             navigation.dispatch(popAction);
  //
  //             await navigate(routesName.CONTRACT_DETAILS, {
  //               contractStateDTOs: loadedContract.contractStateDTOs,
  //               activeContractData: loadedContract.contract,
  //               signer: loadedContract.signer,
  //               isContractInitiator,
  //               initiatorInfo,
  //               states,
  //             });
  //           }
  //         }
  //       }
  //     }
  //
  //     setSignContractLoading(false);
  //   } catch (error) {
  //     debugLogger('error in signByRootCertificateHandler error: ', error);
  //
  //     if (error && error.data && error.data.errorMessage) {
  //       Toast.showToast(
  //         'danger',
  //         'امضا با گواهی',
  //         error.data.errorMessage?.toString() || 'خطا در امضا با گواهی',
  //       );
  //     }
  //
  //     setSignContractLoading(false);
  //   }
  // };

  // const signByNamadCertificateHandler = async password => {
  //   try {
  //     setSignContractLoading(true);
  //
  //     if (dateValidation(activeContractData.contractDto.toDate)) {
  //       const isHashValid = await fileHashValidation();
  //
  //       if (isHashValid) {
  //         setSignContractLoading(true);
  //
  //         let hash = '';
  //         if (activeContractData.contractDto?.content) {
  //           hash = activeContractData.contractDto.content;
  //         } else {
  //           hash = activeContractData.contractDto.hash;
  //         }
  //
  //         const ssoID = await getLoggedInUserSSOID();
  //
  //         if (ssoID) {
  //           const signData = await generateCertificateSignature(
  //             password,
  //             hash,
  //             ssoID,
  //             true,
  //           );
  //
  //           const signParams = {
  //             sign: signData.signature,
  //             id: activeContractData.id,
  //             keyId: signData.keyId,
  //             certType: 'namad',
  //           };
  //
  //           const response = await signByCertificateService(signParams);
  //           const data = response && response.data;
  //
  //           if (data) {
  //             const loadedContract = await loadContract(
  //               activeContractData.contractDto.id,
  //               activeContractData.signerDto.SSOId,
  //             );
  //
  //             setContractStateDTOs(loadedContract.contractStateDTOs);
  //             setActiveContractData(loadedContract.contract);
  //             setSigner(loadedContract.signer);
  //
  //             const popAction = StackActions.pop(2);
  //
  //             navigation.dispatch(popAction);
  //
  //             await navigate(routesName.CONTRACT_DETAILS, {
  //               contractStateDTOs: loadedContract.contractStateDTOs,
  //               activeContractData: loadedContract.contract,
  //               signer: loadedContract.signer,
  //               isContractInitiator,
  //               initiatorInfo,
  //               states,
  //             });
  //           }
  //         }
  //       }
  //     }
  //
  //     setSignContractLoading(false);
  //   } catch (error) {
  //     debugLogger('error in signByRootCertificateHandler error: ', error);
  //
  //     if (error && error.data && error.data.errorMessage) {
  //       Toast.showToast(
  //         'danger',
  //         '',
  //         error.data.errorMessage?.toString() || 'خطا در امضا با گواهی',
  //       );
  //     }
  //
  //     setSignContractLoading(false);
  //   }
  // };

  // const generateCertificateSignature = async (
  //   password,
  //   hash,
  //   ssoID,
  //   asNamad = false,
  // ) => {
  //   try {
  //     const signData = asNamad
  //       ? await signByNamadCertificate(password, hash, ssoID)
  //       : await signByRisheCertificate(password, hash, ssoID);
  //
  //     return Promise.resolve(signData);
  //   } catch (error) {
  //     Toast.showToast(
  //       'danger',
  //       'خطا در امضای سند',
  //       'رمز وارد شده صحیح نمی باشد!',
  //     );
  //     return Promise.reject(error);
  //   }
  // };

  const getCertificateType = () => {
    if (isNamadForced) {
      return 'namad';
    }
    if (isRisheForced) {
      return 'rishe';
    }
  };

  const onSignHandler = async fileNotExistCallback => {
    try {
      setCheckSignCertificatesLoading(true);
      if (isNamadForced) {
        Toast.showToast('danger', '', 'درحال حاضر این سند پشتیبانی نمی شود! ');
        setCheckSignCertificatesLoading(false);
      } else if (isRisheForced) {
        const certificate = await checkRisheCertificateExist();

        if (!certificate) {
          if (!userInfo?.asBusiness) {
            setCheckSignCertificatesLoading(false);

            return navigate(routesName.CERTIFICATE, {
              screen: routesName.CERTIFICATE,
            });
          }
        } else {
          setCheckSignCertificatesLoading(false);
          navigate(routesName.CONTRACT_SIGN, {
            onSignByRootCertificate: (password, fileNotExistCallback) =>
              signByRootCertificateHandler(password, fileNotExistCallback),
            onSignByNamadCertificate: password =>
              signByNamadCertificateHandler(password),
            onSign: () => signContractHandler(),
            isCertificate,
            certificateType: getCertificateType(),
            userInfo,
            contractNumber: toPersianDigits(
              activeContractData.contractDto.code,
            ),
            trusted: activeContractData?.contractDto.trusted,
          });

          setCheckSignCertificatesLoading(false);
        }
      }
      setCheckSignCertificatesLoading(false);
      navigate(routesName.CONTRACT_SIGN, {
        onSignByRootCertificate: (password, fileNotExistCallback) =>
          signByRootCertificateHandler(password, fileNotExistCallback),
        onSignByNamadCertificate: password =>
          signByNamadCertificateHandler(password),
        onSign: () => signContractHandler(),
        isCertificate,
        certificateType: getCertificateType(),
        userInfo,
        contractNumber: toPersianDigits(activeContractData.contractDto.code),
        trusted: activeContractData?.contractDto.trusted,
      });

      setCheckSignCertificatesLoading(false);
    } catch (error) {
      debugLogger('error in onSignHandler: ', error);
    }
  };

  const onCancellationHandler = () => {
    navigate(routesName.CONTRACT_CANCELLATION, {
      onCancellation: message => cancelContractHandler(message),
      userInfo,
      contractNumber: toPersianDigits(activeContractData.contractDto.code),
    });
  };

  const onRejectHandler = () => {
    navigate(routesName.CONTRACT_REJECT, {
      onReject: message => rejectContractHandler(message),
      userInfo,
      contractNumber: toPersianDigits(activeContractData.contractDto.code),
      trusted: activeContractData?.contractDto.trusted,
    });
  };

  const isDocumentStateCompleted = useCallback(() => {
    const sortedData = activeContractData.contractStateDTOs?.sort(
      (a, b) => b.submitTime - a.submitTime,
    );
    let isCompleted = false;
    if (sortedData) {
      isCompleted = sortedData.find(i => {
        if (
          i.contractStateType === 'SIGNED' &&
          sortedData[0].contractStateType === 'SIGNED'
        ) {
          return i;
        }
        if (
          i.contractStateType === 'NOT_SIGNED' &&
          sortedData[0].contractStateType === 'NOT_SIGNED'
        ) {
          return i;
        }
        if (
          i.contractStateType === 'REJECTED' &&
          sortedData[0].contractStateType === 'REJECTED'
        ) {
          return i;
        }
      });
    }

    return !!isCompleted;
  }, [activeContractData.contractStateDTOs]);

  return (
    <>
      <SignValidationErrorModal
        visible={signValidationErrorModal.show}
        title={signValidationErrorModal.title}
        description={signValidationErrorModal.description}
        onClose={() => toggleSignValidationErrorModal(false)}
      />

      {isFocused ? (
        <Container style={styles.wrapper}>
          {tabState === 'SIGN' ? (
            <Sign />
          ) : (
            <>
              <ContractTitle
                // type="قرارداد کار"
                // companyName="فناپ"
                // name={getSignerFullName(signer)}
                // date={getPersianDate(activeContractData.contractDto.fromDate).date}
                companyName={activeContractData.contractDto.title}
              />
              <ContractInformation
                date={
                  getPersianDate(activeContractData.contractDto.fromDate).date
                }
                expireTime={
                  getPersianDate(activeContractData.contractDto.toDate).date
                }
                contractNumber={toPersianDigits(
                  activeContractData.contractDto.code,
                )}
                creator={getSignerFullName(initiatorInfo)}
              />
              <View>
                <Text style={[styles.contractInformationItemText]}>
                  ایجاد کننده
                </Text>
                <Badge
                  text={getSignerFullName(initiatorInfo)}
                  type="secondary"
                  isBold
                />
              </View>

              {activeContractData.contractStateDTOs && (
                <RenderMessage
                  data={activeContractData.contractStateDTOs}
                  isContractInitiator={isContractInitiator}
                />
              )}
              {isDocumentExpired && (
                <GradientBorderMessage
                  text="این سند منقضی شده است"
                  borderColor="#D20F29"
                  textColor="#D20F29"
                />
              )}

              {isCertificate && !isDocumentStateCompleted() && (
                <>
                  {isRisheForced && (
                    <GradientBorderMessage
                      text="امضا این سند، تنها با خرید گواهی امضا مرکز ریشه ممکن است
              به درخواست ایجادکننده، شما باید برای امضای این سند، گواهی امضا خریداری کنید."
                    />
                  )}
                  {isNamadForced && (
                    <GradientBorderMessage
                      text="امضا این سند، تنها با خرید گواهی امضا نماد بانک مرکزی ممکن است
              به درخواست ایجادکننده، شما باید برای امضای این سند، گواهی امضا خریداری کنید."
                    />
                  )}
                </>
              )}

              <Description
                title="توضیحات"
                text={activeContractData.contractDto.description}
              />
              <ContractStatus
                data={contractStateDTOs}
                getSignerFullName={getSignerFullName}
                states={states}
                userId={userInfo?.ssoId}
              />

              {/*TODO: handle CheckSignOrRejectButtons and SignOrRejectButtons component for render buttons with any document(trusted, no trusted)...*/}
              {activeContractData.contractDto.trusted ? (
                <View>
                  <CheckSignOrRejectButtons
                    documentStates={activeContractData.contractStateDTOs}
                    state={buttonStateType}
                    setState={setButtonStateType}
                    isInitiator={isContractInitiator}
                    onReceipt={downloadReceiptHandler}
                    onReceiptLoading={downloadReceiptLoading}
                    onSign={onSignHandler}
                    onReject={onRejectHandler}
                    onCancellation={cancelContractHandler}
                    onCancellationLoading={cancelContractLoading}
                    isExpired={isDocumentExpired}
                    signLoading={checkSignCertificatesLoading}
                  />
                </View>
              ) : (
                <View style={styles.footerWrapper}>
                  {buttonStateType === 1 && (
                    <Text style={styles.footerText}>
                      برای دانلود یا به اشتراک گذاری رسید این سند می توانید از
                      کلید های زیر استفاده نمائید.
                    </Text>
                  )}

                  <SignOrRejectButtons
                    data={activeContractData.contractStateDTOs}
                    buttonStateType={buttonStateType}
                    downloadContractHandler={downloadContractHandler}
                    downloadContractLoading={downloadContractLoading}
                    contractDecryptHandler={contractDecryptHandler}
                    getSecretKeyBusinessLoading={decryptContractLoading}
                    setButtonStateType={setButtonStateType}
                    fileNamePodSpace={activeContractData.contractFileName}
                    decryptAndSeeContract={decryptAndSeeContract}
                    isContractInitiator={isContractInitiator}
                    cancelContractHandler={cancelContractHandler}
                    cancelContractHandlerLoading={cancelContractLoading}
                    seeContractLoading={decryptContractLoading}
                    downloadReceiptHandler={downloadReceiptHandler}
                    downloadReceiptLoading={downloadReceiptLoading}
                    setModalType={setModalType}
                    downloadError={downloadError}
                    code={activeContractData.contractDto.code}
                    onSign={onSignHandler}
                    onReject={onRejectHandler}
                    onCancellation={onCancellationHandler}
                    isDocumentExpired={isDocumentExpired}
                    openDocument={openDocument}
                    openDocumentLoading={openDocumentLoading}
                    signLoading={checkSignCertificatesLoading}
                  />
                </View>
              )}

              <ConfirmModal
                refRBSheet={refRBSheet}
                disabled={signContractLoading || rejectContractLoading}
                rejectContractHandler={rejectContractHandler}
                signContractHandler={signContractHandler}
                modalType={modalType}
                setModalType={setModalType}
                cancelContractHandler={cancelContractHandler}
                signByRootCertificate={signByRootCertificateHandler}
                signByNamadCertificate={signByNamadCertificateHandler}
                byNamad={true}
              />
            </>
          )}
        </Container>
      ) : (
        <FullScreenLoading />
      )}

      <DownloadAndDecryptModal
        refRBSheet={refRBSheetDownloadDocument}
        disabled={false}
        visible={showOpenDocumentModal}
        loading={openDocumentLoading}
        onClose={() => setShowOpenDocumentModal(false)}
      />

      {showFileUrlBanner && buttonStateType === 1 && (
        <Banner
          text="     توجه! فایل رمزگشایی شده سند در پوشه Downloads/paraph ذخیره می‌شود و
                نگهداری آن به عهده شماست."
          onPress={() => setShowFileUrlBanner(false)}
        />
      )}
    </>
  );
};

export default Index;
