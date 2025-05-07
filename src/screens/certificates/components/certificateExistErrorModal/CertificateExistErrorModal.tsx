import React, {useRef} from 'react';
import RbSheet from '../../../../components/rbSheet';
import {Text, View} from 'react-native';
import Button from '../../../../components/button';
import {useNavigation} from '@react-navigation/native';
import * as routesName from '../../../../constants/routesName.ts';
import {styles} from './certificateExistErrorModal.style.ts';

type PropsModel = {
  show: boolean;
  onClose: () => void;
};

function CertificateExistErrorModal(props: PropsModel) {
  const {show, onClose} = props;
  const refRBSheet = useRef();
  const navigation = useNavigation();

  return (
    <RbSheet
      ref={refRBSheet}
      disabled={true}
      height={200}
      visible={show}
      onClose={onClose}>
      <View style={styles.container}>
        <Text style={styles.title}>خطا در امضا با گواهی ریشه</Text>
        <Text style={styles.description}>
          این گواهی ریشه هم اکنون در این دستگاه معتبر نیست.
        </Text>
        <Button
          title="انتقال به صفحه لیست گواهی ها"
          type="danger"
          onPress={() => {
            // @ts-ignore
            navigation.navigate(routesName.CERTIFICATE, {
              screen: routesName.CERTIFICATES,
            });
            onClose();
          }}
        />
      </View>
    </RbSheet>
  );
}

export default CertificateExistErrorModal;
