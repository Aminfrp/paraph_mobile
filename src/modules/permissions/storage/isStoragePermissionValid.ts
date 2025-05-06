import getStoragePermission from './getStoragePermission';
import logService from '../../../apis/services/log';
import {deniedPermissionAlert} from '../../../helpers/utils';

export default async (
  logMessage = 'user not allowed to access storage, permission denied!',
) => {
  const {granted, readGranted, writeGranted} = await getStoragePermission();
  if (!readGranted || !writeGranted) {
    await logService('error', logMessage);

    deniedPermissionAlert();

    return false;
  }
  return true;
};
