import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity, Image} from 'react-native';
import useCurrentRoute from '../../../hooks/useCurrentRoute';
import useCustomState from '../../../hooks/useCustomState';
import EmptyList from '../components/contactList/emptyList';
import SelectDeviceContactModal from '../components/selectDeviceContactModal';
import DeviceContactListHeader from '../components/deviceContactListHeader';
import {addContactService} from '../../../apis';
import {toPersianDigits} from '../../../helpers/convertNumber';
import * as routesName from '../../../constants/routesName';
import * as Toast from '../../../components/toastNotification/utils';
import * as deviceContacts from '../../../modules/deviceContacts';
import colors from '../../../assets/theme/colors';
import styles from '../contactList/style';
import {useNavigation} from '@react-navigation/native';
import {DeviceContactModel} from '../../../model/deviceContact.model';
import {ContactServiceInputModel} from '../../../model/contactServiceInput.model';
import {Logger} from '../../../modules/log/logger';

const Index: React.FC = () => {
  const navigation = useNavigation();
  const {navigate, goBack} = navigation;
  const [data, setData] = useState<DeviceContactModel[]>([]);
  const [createContactLoading, setCreateContactLoading] =
    useState<boolean>(false);

  const [selectedContacts, setSelectedContacts] = useCustomState<
    DeviceContactModel[]
  >([]);
  const [contactInfoModalValue, setContactInfoModalValue] = useCustomState<{
    show: boolean;
    contact: DeviceContactModel | null;
  }>({
    show: false,
    contact: null,
  });

  useCurrentRoute(true);

  useEffect(() => {
    getContacts().then(r => null);

    return () => {};
  }, []);

  const getContacts = async () => {
    try {
      const response: DeviceContactModel[] =
        await deviceContacts.getAllContacts();

      const mobilesNumbersData: any =
        response &&
        response.length > 0 &&
        response
          .map(el => {
            if (el.phoneNumbers.length > 0) {
              const map = new Map();

              const mobiles = el.phoneNumbers.filter((i, key) => {
                if (i.label === 'mobile') {
                  const number = i.number.split(' ').join('');

                  if (!map.has(number)) {
                    map.set(number, number);
                    return {
                      id: key,
                      label: i.label,
                      number: number.split(' ').join(''),
                    };
                  }
                }
              });

              return {
                ...el,
                phoneNumbers: mobiles || [],
              };
            }

            return el;
          })
          .filter(el => el.phoneNumbers.length > 0)
          .sort(function (a, b) {
            if (a.displayName < b.displayName) {
              return -1;
            }
            if (a.displayName > b.displayName) {
              return 1;
            }
            return 0;
          });

      setData(mobilesNumbersData);
    } catch (err) {
      Logger.debugLogger('error in getContacts', err);
    }
  };

  const getCardBorderColor = (id: string) => {
    const isItemExist =
      selectedContacts &&
      selectedContacts.length > 0 &&
      selectedContacts.find((el: DeviceContactModel) => el.recordID === id);

    return isItemExist ? colors.primary.success : colors.white;
  };

  const holdContactHandler = (item: DeviceContactModel) => {};

  const onContactHandler = (item: DeviceContactModel) => {
    const isItemExist =
      selectedContacts &&
      selectedContacts.length > 0 &&
      selectedContacts.find(
        (el: DeviceContactModel) => el.recordID === item.recordID,
      );

    if (isItemExist) {
      const selected: DeviceContactModel[] = selectedContacts.filter(
        (el: DeviceContactModel) => el.recordID !== item.recordID,
      );
      setSelectedContacts(selected);
    } else {
      if (item.phoneNumbers.length > 1) {
        toggleContactInfoModal(true, item);
      } else {
        const selected: DeviceContactModel[] = [...selectedContacts, item];
        setSelectedContacts(selected);
      }
    }
  };

  const toggleContactInfoModal = (
    show = true,
    contact: DeviceContactModel | null,
  ) => {
    setContactInfoModalValue({show, contact});
  };

  const onContactModalSelect = (item: DeviceContactModel) => {
    const selected: DeviceContactModel[] = [...selectedContacts, item];
    setSelectedContacts(selected);
    toggleContactInfoModal(false, null);
  };

  const saveContacts = async () => {
    try {
      const contacts: Omit<ContactServiceInputModel, 'nationalId'>[] =
        generateContactsList(selectedContacts);

      if (contacts && contacts.length > 0) {
        await createContact(contacts).then(() => {
          // @ts-ignore
          navigate(routesName.CONTACT_LIST);
        });
      } else {
        Toast.showToast('warning', 'مخاطب', 'مخاطب را انتخاب نمایید');
      }
    } catch (error) {
      Logger.debugLogger('error in saveContacts:', error);
    }
  };

  const generateContactsList = (
    list: DeviceContactModel[],
  ): Omit<ContactServiceInputModel, 'nationalId'>[] => {
    if (list && list.length > 0) {
      return list.map(el => ({
        firstName: el.givenName,
        lastName: el.familyName,
        cellphoneNumber: replacePersianCodeNumber(el.phoneNumbers[0].number),
      }));
    }
    return [];
  };

  const replacePersianCodeNumber = (numberString: string) => {
    const number = numberString.split(' ').join('');

    return number[0] === '+' ? '0' + number.substring(3) : number;
  };

  const createContact = async (
    postData: Partial<ContactServiceInputModel>[],
  ) => {
    try {
      setCreateContactLoading(true);

      const response = await addContactService(postData);
      const data =
        response && response.data && response.data.body && response.data.body;

      const savedContactsList = [];
      const unsavedContactsList = [];

      for (let el of data) {
        if (el.savedContactStatus === 'SAVED') {
          savedContactsList.push(el);
        } else if (el.savedContactStatus === 'NOT_SAVED') {
          unsavedContactsList.push(el);
        }
      }

      setCreateContactLoading(false);

      if (savedContactsList.length > 0) {
        Toast.showToast(
          'success',
          'مخاطب',
          `تعداد ${toPersianDigits(
            savedContactsList.length,
          )} مخاطب با موفقیت ثبت شد`,
        );
        return Promise.resolve();
      } else {
        Toast.showToast('danger', 'مخاطب', 'مخاطب ثبت نشد');
        return Promise.reject();
      }
    } catch (error) {
      Logger.debugLogger('error in createContact error:', error);

      Toast.showToast('danger', 'مخاطب', 'مخاطب ثبت نشد');
      setCreateContactLoading(false);
    }
  };

  return (
    <>
      <DeviceContactListHeader
        saveContacts={saveContacts}
        selectedContactsCount={selectedContacts.length}
        saveContactsLoading={createContactLoading}
        onBack={goBack}
      />
      <View style={{padding: 10, flex: 1}}>
        <FlatList
          data={data && data}
          renderItem={({item, index}) => (
            <TouchableOpacity
              style={[
                styles.contactCardWrapper,
                {borderColor: getCardBorderColor(item.recordID)},
              ]}
              onPress={() => onContactHandler(item)}
              delayLongPress={100}
              onLongPress={() => holdContactHandler(item)}>
              <View style={styles.contactCardInfoWrapper}>
                <Text style={styles.contactCardInfoText} numberOfLines={1}>
                  {item.displayName}
                </Text>
              </View>
              <View style={styles.contactCardImgWrapper}>
                <Image
                  source={require('../../../assets/img/png/contact_select.png')}
                  resizeMethod="resize"
                  style={{width: 30, height: 25, borderRadius: 4}}
                />
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.recordID}
          onEndReachedThreshold={0.5}
          refreshing={false}
          ListEmptyComponent={<EmptyList />}
        />
      </View>
      {contactInfoModalValue.contact && (
        <SelectDeviceContactModal
          visible={contactInfoModalValue.show}
          data={contactInfoModalValue.contact}
          onClose={() => toggleContactInfoModal(false, null)}
          onSelect={onContactModalSelect}
        />
      )}
    </>
  );
};

export default Index;
