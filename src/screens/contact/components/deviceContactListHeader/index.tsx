import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import styles from '../../contactList/style';
import {toPersianDigits} from '../../../../helpers/convertNumber';
import FullScreenLoading from '../../../../components/fullScreenLoading';
import colors from '../../../../assets/theme/colors';

type PropsModel = {
  saveContacts: () => void;
  selectedContactsCount: number;
  saveContactsLoading: boolean;
  onBack: () => void;
};

const Index: React.FC<PropsModel> = props => {
  const {saveContacts, selectedContactsCount, saveContactsLoading, onBack} =
    props;

  return (
    <View style={styles.filter}>
      <View style={styles.inputWrapper}>
        <View style={[styles.optionsWrapper, {paddingVertical: 6}]}>
          <View style={styles.optionTrashWrapper}>
            <Text style={styles.selectedCountedText}>
              {selectedContactsCount === 0
                ? 'انتخاب کنید'
                : toPersianDigits(selectedContactsCount)}
            </Text>
          </View>
          <View style={styles.optionsTextWrapper}>
            <TouchableOpacity onPress={saveContacts}>
              {saveContactsLoading ? (
                <FullScreenLoading />
              ) : (
                <Text
                  style={[
                    styles.deleteContactText,
                    {color: colors.primary.success},
                  ]}>
                  ثبت
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={onBack}>
              <Text style={styles.rejectText}>بازگشت</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Index;
