import isStoragePermissionValid from '../permissions/storage/isStoragePermissionValid';
import RNFetchBlob from 'rn-fetch-blob';
import {Logger} from '../log/logger.ts';

export default async (filePath: string) => {
  try {
    if (await isStoragePermissionValid()) {
      return RNFetchBlob.wrap(filePath);
    }
  } catch (error) {
    Logger.debugLogger('error in wrap: ', error);
    return Promise.reject(error);
  }
};
