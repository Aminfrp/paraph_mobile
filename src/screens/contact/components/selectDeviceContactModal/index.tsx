import React from 'react';
import {View} from 'react-native';
import Button from '../../../../components/button';
import Modal from '../../../../components/modal';
import {toPersianDigits} from '../../../../helpers/convertNumber';
import Checkbox from '../../../../components/checkbox';
import useCustomState from '../../../../hooks/useCustomState';
import {
  DeviceContactModel,
  PhoneNumberModel,
} from '../../../../model/deviceContact.model';

type PropsModel = {
  data: DeviceContactModel;
  visible: boolean;
  onClose: () => void;
  onSelect: (input: DeviceContactModel) => void;
};

const Index: React.FC<PropsModel> = props => {
  const {data, visible, onClose, onSelect} = props;

  const [selectedItem, setSelectedItem] =
    useCustomState<PhoneNumberModel | null>(null);

  const selectHandler = () => {
    if (selectedItem) {
      onSelect({...data, phoneNumbers: [selectedItem]});
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onClose={onClose}
      title={data ? data.displayName : ''}>
      <View>
        {data &&
          data.phoneNumbers &&
          data.phoneNumbers.length > 0 &&
          data.phoneNumbers.map(el => (
            <Checkbox
              onChange={() => setSelectedItem(el)}
              value={!!(selectedItem && selectedItem.number === el.number)}
              type="success"
              label={el ? toPersianDigits(el.number) : ''}
              error={null}
              disabled={false}
              key={el.number}
            />
          ))}
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View style={{marginTop: 10, width: '35%', marginHorizontal: 4}}>
          <Button
            title="بستن"
            disabled={false}
            loading={false}
            onPress={onClose}
            type="primary-outline"
          />
        </View>
        <View style={{marginTop: 10, width: '35%', marginHorizontal: 4}}>
          <Button
            title="انتخاب"
            disabled={false}
            loading={false}
            onPress={selectHandler}
            type="success"
          />
        </View>
      </View>
    </Modal>
  );
};

export default Index;
