import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import AbsoluteLoading from '../../../../components/absoluteLoading';
import {toPersianDigits} from '../../../../helpers/convertNumber';
import Badge from '../../../../components/badge';
import {InvoiceModel} from '../../../../model/invoice.model';
import {InvoiceStatuses} from '../../../../model/invoiceStatus.model';

type RowPropsModel = {
  title: string;
  value: string;
  badgeTitle: string;
  badgeType: string;
};

const Row: React.FC<RowPropsModel> = ({
  title,
  value,
  badgeTitle,
  badgeType,
}) => (
  <View style={styles.paymentHistoryRow}>
    <Text style={styles.paymentHistoryText}>{title}:</Text>
    <View>
      {badgeTitle ? (
        <Badge text={badgeTitle} type={badgeType} isBold={false} />
      ) : (
        <Text style={styles.paymentHistoryText}>{value}</Text>
      )}
    </View>
  </View>
);

type PropsModel = {
  loading: boolean;
  data: Array<InvoiceModel>;
  requester: string;
  phoneNumber: string;
  nationalCode: string;
  title: string;
};

const Index: React.FC<PropsModel> = props => {
  const {loading, data, requester, phoneNumber, nationalCode, title} = props;

  const getBadgeText = (status: string): string => {
    const map = new Map();
    map.set(InvoiceStatuses.created, 'دریافت شده');
    map.set(InvoiceStatuses.revoked, 'باطل شده');
    map.set(InvoiceStatuses.removed, 'پاک شده');

    return map.get(status) || 'دریافت نشده';
  };

  const getBadgeType = (status: string): string => {
    const map = new Map();
    map.set(InvoiceStatuses.created, 'success');
    map.set(InvoiceStatuses.revoked, 'danger');
    map.set(InvoiceStatuses.removed, 'warning');
    return map.get(status) || 'warning';
  };

  const windowHeight = Dimensions.get('window').height;
  return (
    <View style={{height: windowHeight - 56}}>
      {loading && <AbsoluteLoading />}
      <FlatList
        ListHeaderComponent={() => (
          <Text style={styles.textTitle}>{title}</Text>
        )}
        data={data && data}
        renderItem={({item, index}) => (
          <View style={styles.paymentHistoryCard}>
            <View style={styles.paymentHistoryRow}>
              <View style={[styles.paymentHistoryRow]}>
                <Image
                  source={require('../../../../assets/img/png/buildings-light.png')}
                  style={{width: 25, height: 25}}
                />
                <Text style={styles.text}>صادر کننده</Text>
              </View>
              <Text style={styles.text}>بانک مرکزی</Text>
            </View>
            <View style={styles.paymentHistoryRow}>
              <View style={[styles.paymentHistoryRow]}>
                <Image
                  source={require('../../../../assets/img/png/notification-circle.png')}
                  style={{width: 25, height: 25}}
                />
                <Text style={styles.text}>وضعیت</Text>
              </View>
              <Text style={styles.text}>
                <Badge
                  text={getBadgeText(item.metadata.orderStatus.uniqueId)}
                  type={getBadgeType(item.metadata.orderStatus.uniqueId)}
                  isBold={false}
                />
              </Text>
            </View>

            <View style={styles.paymentHistoryRow}>
              <View style={[styles.paymentHistoryRow]}>
                <Image
                  source={require('../../../../assets/img/png/user.png')}
                  style={{width: 25, height: 25}}
                />
                <Text style={styles.text}>متقاضی</Text>
              </View>
              <Text style={styles.text}>{requester}</Text>
            </View>
            <View style={styles.paymentHistoryRow}>
              <View style={[styles.paymentHistoryRow]}>
                <Image
                  source={require('../../../../assets/img/png/call_icon.png')}
                  style={{width: 25, height: 25}}
                />
                <Text style={styles.text}>شماره همراه</Text>
              </View>
              <Text style={styles.text}>{phoneNumber}</Text>
            </View>

            <View style={styles.paymentHistoryRow}>
              <View style={[styles.paymentHistoryRow]}>
                <Image
                  source={require('../../../../assets/img/png/personalcard.png')}
                  style={{width: 25, height: 25}}
                />
                <Text style={styles.text}>شماره ملی</Text>
              </View>
              <Text style={styles.text}>{nationalCode}</Text>
            </View>
            <View style={styles.paymentHistoryRow}>
              <View style={[styles.paymentHistoryRow]}>
                <Image
                  source={require('../../../../assets/img/png/calendar.png')}
                  style={{width: 25, height: 25}}
                />
                <Text style={styles.text}>تاریخ اعتبار</Text>
              </View>
              <Text style={styles.text}>*</Text>
            </View>
            <View style={styles.paymentHistoryRow}>
              <View style={[styles.paymentHistoryRow]}>
                <Image
                  source={require('../../../../assets/img/png/document_icon.png')}
                  style={{width: 25, height: 25}}
                />
                <Text style={styles.text}>شماره سفارش</Text>
              </View>
              <Text style={styles.text}>{toPersianDigits(item.id)}</Text>
            </View>
          </View>
        )}
        keyExtractor={item => item.id}
        onEndReached={() => {}}
        onEndReachedThreshold={0.5}
        refreshing={false}
        ListEmptyComponent={
          !loading ? (
            <View
              style={{
                flex: 1,
                flexDirection: 'row-reverse',
                alignItems: 'center',
                height: '100%',
                marginVertical: 20,
              }}>
              <Text style={styles.text}>
                شما تاکنون گواهی امضا خریداری ننموده اید.
              </Text>
            </View>
          ) : (
            <></>
          )
        }
      />
    </View>
  );
};

const styles: any = StyleSheet.create({
  paymentHistoryCard: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#dadada',
    paddingHorizontal: 10,
    margin: 15,
    marginBottom: 5,
  },
  paymentHistoryRow: {
    display: 'flex',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    // width: '100%',
    borderStyle: 'solid',
    borderBottomColor: '#e8e8e8',
    borderBottomWidth: 1,
    height: 45,
    gap: 5,
  },
  text: {
    fontFamily: 'YekanBakh-Bold',
    textAlign: 'center',
    color: '#202222',
    fontSize: 14,
  },
  textTitle: {
    color: '#00091A',
    fontSize: 19,
    fontFamily: 'YekanBakh-Bold',
    marginTop: 20,
    paddingHorizontal: 12,
  },
});

export default Index;
