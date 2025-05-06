import React, {useEffect, useState} from 'react';
import {Image, View, TouchableOpacity, Text} from 'react-native';
import Input from '../../../../components/input';
import styles from '../../../contact/contactList/style';
import colors from '../../../../assets/theme/colors';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {toPersianDigits} from '../../../../helpers/convertNumber';
import Checkbox from '../../../../components/checkbox';
import FullScreenLoading from '../../../../components/fullScreenLoading';

const Index = props => {
  const {
    toggleOptionsBar,
    showOptions,
    selectContacts,
    selectedContactsCount,
    contactsCount,
    toggleCheckbox,
    isAllChecked,
    selectContactsLoading,
    onFilterBar,
    filterInputValue,
    onBack,
  } = props;

  return (
    <View style={styles.filter}>
      {contactsCount > 0 && (
        <TouchableOpacity
          style={styles.optionsIconWrapper}
          onPress={toggleOptionsBar}>
          {showOptions ? (
            <></>
          ) : (
            <Icon name="options" size={15} style={styles.optionsIcon} />
          )}
        </TouchableOpacity>
      )}
      <View style={styles.inputWrapper}>
        {!showOptions ? (
          <TouchableOpacity
            onPress={onFilterBar}
            style={{position: 'relative'}}
            activeOpacity={1}>
            <View style={styles.filterInputWrapper} />
            <Input
              onChangeText={value => console.log(value)}
              icon={
                <Image
                  source={require('../../../../assets/img/png/search_icon.png')}
                  style={{width: 20, height: 20}}
                />
              }
              iconPosition="right"
              value={filterInputValue}
              size="sm"
              bgColor={colors.lightGray}
              style={styles.filterInputLabel}
              isBorder={false}
              editable={false}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.optionsWrapper}>
            <View style={styles.optionTrashWrapper}>
              <Checkbox
                label="همه"
                error={null}
                type="success"
                value={isAllChecked}
                onChange={toggleCheckbox}
              />
              <Text style={styles.selectedCountedText}>
                {selectedContactsCount === 0
                  ? 'انتخاب کنید'
                  : toPersianDigits(selectedContactsCount)}
              </Text>
            </View>
            <View style={styles.optionsTextWrapper}>
              <TouchableOpacity onPress={selectContacts}>
                {selectContactsLoading ? (
                  <FullScreenLoading />
                ) : (
                  <Text
                    style={[
                      styles.deleteContactText,
                      {color: colors.primary.success},
                    ]}>
                    بعدی
                  </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={onBack}>
                <Text style={styles.rejectText}>لغو</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default Index;
