import React from 'react';
import {View, Text, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import styles from '../../contactList/style';
import SelectDropdown from 'react-native-select-dropdown';

const countries: string[] = ['همه مخاطبان', 'مخاطب حقیقی', 'مخاطب حقوقی'];

type PropsModel = {
  onChange: (input: string, index: number) => void;
  value: string;
};

const Index: React.FC<PropsModel> = props => {
  const {onChange, value} = props;
  const {navigate} = useNavigation();

  const getDefaultValue = () => {
    if (!value) return countries[0];
    if (value === 'ALL') {
      return 'همه مخاطبان';
    }
    if (value === 'ONLY_NOT_LEGAL') {
      return 'مخاطب حقیقی';
    }
    if (value === 'ONLY_LEGAL') {
      return 'مخاطب حقوقی';
    }
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
      }}>
      {countries && (
        <SelectDropdown
          defaultValue={getDefaultValue()}
          data={countries}
          onSelect={(selectedItem, index) => {
            if (index === 0) {
              onChange('ALL', index);
            }
            if (index === 1) {
              onChange('ONLY_NOT_LEGAL', index);
            }
            if (index === 2) {
              onChange('ONLY_LEGAL', index);
            }
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            // text represented after item is selected
            // if data array is an array of objects then return selectedItem.property to render after item is selected
            return selectedItem;
          }}
          rowTextForSelection={(item, index) => {
            // text represented for each item in dropdown
            // if data array is an array of objects then return item.property to represent item in dropdown
            return item;
          }}
          buttonTextStyle={{
            fontFamily: 'YekanBakh-Bold',
            fontSize: 16,
            color: '#00091A',
          }}
          rowTextStyle={{
            fontFamily: 'YekanBakh-Bold',
            fontSize: 16,
            color: '#00091A',
          }}
          rowStyle={{
            backgroundColor: 'white',
          }}
          dropdownStyle={{
            borderRadius: 10,
          }}
          buttonStyle={{
            borderRadius: 10,
            width: '40%',
            borderColor: '#dcdcdc',
            borderWidth: 1,
            borderStyle: 'solid',
          }}
          selectedRowStyle={{
            backgroundColor: '#eeeeee',
          }}
          renderDropdownIcon={() => {
            return (
              <Image
                source={require('../../../../assets/img/png/arrow-down.png')}
                resizeMethod="resize"
                style={{width: 20, height: 20}}
              />
            );
          }}
          dropdownIconPosition="left"
        />
      )}

      <Text style={styles.emptyListText}>مرتب‌سازی مخاطبین براساس:</Text>
    </View>
  );
};

export default Index;
