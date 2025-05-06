import React from 'react';
import {Text, View} from 'react-native';
import colors from '../../../assets/theme/colors';
import Divider from '../../../components/divider';
import {toPersianDigits} from '../../../helpers/convertNumber';
import {getPersianDate} from '../../../helpers/date';
import debugLogger from '../../../helpers/debugLogger';
import {getContractStatusBadgeText} from '../../../modules/dataNormalizers/contractStatusBadge';
import styles from './style';

const Index = props => {
  const {data, getSignerFullName, states, userId} = props;

  debugLogger('Data', data);

  const getColorType = type => {
    switch (type) {
      case 'SUBMITTED': {
        return 'warning';
      }
      case 'DOWNLOADED': {
        return 'warning';
      }
      case 'NOT_SIGNED': {
        return 'danger';
      }
      case 'OPENED': {
        return 'primary';
      }
      case 'FAIL_TO_FETCH': {
        return 'info';
      }
      case 'SIGNED': {
        return 'success';
      }
      case 'REJECTED': {
        return 'danger';
      }

      default: {
        return 'warning';
      }
    }
  };

  const getBgColor = type => {
    const colorType = getColorType(type);
    switch (colorType) {
      case 'danger':
        return colors.primary.danger;
      case 'primary':
        return colors.primary.purple;
      case 'success':
        return colors.primary.success;
      case 'secondary':
        return colors.primary.paleGray;
      case 'info':
        return colors.primary.info;
      case 'warning':
        return colors.primary.warning;
      default:
        return colors.primary.purple;
    }
  };

  return (
    <View style={[styles.contractStatusWrapper, {marginTop: 15}]}>
      <Text
        style={{
          fontFamily: 'YekanBakh-Bold',
          fontSize: 18,
          color: colors.accent,
          marginBottom: 10,
        }}>
        وضعیت
      </Text>
      {data &&
        data.map((item, index) => {
          return (
            <View key={index}>
              <View
                style={[
                  styles.wrapper,
                  {
                    borderColor:
                      item.user?.id === userId
                        ? getBgColor(item.contractStateType)
                        : 'transparent',
                  },
                ]}>
                <View style={styles.cardContainer}>
                  <View style={styles.titleContainer}>
                    <Text style={styles.name}>
                      {getSignerFullName(item.user)}
                    </Text>
                    <View style={styles.codeContainer}>
                      <Text style={styles.code}>کد ملی</Text>
                      <Text style={styles.code}>{'-'}</Text>
                      <Text style={styles.code}>{item.user?.nationalcode}</Text>
                    </View>
                  </View>
                  <View style={styles.numberStyle}>
                    <Text style={styles.number}>
                      {toPersianDigits(index + 1)}
                    </Text>
                  </View>
                </View>
                <View>
                  <Text
                    style={[
                      styles.dateTitle,
                      {color: getBgColor(item.contractStateType)},
                    ]}>
                    {getContractStatusBadgeText(item.contractStateType, states)}
                  </Text>
                  <Text style={styles.date}>
                    {getPersianDate(item.submitTime).date}
                  </Text>
                </View>
              </View>

              {index !== data.length - 1 && <Divider />}
            </View>

            // <View style={styles.contractStatusItemWrapper} key={index}>
            //   <Text style={styles.contractStatusItemTitle}>
            //     {/*{`${item?.user?.firstName} ${item?.user?.lastName}`}*/}
            //     {getSignerFullName(item.user)}
            //     {/*{item && item.user.family_name}*/}
            //   </Text>
            //   <View style={styles.contractStatusItemBadgeWrapper}>
            //     <Text style={styles.contractStatusItemText}>
            //       ({getPersianDate(item.submitTime).date})
            //     </Text>
            //     <Badge
            //       text={getContractStatusBadgeText(
            //         item.contractStateType,
            //         states,
            //       )}
            //       type={getContractStatusBadgeType(item.contractStateType)}
            //     />
            //   </View>
            // </View>
          );
        })}
    </View>
  );
};

export default Index;
