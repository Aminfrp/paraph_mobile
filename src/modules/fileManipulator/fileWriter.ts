import * as RNFS from 'react-native-fs';
import debugLogger from '../../helpers/debugLogger';
import isStoragePermissionValid from '../permissions/storage/isStoragePermissionValid';

export default async (path: string, fileData: string, encoding = 'base64') => {
  try {
    if (await isStoragePermissionValid()) {
      return Promise.resolve(await RNFS.writeFile(path, fileData, encoding));
    }
  } catch (error) {
    debugLogger('error in fileWriter: ', error);
    return Promise.reject(error);
  }
};
