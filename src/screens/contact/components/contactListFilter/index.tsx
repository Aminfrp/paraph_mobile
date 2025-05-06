import React from 'react';
import {Image, View, TouchableOpacity, Text} from 'react-native';
import Input from '../../../../components/input';
import styles from '../../contactList/style';
import colors from '../../../../assets/theme/colors';
// @ts-ignore
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {toPersianDigits} from '../../../../helpers/convertNumber';
import Checkbox from '../../../../components/checkbox';
import FullScreenLoading from '../../../../components/fullScreenLoading';

type PropsModel = {
  toggleOptionsBar: () => void;
  showOptions: boolean;
  removeContacts: () => void;
  selectedContactsCount: number;
  contactsCount: number;
  toggleCheckbox: () => void;
  isAllChecked: boolean;
  removeContactsLoading: boolean;
  onFilterBar: () => void;
  filterInputValue: string;
};

const Index: React.FC<PropsModel> = props => {
  const {
    toggleOptionsBar,
    showOptions,
    removeContacts,
    selectedContactsCount,
    contactsCount,
    toggleCheckbox,
    isAllChecked,
    removeContactsLoading,
    onFilterBar,
    filterInputValue,
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
              <TouchableOpacity onPress={removeContacts}>
                {removeContactsLoading ? (
                  <FullScreenLoading />
                ) : (
                  <Text style={styles.deleteContactText}>حذف</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleOptionsBar}>
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
