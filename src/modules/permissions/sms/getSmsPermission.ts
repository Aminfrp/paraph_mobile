import {PermissionsAndroid} from 'react-native';

export default async () => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
  );

  return {
    granted,
  };
};
