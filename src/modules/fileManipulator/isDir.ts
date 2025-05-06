import isStoragePermissionValid from '../permissions/storage/isStoragePermissionValid';
import RNFetchBlob from 'rn-fetch-blob';
import {Logger} from '../log/logger.ts';

export default async (folderPath: string) => {
  try {
    if (await isStoragePermissionValid()) {
      return await RNFetchBlob.fs.isDir(folderPath);
    }
  } catch (error) {
    Logger.debugLogger('error in isDir: ', error);
    return Promise.reject(error);
  }
};
