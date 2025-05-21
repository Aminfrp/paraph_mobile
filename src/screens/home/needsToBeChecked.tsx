import React, {useState, useContext, useCallback, useEffect} from 'react';
import {Text, View} from 'react-native';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {UserContext} from '../../context';
import FullScreenLoading from '../../components/fullScreenLoading';
import AbsoluteLoading from '../../components/absoluteLoading';
import styles from './style';
import * as routesName from '../../constants/routesName';
import loadContract from '../../modules/dataNormalizers/loadContract';
import {
  getAllContractsService,
  getContractStatesService,
  getInitiatorListByContractIdService,
  getUserProfileListService,
} from '../../apis';
import {getAsyncStorage} from '../../helpers/asyncStorage';
import * as keyStorage from '../../constants/keyStorage';
import contractsNormalizer from '../../modules/dataNormalizers/contractsNormalizer';
import ContractList from '../../components/contractList';
import debugLogger from '../../helpers/debugLogger';
import {ContractStatesModel} from '../../model/contractStates.model.ts';
import {Logger} from '../../modules/log/logger.ts';
import {ContractPaginationModel} from '../../model/contractPagination.model.ts';
import {ContractModel} from '../../model/contract.model.ts';
import {UserProfileModel} from '../../model/userProfile.model.ts';
import {GetContractsInputModel} from '../../model/getContractsInput.model.ts';

const initialFilter: Partial<GetContractsInputModel> = {
  pageSize: 10,
  pageNumber: 0,
  reset: true,
  accountOwner: false,
  contractStateTypes: '1&contractStateTypes=2&contractStateTypes=3',
  contractStateTypesNot:
    '4&contractStateTypesNot=5&contractStateTypesNot=6&contractStateTypesNot=-1&contractStateTypesNot=8',
};

const Index: React.FC = () => {
  const {
    userState: {userTokenInfo},
  } = useContext<any>(UserContext);
  const {navigate} = useNavigation();
  const [filter, setFilter] = useState<Partial<GetContractsInputModel>>({
    ...initialFilter,
  });
  const isFocused = useIsFocused();
  const [getContractByIdLoading, setGetContractByIdLoading] = useState(false);
  const [data, setData] = useState<ContractModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState<ContractStatesModel>({});
  const [isDataEnded, setIsDataEnded] = useState(false);

  useEffect(() => {
    getStates().then(() => {});
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData(filter).then(() => null);
      return () => {};
    }, [filter]),
  );

  const getStates = async () => {
    try {
      const response = await getContractStatesService();
      const data = response && response.data;
      setStates(data);
      return Promise.resolve(data);
    } catch (error) {
      Logger.debugLogger('error in getContractStatesHandler:', error);
      return Promise.reject(error);
    }
  };

  const getContactInfo = async () => {
    return await getAsyncStorage('object', keyStorage.CONTACT_INFO);
  };

  const getIsDataEnded = (data: ContractPaginationModel, reset?: boolean) =>
    !reset && data.totalPages <= data.currentPageNumber;

  const loadData = async (filterParams: Partial<GetContractsInputModel>) => {
    try {
      setLoading(true);
      const {reset, ...params} = filterParams;

      const contactInfo = await getContactInfo();

      const postParams: Partial<GetContractsInputModel> = {
        ...params,
        contactId: contactInfo.id,
      };

      const dataResponse: ContractPaginationModel = await getData(postParams);

      const normalizedData = contractsNormalizer(
        dataResponse.contractHashAndSignersMap,
        Number(contactInfo.id),
      );

      const dataEnded = getIsDataEnded(dataResponse, reset);

      const contractsWithInitiatorInfoList = await dataWithInitiatorInfo(
        normalizedData,
      );

      setDataToState(contractsWithInitiatorInfoList, reset);
      setIsDataEnded(dataEnded);
      setLoading(false);

      return Promise.resolve(data);
    } catch (error) {
      Logger.debugLogger('error in getData:', error);
      setLoading(false);

      return Promise.reject(error);
    }
  };

  const getInitiatorsInfo = (users: UserProfileModel[], item: ContractModel) =>
    users.find(el => Number(el.id) === item.contractDto.initiatorSSOId);

  const dataWithInitiatorInfo = async (data: ContractModel[]) => {
    try {
      const normalizedData = [];

      const ids = getDataIds(data);
      // const id = data[0].contractDto.id;

      const userList = await getUsersProfile(ids);

      for (let item of data) {
        let initiatorInfo;
        if (userList) {
          initiatorInfo = getInitiatorsInfo(userList, item);
        }

        normalizedData.push({
          ...item,
          initiatorInfo,
        });
      }

      return Promise.resolve(normalizedData);
    } catch (error) {
      Logger.debugLogger('dataWithInitiatorInfo error', error);
      return Promise.reject(error);
    }
  };

  const getDataIds = (data: ContractModel[]) => {
    let index = 0;

    return data.map(el => {
      const obj = {index, value: el.contractDto.id};
      index++;

      return obj;
    });
  };

  const getUsersProfile = async (ids: {value: number; index: number}[]) => {
    try {
      const response = await getInitiatorListByContractIdService(ids, 1);
      const users: UserProfileModel[] = response && response.data;

      return Promise.resolve(users);
    } catch (error) {}
  };

  const setDataToState = (dataList: ContractModel[], reset?: boolean) => {
    debugger;
    if (reset) {
      setData(dataList);
    } else {
      setData(prev => [...prev, ...dataList]);
    }
  };

  const getData = async (postData: Partial<GetContractsInputModel>) => {
    try {
      const response = await getAllContractsService(postData);
      const data = response && response.data;

      return Promise.resolve(data);
    } catch (error) {
      Logger.debugLogger('error in getData:', error);

      return Promise.reject(error);
    }
  };

  debugLogger(filter);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setFilter({...initialFilter});
      };
    }, []),
  );

  const onCardPress = async (data: ContractModel) => {
    try {
      setGetContractByIdLoading(true);

      const {contractStateDTOs, contract, signer} = await loadContract(
        data.contractDto.id,
        data.signerDto.SSOId,
      );

      setGetContractByIdLoading(false);

      // @ts-ignore
      navigate(routesName.CONTRACT, {
        screen: routesName.CONTRACT,
        params: {
          contract,
          contractStateDTOs,
          signer,
          initiatorInfo: data.initiatorInfo,
          states,
        },
      });
    } catch (error) {
      debugLogger('error in contractClicked:', error);

      setGetContractByIdLoading(false);
    }
  };

  const loadMoreData = () => {
    if (data && data.length > 0) {
      setFilter({
        ...filter,
        reset: false,
        pageNumber: filter.pageNumber && filter.pageNumber + 1,
      });
    }
  };

  return (
    <>
      {getContractByIdLoading && <AbsoluteLoading />}
      {loading && <AbsoluteLoading />}
      {!userTokenInfo?.loading && isFocused ? (
        <View style={styles.wrapper}>
          <ContractList
            data={data}
            onCardPress={onCardPress}
            loadMoreData={loadMoreData}
            dataEnded={isDataEnded}
            states={states}
          />
        </View>
      ) : (
        <FullScreenLoading />
      )}
    </>
  );
};

export default Index;
