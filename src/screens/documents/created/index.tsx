import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import useActiveRouteNameSetter from '../../../hooks/useActiveRouteNameSetter';
import {UserContext} from '../../../context';
import {ContractModel} from '../../../model/contract.model';
import {ContractStatesModel} from '../../../model/contractStates.model';
import {
  getAllContractsService,
  getContractStatesService,
  getInitiatorListByContractIdService,
  getUserProfileListService,
} from '../../../apis';
import {getAsyncStorage} from '../../../helpers/asyncStorage';
import contractsNormalizer from '../../../modules/dataNormalizers/contractsNormalizer';
import * as keyStorage from '../../../constants/keyStorage';
import {UserProfileModel} from '../../../model/userProfile.model';
import {ContractPaginationModel} from '../../../model/contractPagination.model';
import {Logger} from '../../../modules/log/logger';
import loadContract from '../../../modules/dataNormalizers/loadContract';
import * as routesName from '../../../constants/routesName';
import AbsoluteLoading from '../../../components/absoluteLoading';
import {View} from 'react-native';
import styles from '../style';
import ContractList from '../../../components/contractList';
import FullScreenLoading from '../../../components/fullScreenLoading';
import {GetContractsInputModel} from '../../../model/getContractsInput.model.ts';

type FilterModel = Partial<GetContractsInputModel>;

const initialFilter: FilterModel = {
  pageSize: 10,
  pageNumber: 0,
  reset: true,
  accountOwner: true,
  contractStateTypesNot: '7&contractStateTypesNot=8',
};

const Index: React.FC = () => {
  const {navigate} = useNavigation();
  const {userState} = useContext<any>(UserContext);
  const userTokenInfo = userState.userTokenInfo;
  const isFocused = useIsFocused();
  const [filter, setFilter] = useState<FilterModel>({
    ...initialFilter,
  });
  const [data, setData] = useState<ContractModel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDataEnded, setIsDataEnded] = useState<boolean>(false);
  const [states, setStates] = useState<ContractStatesModel | null>(null);

  useActiveRouteNameSetter(); // set active route name into globalState...

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
    !reset && data.currentPageNumber + 1 >= data.totalPages;

  const loadData = async (filterParams: FilterModel) => {
    try {
      setLoading(true);
      const {reset, ...params} = filterParams;

      const contactInfo = await getContactInfo();

      const postParams: FilterModel = {
        ...params,
        contactId: contactInfo.id,
        isInitiator: true,
      };

      const dataResponse: ContractPaginationModel = await getData(postParams);

      const normalizedData = contractsNormalizer(
        dataResponse.contractHashAndSignersMap,
        Number(contactInfo.id),
      );

      const contractsWithInitiatorInfoList = await dataWithInitiatorInfo(
        normalizedData,
      );
      const dataEnded = getIsDataEnded(dataResponse, reset);

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

  const getData = async (postData: FilterModel) => {
    try {
      const response = await getAllContractsService(postData);
      const data = response && response.data;

      return Promise.resolve(data);
    } catch (error) {
      Logger.debugLogger('error in getData:', error);

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

  const getInitiatorsInfo = (users: UserProfileModel[], item: ContractModel) =>
    users.find(el => Number(el.id) === item.contractDto.initiatorSSOId);

  const dataWithInitiatorInfo = async (data: ContractModel[]) => {
    try {
      const normalizedData = [];

      const ids = getDataIds(data);
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

  const setDataToState = (dataList: ContractModel[], reset?: boolean) => {
    if (reset) {
      setData(dataList);
    } else {
      setData(prev => [...prev, ...dataList]);
    }
  };

  const onCardPress = async (data: ContractModel) => {
    try {
      setLoading(true);
      const userContactInfo = await getContactInfo();
      const userSSOID = Number(userContactInfo.id);

      const {contractStateDTOs, contract, signer} = await loadContract(
        data.contractDto.id,
        userSSOID,
      );

      await setLoading(false);

      const screenParams = {
        contract,
        contractStateDTOs,
        signer,
        initiatorInfo: data.initiatorInfo,
        states,
      };

      // @ts-ignore
      navigate(routesName.CONTRACT, {
        screen: routesName.CONTRACT,
        params: screenParams,
      });
    } catch (error) {
      Logger.debugLogger('error in contractClicked:', error);
      setLoading(false);
    }
  };

  const loadMoreData = () => {
    if (loading || isDataEnded) return;

    setFilter(prev => ({
      ...prev,
      reset: false,
      pageNumber: (prev.pageNumber ?? 0) + 1,
    }));
  };

  return (
    <>
      {loading && <AbsoluteLoading />}

      {!userTokenInfo?.loading && isFocused && states ? (
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
