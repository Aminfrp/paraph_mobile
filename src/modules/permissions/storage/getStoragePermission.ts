import {PermissionsAndroid, Platform, NativeModules} from 'react-native';
import debugLogger from '../../../helpers/debugLogger';
import DeviceInfo from 'react-native-device-info';
const {PermissionFile} = NativeModules;

type PermissionDataModel = {
  granted: boolean;
  readGranted: boolean;
  writeGranted: boolean;
};

const getAndroidNativePermission = async () => {
  if (Number(Platform.Version) >= 30) {
    let data: Partial<PermissionDataModel> = {};

    const setGrantData = (bool: boolean) => {
      if (bool) {
        data = {
          granted: true,
          readGranted: true,
          writeGranted: true,
        };
        return;
      }
      data = {
        granted: false,
        readGranted: false,
        writeGranted: false,
      };
    };

    PermissionFile.checkAndGrantPermission(
      (err: any) => {
        if (err) {
          debugLogger('Permission Error', err);
          setGrantData(err);
        }
      },
      (success: any) => {
        if (success) {
          // You can use RN-fetch-blog to download file and storage into download Manager
          debugLogger('Access granted!');
          setGrantData(true);
        }
      },
    );
  }
};

export default async () => {
  const granted = await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  ]);

  let deviceVersion = DeviceInfo.getSystemVersion();
  let readGranted;
  let writeGranted;

  if (Number(deviceVersion) >= 13) {
    readGranted = PermissionsAndroid.RESULTS.GRANTED;
    writeGranted = PermissionsAndroid.RESULTS.GRANTED;
  } else {
    await getAndroidNativePermission();

    readGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    );
    writeGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );
  }

  return {
    granted,
    readGranted,
    writeGranted,
  };
};
