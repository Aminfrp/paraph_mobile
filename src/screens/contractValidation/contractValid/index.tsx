import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {View} from 'react-native';
import Button from '../../../components/button';
import Container from '../../../components/container';
import ContractInformation from '../../../components/contractViewElements/contractInformation';
import ContractStatus from '../../../components/contractViewElements/contractStatus';
import ContractTitle from '../../../components/contractViewElements/contractTitle';
import Description from '../../../components/contractViewElements/description';
import RenderMessage from '../../../components/contractViewElements/renderMessage';
import FileUploadView from '../../../components/fileUploadView';
import FullScreenLoading from '../../../components/fullScreenLoading';
import * as keyStorage from '../../../constants/keyStorage';
import {GlobalContext} from '../../../context';
import {GlobalAction} from '../../../context/actions';
import {getAsyncStorage} from '../../../helpers/asyncStorage';
import {toPersianDigits} from '../../../helpers/convertNumber';
import {getPersianDate} from '../../../helpers/date';
import {getCurRouteName} from '../../../helpers/getActiveRouteState';
import getSignerFullName from '../../../modules/dataNormalizers/getSignerFullName';
import {downloadLocalFile} from '../modules/downloadHandler';
import generateReceipt from '../modules/generateReceipt';
import styles from '../style';

type PropsModel = {
  route: any;
};

const Index: React.FC<PropsModel> = props => {
  const {route} = props;
  const navigation = useNavigation();
  const {globalDispatch} = useContext<any>(GlobalContext);
  const paramsState = route.params;

  const isFocused = useIsFocused();
  const [isContractInitiator, setIsContractInitiator] = useState(false);
  const [activeContractData, setActiveContractData] = useState(
    paramsState.contract,
  );
  const [contractStateDTOs, setContractStateDTOs] = useState(
    paramsState?.contractStateDTOs,
  );
  const [generateReceiptLoading, setGenerateReceiptLoading] = useState(false);

  const initiatorInfo = paramsState.initiatorInfo;
  const states = paramsState.states;
  const value = paramsState.value;
  const [signer, setSigner] = useState(paramsState.signer);

  const savedFilename = activeContractData?.contractFileName
    ?.split('\\')
    ?.reverse()[0]
    ?.split('.')[0];

  useFocusEffect(
    useCallback(() => {
      const curRoute = getCurRouteName(navigation.getState);
      globalDispatch(GlobalAction.toggleActiveRouteName(curRoute));
    }, []),
  );

  useEffect(() => {
    initiatorInitializer();
  }, [activeContractData, contractStateDTOs]);

  const initiatorInitializer = async () => {
    const userContactInfo = await getAsyncStorage(
      'object',
      keyStorage.CONTACT_INFO,
    );

    await setIsContractInitiator(
      Number(userContactInfo.id) ===
        activeContractData?.contractDto?.initiatorSSOId,
    );
  };

  const generateReceiptHandler = () =>
    generateReceipt({
      savedFilename,
      activeContractData,
      contractStateDTOs,
      initiatorInfo,
      states,
      signer,
    })(setGenerateReceiptLoading);

  const downloadHandler = () => downloadLocalFile(value.fileCopyUri);

  return (
    <>
      {isFocused ? (
        <Container style={styles.wrapper}>
          <FileUploadView value={value} icon={true} onPress={downloadHandler} />
          <View style={{marginTop: 25}}>
            <ContractTitle
              companyName={activeContractData?.contractDto?.title}
            />
          </View>
          <ContractInformation
            date={
              getPersianDate(activeContractData?.contractDto?.fromDate).date
            }
            contractNumber={toPersianDigits(
              activeContractData?.contractDto?.code,
            )}
            creator={getSignerFullName(initiatorInfo)}
            expireTime={
              getPersianDate(activeContractData?.contractDto?.toDate).date
            }
          />
          {activeContractData?.contractStateDTOs && (
            <RenderMessage
              data={activeContractData?.contractStateDTOs}
              isContractInitiator={isContractInitiator}
            />
          )}
          <ContractStatus
            data={contractStateDTOs}
            getSignerFullName={getSignerFullName}
            states={states}
          />
          <Description
            title="توضیحات"
            text={activeContractData?.contractDto.description}
          />
          <View style={styles.buttonWrapper}>
            <View style={{marginTop: 10, marginHorizontal: 5, width: '50%'}}>
              <Button
                title="دریافت رسید"
                disabled={generateReceiptLoading}
                loading={generateReceiptLoading}
                onPress={generateReceiptHandler}
                type="primary"
              />
            </View>
          </View>
        </Container>
      ) : (
        <FullScreenLoading />
      )}
    </>
  );
};

export default Index;
