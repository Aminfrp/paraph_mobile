import React, {useEffect} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import Button from '../../../../components/button';
import styles from '../../style';
import {isCertificateExistOnDevice} from "../../../../modules/certificate/rishe/certificate";

type PropsModel = {
  isBought: boolean;
  title: string;
  state: string;
  dateText: () => string;
  isDate: boolean;
  onBuy: () => void;
  onRevoke: () => void;
  onHistory: () => void;
  onInfo: () => void;
  price?: string;
};

const Index: React.FC<PropsModel> = props => {
  const {
    isBought,
    title,
    state,
    dateText,
    isDate,
    price,
    onBuy,
    onRevoke,
    onHistory,
    onInfo,
  } = props;

  const [isCertificateExist,setIsCertificateExist] = React.useState(false);

  useEffect(()=> {
    isCertificateExistOnDevice().then(r => r ? setIsCertificateExist(false):setIsCertificateExist(true) );
  },[])

  return (
    <View style={styles.certificateDataCard}>
      <Text style={[styles.textTitle, {fontSize: 17}]}>{title}</Text>
      <Text style={styles.certificateDataCardStateText}>{state}</Text>
      {isDate ? (
        <View style={styles.certificateDataCardDateWrapper}>
          <Image
            source={require('../../../../assets/img/png/calendar.png')}
            resizeMode="contain"
            style={styles.certificateDataCardSmallIcon}
          />
          <Text style={styles.certificateDataCardDateText}>
            {dateText() || '-'}
          </Text>
        </View>
      ) : (
        <View style={styles.certificateDataCardDateWrapper}>
          <Image
            source={require('../../../../assets/img/png/coin.png')}
            resizeMode="contain"
            style={styles.certificateDataCardSmallIcon}
          />
          <Text style={styles.certificateDataCardDateText}>{price} تومان</Text>
        </View>
      )}
      {isCertificateExist &&  <View>
        <Text style={styles.deviceCertificateExistText}>این گواهی ریشه هم‌اکنون روی دستگاه دیگری فعال است و در این دستگاه معتبر نیست. برای استفاده از گواهی در این دستگاه، لطفاً ابتدا گواهی قبلی را ابطال کنید و سپس برای خرید گواهی جدید اقدام نمایید. در غیر این صورت، از گواهی موجود روی دستگاه قبلی استفاده کنید.
        </Text>
      </View>}

      <View style={styles.certificateDataCardDivider} />
      <View style={styles.certificateDataCardFooter}>
        <TouchableOpacity onPress={onInfo}>
          <Image
            source={require('../../../../assets/img/png/info-circle-white.png')}
            resizeMode="contain"
            style={styles.certificateDataCardSmallIcon}
          />
        </TouchableOpacity>
        <View
          style={[styles.noCertificateBoughtCertificateBtnGroup, {gap: 10}]}>
          {!isBought ? (
            <Button
              title="خرید گواهی"
              type="success"
              onPress={onBuy}
              loading={false}
              disabled={false}
            />
          ) : (
            <Button
              title="ابطال گواهی"
              type="danger"
              onPress={onRevoke}
              loading={false}
              disabled={false}
            />
          )}
          {/*{isBought && (*/}
          <Button
            title="تاریخچه خرید"
            type="transparent-outline"
            onPress={onHistory}
            loading={false}
            disabled={false}
          />
          {/*)}*/}
        </View>
      </View>
    </View>
  );
};

export default Index;
