import Contacts from 'react-native-contacts';
import getContactsPermission from '../permissions/contacts/getContactsPermission';
import {DeviceContactModel} from '../../model/deviceContact.model';

export const getAllContacts = async (): Promise<DeviceContactModel[]> => {
  try {
    const permissionGranted = await getContactsPermission();
    let contacts: DeviceContactModel[] = [];

    if (permissionGranted) {
      await Contacts.getAll().then(res => {
        contacts = [...res];
      });
    }

    return Promise.resolve(contacts);
  } catch (err) {
    return Promise.reject(err);
  }
};
