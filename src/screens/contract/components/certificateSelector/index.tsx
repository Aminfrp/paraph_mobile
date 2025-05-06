import React, {useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import Checkbox from '../../../../components/checkbox';
import styles from '../../create/style';
import CertificateInfoModal from '../../../certificates/components/certificateInfoModal';

type PropsModel = {
  error: {namdCertificateChecked: ''; certificateChecked: ''} | null;
  isCertificateChecked: boolean;
  onForceCertificate: (type: string) => void;
  isNamadCertificateChecked: boolean;
};

const Index: React.FC<PropsModel> = props => {
  const {
    error,
    isCertificateChecked,
    onForceCertificate,
    isNamadCertificateChecked,
  } = props;
  const [showBanner, setShowBanner] = useState<{
    show: boolean;
    type: string | null;
  }>({show: false, type: null});

  const toggleCertificateInfoBanner = (show = false, type = 'rishe'): void =>
    setShowBanner({show, type});

  return (
    <View style={styles.formWrapper}>
      <CertificateInfoModal
        onClose={() => toggleCertificateInfoBanner(false, '')}
        show={showBanner.show}
        type={showBanner.type || ''}
      />
      <View style={{flexDirection: 'row-reverse', alignItems: 'center'}}>
        <Text style={styles.screenTitle}>انتخاب گواهی امضا</Text>
        <Text style={styles.contactListCounterText}>(اختیاری)</Text>
      </View>
      <Text style={[styles.getCertificateBtnText, {marginVertical: 5}]}>
        گواهی مورد نظرتان را که می‌خواهید کاربر ملزم به استفاده از آن باشد را
        انتخاب کنید
      </Text>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row-reverse',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginVertical: 15,
          borderColor: '#EBECF0',
          borderWidth: 1,
          borderRadius: 12,
          padding: 5,
        }}>
        <View
          style={{flexDirection: 'row-reverse', alignItems: 'center', gap: 5}}>
          <Checkbox
            error={error && error.certificateChecked}
            type="success"
            value={isCertificateChecked}
            onChange={() => onForceCertificate('rishe')}
          />
          <View style={{marginTop: 10}}>
            <Text style={[styles.getCertificateBtnText, {fontSize: 15}]}>
              الزام به امضا با گواهی مرکز ریشه وزارت صمت
            </Text>
            <Text
              style={[
                styles.contactListCounterText,
                {fontSize: 12, marginHorizontal: 0, paddingTop: 0},
              ]}>
              ویژه امضای سفته
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => toggleCertificateInfoBanner(true, 'rishe')}>
          <Image
            source={require('../../../../assets/img/png/info-circle-white.png')}
            resizeMode="contain"
            style={{width: 25, height: 25}}
          />
        </TouchableOpacity>
      </View>
      {/*  todo: commit namad for main release... */}
      {/*<View*/}
      {/*  style={{*/}
      {/*    display: 'flex',*/}
      {/*    flexDirection: 'row-reverse',*/}
      {/*    justifyContent: 'space-between',*/}
      {/*    alignItems: 'center',*/}
      {/*    marginVertical: 15,*/}
      {/*    borderColor: '#EBECF0',*/}
      {/*    borderWidth: 1,*/}
      {/*    borderRadius: 12,*/}
      {/*    padding: 5,*/}
      {/*  }}>*/}
      {/*  <View*/}
      {/*    style={{flexDirection: 'row-reverse', alignItems: 'center', gap: 5}}>*/}
      {/*    <Checkbox*/}
      {/*      error={error && error.namdCertificateChecked}*/}
      {/*      type="success"*/}
      {/*      value={isNamadCertificateChecked}*/}
      {/*      onChange={() => onForceCertificate('namad')}*/}
      {/*    />*/}
      {/*    <View style={{marginTop: 10}}>*/}
      {/*      <Text style={[styles.getCertificateBtnText, {fontSize: 15}]}>*/}
      {/*        الزام به امضا با گواهی نماد بانک مرکزی*/}
      {/*      </Text>*/}
      {/*      <Text*/}
      {/*        style={[*/}
      {/*          styles.contactListCounterText,*/}
      {/*          {fontSize: 12, marginHorizontal: 0, paddingTop: 0},*/}
      {/*        ]}>*/}
      {/*        ویژه امضای چک دیجیتال*/}
      {/*      </Text>*/}
      {/*    </View>*/}
      {/*  </View>*/}
      {/*  <TouchableOpacity*/}
      {/*    onPress={() => toggleCertificateInfoBanner(true, 'namad')}>*/}
      {/*    <Image*/}
      {/*      source={require('../../../../assets/img/png/info-circle-white.png')}*/}
      {/*      resizeMode="contain"*/}
      {/*      style={{width: 25, height: 25}}*/}
      {/*    />*/}
      {/*  </TouchableOpacity>*/}
      {/*</View>*/}
    </View>
  );
};

export default Index;
