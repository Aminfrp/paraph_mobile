import {getAsyncStorage} from './asyncStorage';
import * as keyStorage from '../constants/keyStorage';

export default async (): Promise<number> => {
  const contactInfo = await getAsyncStorage('object', keyStorage.CONTACT_INFO);

  return Number(contactInfo?.ssoId);
};
