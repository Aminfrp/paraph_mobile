import * as RNFS from 'react-native-fs';
import debugLogger from '../../helpers/debugLogger';
import isStoragePermissionValid from '../permissions/storage/isStoragePermissionValid';

export default async (path: string) => {
  try {
    if (await isStoragePermissionValid()) {
      return Promise.resolve(await RNFS.unlink(path));
    }
  } catch (error) {
    debugLogger('error in fileRemover: ', error);
    return Promise.reject(error);
  }
};
