import isStoragePermissionValid from '../permissions/storage/isStoragePermissionValid';
import * as RNFS from 'react-native-fs';
import debugLogger from '../../helpers/debugLogger';
import {Logger} from '../log/logger';

export default async (path: string) => {
  try {
    if (await isStoragePermissionValid()) {
      return Promise.resolve(
        await RNFS.mkdir(path).then(() =>
          Logger.debugLogger(path + ' ' + 'made'),
        ),
      );
    }
  } catch (error) {
    debugLogger('error in mkDir: ', error);
    return Promise.reject(error);
  }
};
