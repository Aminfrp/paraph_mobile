import React, {useState} from 'react';
import {Picker} from '@react-native-picker/picker';
import {toPersianDigits} from '../../../../helpers/convertNumber';

const Index = props => {
  const {item, onOrder} = props;
  const [value, setValue] = useState(
    options.find(el => Number(el.label) === item.order)?.label,
  );

  const onChangeHandler = (item, value) => {
    onOrder(item, value);
    setValue(value);
  };

  return (
    <Picker
      selectedValue={value}
      style={{marginBottom: 0, inputAndroid: {color: 'black'}}}
      itemStyle={{fontFamily: 'YekanBakh-Bold'}}
      onValueChange={(itemValue, itemIndex) => onChangeHandler(item, itemValue)}
      useNativeAndroidPickerStyle={false}
      mode={'dropdown'}>
      {options.map((i, index) => {
        return (
          <Picker.Item
            label={toPersianDigits(i.label)}
            value={i.value}
            key={index}
            STF={item.order}
          />
        );
      })}
    </Picker>
  );
};

const options = [
  {id: 0, label: 'انتخاب', value: 'انتخاب'},
  {id: 1, label: '1', value: '1'},
  {id: 2, label: '2', value: '2'},
  {id: 3, label: '3', value: '3'},
  {id: 4, label: '4', value: '4'},
  {id: 5, label: '5', value: '5'},
];

export default Index;
