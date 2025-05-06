import {PermissionsAndroid} from 'react-native';

export default async () => {
  const permission = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
    {
      title: 'دسترسی به مخاطبین',
      message: 'برنامه پاراف برای دسترسی به مخاطبین به اجازه شما نیاز دارد.',
      buttonNeutral: 'بعدا',
      buttonNegative: 'لغو',
      buttonPositive: 'اجازه میدهم',
    },
  );
  if (permission === PermissionsAndroid.RESULTS.GRANTED) {
    return true;
  }
  return false;
};
