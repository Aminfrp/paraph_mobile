import * as RNFS from 'react-native-fs';
import debugLogger from '../../helpers/debugLogger';
import isStoragePermissionValid from '../permissions/storage/isStoragePermissionValid';

export default async (
  path: string,
  encoding = 'base64',
): Promise<Promise<string> | undefined> => {
  try {
    if (await isStoragePermissionValid()) {
      return Promise.resolve(await RNFS.readFile(path, encoding));
    }
  } catch (error) {
    debugLogger('error in fileReader: ', error);
    return Promise.reject(error);
  }
};
