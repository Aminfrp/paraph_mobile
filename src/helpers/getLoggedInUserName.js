import {getAsyncStorage} from './asyncStorage';
import * as keyStorage from '../constants/keyStorage';

export default async () => {
  const contactInfo = await getAsyncStorage('object', keyStorage.CONTACT_INFO);
  return contactInfo?.firstName + ' ' + contactInfo?.lastName;
};
