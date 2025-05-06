import React from 'react';
import {FlatList, ListRenderItem} from 'react-native';
import ContractItem from './contractItem';
import {getPersianDate} from '../../helpers/date';
import {ContractModel} from '../../model/contract.model';
import {ContractStatesModel} from '../../model/contractStates.model';

type PropsModel = {
  data: ContractModel[];
  onCardPress: (input: ContractModel) => void;
  loadMoreData: () => void;
  dataEnded: boolean;
  states: ContractStatesModel;
};

const Index: React.FC<PropsModel> = props => {
  const {data, onCardPress, loadMoreData, states} = props;

  const renderItem: ListRenderItem<any> = ({item, index}: any) => (
    <ContractItem
      date={getPersianDate(item?.contractDto?.fromDate)}
      item={item}
      index={index}
      dataLength={data && data.length}
      onCardPress={onCardPress}
      states={states}
      dataEnded={false}
    />
  );

  return (
    <FlatList
      data={data && data}
      renderItem={renderItem}
      keyExtractor={item => item.contractDto?.id.toString()}
      onEndReached={loadMoreData}
      onEndReachedThreshold={0.5}
    />
  );
};

export default Index;
