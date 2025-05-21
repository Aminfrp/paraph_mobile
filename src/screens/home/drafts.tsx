import React, {useCallback, useState} from 'react';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import DraftList from '../drafts/components/draftList';
import FullScreenLoading from '../../components/fullScreenLoading';
import AbsoluteLoading from '../../components/absoluteLoading';
import * as routesName from '../../constants/routesName';
import {
  getAllDraftsService,
  getInitiatorListByContractIdService,
  getUserProfileListService,
} from '../../apis';
import debugLogger from '../../helpers/debugLogger';
import getNormalizedDrafts from '../../modules/dataNormalizers/getNormalizedDrafts';
import {DraftModel} from '../../model/draft.model.ts';
import {SignerDto} from '../../model/contract.model.ts';
import {UserProfileModel} from '../../model/userProfile.model.ts';
import {Logger} from '../../modules/log/logger.ts';
import {Text} from 'react-native';

type FilterModel = {
  reset?: boolean;
  pageNumber: number;
  pageSize: number;
};

const initialFilter: FilterModel = {
  reset: true,
  pageNumber: 0,
  pageSize: 50,
};

const Index: React.FC = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [navigateLoading, setNavigateLoading] = useState(false);
  const [data, setData] = useState<DraftModel[]>([]);
  const [filter, setFilter] = useState({...initialFilter});
  const [isDataEnded, setIsDataEnded] = useState(false);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setFilter({...initialFilter});
      };
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      filter && getDrafts(filter);

      return () => {};
    }, [filter]),
  );

  const getDrafts = async (postData: FilterModel) => {
    const {reset, ...rest} = postData;
    try {
      setLoading(true);
      const response = await getAllDraftsService(rest);
      const responseData = response && response.data;
      const drafts = await normalizeDraftsWithInitiatorInfo(
        responseData.draftDtoList,
      );

      const normalizedDrafts = getNormalizedDrafts(drafts);

      if (reset) {
        setData(normalizedDrafts);
      } else {
        const _data = [...data, ...normalizedDrafts];
        setData(_data);
      }

      if (responseData.totalElements === normalizedDrafts.length) {
        setIsDataEnded(true);
      }

      setLoading(false);
    } catch (error) {
      debugLogger('error in getDrafts: ', error);
      setLoading(false);
    }
  };

  const getDataIds = (data: DraftModel[]) => {
    let index = 0;

    return data.map(el => {
      const obj = {index, value: el.id};
      index++;

      return obj;
    });
  };

  const getUsersProfile = async (ids: {value: number; index: number}[]) => {
    try {
      const response = await getInitiatorListByContractIdService(ids, 2);
      const users: UserProfileModel[] = response && response.data;

      return Promise.resolve(users);
    } catch (error) {
      Logger.debugLogger('error in getUsersProfile:', error);
    }
  };

  const getInitiatorsInfo = (users: UserProfileModel[], item: DraftModel) =>
    users.find(el => el.id === item.submitterSSOId);

  const normalizeDraftsWithInitiatorInfo = async (data: DraftModel[]) => {
    try {
      const normalizedData = [];
      const ids = getDataIds(data);
      const userList = await getUsersProfile(ids);

      for (let item of data) {
        let initiatorInfo;
        if (userList) {
          console.log(item, userList);
          initiatorInfo = getInitiatorsInfo(userList, item);
        }

        normalizedData.push({
          ...item,
          initiatorInfo,
        });
      }

      console.log('normalizedData', normalizedData);

      debugLogger('normalizedData', normalizedData);
      return Promise.resolve(normalizedData);
    } catch (error) {
      debugLogger('normalizeContractsWithInitiatorInfo error', error);
      return Promise.reject(error);
    }
  };

  const loadMoreData = () => {
    if (data && data.length > 0)
      setFilter({...filter, reset: false, pageNumber: filter.pageNumber + 1});
  };

  const getDraftItemSigners = async (draftId: number, submitTime: number) => {
    try {
      const creatorResponse = await getInitiatorListByContractIdService(
        [{index: 0, value: draftId}],
        2,
      );
      const creator = creatorResponse && creatorResponse.data[0];
      const signerResponse = await getUserProfileListService(draftId, 2);
      const signers = signerResponse && signerResponse.data;
      const userList =
        signers.length > 0 &&
        signers.map((el: UserProfileModel) => ({
          contractStateType: 'SUBMITTED',
          publickey: null,
          sign: null,
          stateMessage: null,
          submitTime,
          user: {
            ...el,
            firstName: el.family_name,
            username: el.preferred_username,
            lastName: '',
            ssoId: el.SSOId,
          },
        }));
      userList.unshift({
        contractStateType: 'SUBMITTED',
        publickey: null,
        sign: null,
        stateMessage: null,
        submitTime,
        user: {...creator},
      });
      return userList;
    } catch (error) {
      Logger.debugLogger('error in getDraftItemSigners: ', error);
      return Promise.reject(error);
    }
  };

  const onCardPress = async <T extends DraftModel>(draft: T) => {
    try {
      setNavigateLoading(true);
      const submitTime =
        draft.draftStateDtos && draft.draftStateDtos[0].submitTime;
      const signers = await getDraftItemSigners(draft.id, Number(submitTime));

      if (signers) {
        const screenDraftData = {
          ...draft,
          draftSigners: draft.draftSigners.map(el => ({
            ...el,
            ssoId: el.SSOId,
          })),
          creator: signers[0],
          signers: [...signers],
        };

        // @ts-ignore
        navigation.navigate(routesName.CREATE_DOCUMENT_BY_DRAFT, {
          draft: screenDraftData,
        });
      }

      setNavigateLoading(false);
    } catch (error) {
      debugLogger('error in onCardPress: ', error);
      setNavigateLoading(false);
    }
  };

  return (
    <>
      {loading && <AbsoluteLoading />}
      {navigateLoading && <AbsoluteLoading />}
      {isFocused ? (
        <DraftList
          data={data}
          onCardPress={onCardPress}
          loadMoreData={loadMoreData}
          refreshing={loading}
          dataEnded={isDataEnded}
          states={{}}
        />
      ) : (
        <FullScreenLoading />
      )}
    </>
  );
};

export default Index;
