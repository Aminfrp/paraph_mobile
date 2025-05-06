import React from 'react';
import {FlatList, ListRenderItem} from 'react-native';
import EmptyList from '../../../../components/emptyList';
import DraftItem from '../draftItem';
import {getPersianDate} from '../../../../helpers/date';
import {ContractStatesModel} from '../../../../model/contractStates.model.ts';
import {DraftModel} from '../../../../model/draft.model.ts';

type PropsModel = {
  data: DraftModel[];
  onCardPress: (input: DraftModel) => void;
  loadMoreData: () => void;
  dataEnded: boolean;
  states: ContractStatesModel;
  refreshing: boolean;
};

const Index: React.FC<PropsModel> = props => {
  const {data, onCardPress, loadMoreData, refreshing, states} = props;

  const renderItem: ListRenderItem<any> = ({item, index}: any) => (
    <DraftItem
      date={getPersianDate(item.draftStateDtos[0]?.submitTime)}
      item={{
        ...item,
        contractDto: {
          code: 'پیشنویس',
          title: item.documentTitle,
        },
        draftStateDtos: [
          {...item.draftStateDtos[0], draftStateType: 'SUBMITTED'},
        ],
      }}
      index={index}
      dataLength={data && data.length}
      onCardPress={onCardPress}
      states={states}
      dataEnded={false}
    />
  );

  const renderEmptyComponent = () =>
    !refreshing ? (
      <EmptyList text="شما هیچ سندی برای بررسی در لیست انتظار خود ندارید." />
    ) : (
      <></>
    );

  return (
    <FlatList
      data={data && data}
      renderItem={renderItem}
      keyExtractor={item => item.contractDto?.id.toString()}
      onEndReached={loadMoreData}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={renderEmptyComponent}
    />
  );
};

export default Index;
