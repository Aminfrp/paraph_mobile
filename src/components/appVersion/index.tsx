import React from 'react';
import {View, Text, TouchableOpacity, Linking} from 'react-native';
import {toPersianDigits} from '../../helpers/convertNumber';
import {refRBSheet} from '../../helpers/appVersion';
import Button from '../button';
import RbSheet from '../rbSheet';
import styles from './style';

type PropsModel = {
  disabled: boolean;
  filePath: string;
  version: string;
  visible: boolean;
};

const Index: React.FC<PropsModel> = props => {
  const {disabled, filePath, version, visible} = props;
  const v = version.split('-').join('.');

  const getApp = () =>
    Linking.openURL(filePath).catch(err =>
      console.error("Couldn't load page", err),
    );

  return (
    <RbSheet
      ref={refRBSheet}
      title={`نسخه جدید`}
      secondTitle={version && `"${toPersianDigits(v)}"`}
      description={filePath}
      type="primary"
      disabled={disabled}
      closeOnPressBack={false}
      closeOnDragDown={false}
      closeOnPressMask={false}
      height={240}
      visible={visible}>
      <View style={styles.headerWrapper}>
        <Text style={styles.modalTitle}>نسخه</Text>
        {version && (
          <Text style={styles.modalTitle}>
            "{toPersianDigits(version.split('-').join('.'))}"
          </Text>
        )}
      </View>
      <View style={styles.mainWrapper}>
        <Text style={styles.modalText}>
          نسخه جدید آماده است، از طریق لینک زیر نسخه جدید را دریافت نمایید.
        </Text>
        <TouchableOpacity onPress={getApp}>
          <Text style={styles.link}>{filePath}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.btnWrapper}>
        <View style={styles.btn}>
          <Button
            onPress={getApp}
            title="دریافت"
            type="success"
            disabled={false}
          />
        </View>
      </View>
    </RbSheet>
  );
};

export default Index;
