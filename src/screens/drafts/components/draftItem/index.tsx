import React from 'react';
import {View, Text, Image} from 'react-native';
import Card from '../../../../components/contractList/card';
import {
  getContractStatusBadgeText,
  getContractStatusBadgeType,
} from '../../../../modules/dataNormalizers/contractStatusBadge';
import {toPersianDigits} from '../../../../helpers/convertNumber';
import getSignerFullName from '../../../../modules/dataNormalizers/getSignerFullName';
import {NormalizedDateObjModel} from '../../../../model/normalizedDateObj.model';
import styles from '../../../../components/contractList/style';
import {DraftModel} from '../../../../model/draft.model.ts';

type PropsModel = {
  item: DraftModel;
  index: number;
  dataLength: number;
  dataEnded: boolean;
  states: {};
  date: NormalizedDateObjModel;
  onCardPress: (item: DraftModel) => void;
};

const Index: React.FC<PropsModel> = props => {
  const {item, index, dataLength, onCardPress, date, states} = props;

  const badgeType = (): string => {
    if (item.draftStateDtos && item.draftStateDtos.length > 0) {
      return getContractStatusBadgeType(item.draftStateDtos[0].draftStateType);
    }
    return '';
  };

  const badgeText = (): string => {
    if (item.draftStateDtos && item.draftStateDtos.length > 0) {
      return getContractStatusBadgeText(item.draftStateDtos[0].draftStateType);
    }
    return '';
  };

  return (
    <View style={styles.contractItemWrapper}>
      <View style={styles.contractItemDateWrapper}>
        <Text style={styles.contractDayText}>{date?.day || ''}</Text>
        <Text style={styles.contractMonthText}>
          {date?.persianMontName || ''}
        </Text>
        <Text style={styles.contractYearText}>{date?.year || ''}</Text>
      </View>
      <View style={styles.contractItemSeparatorWrapper}>
        {index === 0 && (
          <Image source={require('../../../../assets/img/gray_circle.png')} />
        )}
        <Image
          source={require('../../../../assets/img/gray_solid_border.png')}
          style={{height: 30}}
        />
        <Image
          source={require('../../../../assets/img/gray_dashed_border.png')}
          style={{height: 110}}
        />
        {dataLength - 1 === index && (
          <Image source={require('../../../../assets/img/gray_circle.png')} />
        )}
      </View>
      <View style={styles.contractItemCardWrapper}>
        <Card
          type={
            item && item.contractDto && toPersianDigits(item.contractDto.code)
          }
          company={
            item && item.initiatorInfo && getSignerFullName(item.initiatorInfo)
          }
          badgeType={badgeType()}
          badgeText={badgeText()}
          title={item && item.contractDto && item.contractDto.title}
          onPress={() => onCardPress(item)}
        />
      </View>
    </View>
  );
};

export default Index;
