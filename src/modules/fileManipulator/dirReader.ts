import isStoragePermissionValid from '../permissions/storage/isStoragePermissionValid';
import * as RNFS from 'react-native-fs';
import debugLogger from '../../helpers/debugLogger';

export default async (path: string) => {
  try {
    if (await isStoragePermissionValid()) {
      return Promise.resolve(await RNFS.readDir(path));
    }
  } catch (error) {
    debugLogger('error in dirReader: ', error);
    return Promise.reject(error);
  }
};
