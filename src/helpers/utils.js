import {Alert} from 'react-native';
import {
  getAsyncStorage,
  clearAsyncStorage,
  removeAsyncStorage,
} from './asyncStorage';
import {UserAction} from '../context/actions';
import * as keyStorage from '../constants/keyStorage';
import userStore from '../context/stores/userStore';
import toastAndroid from '../components/toastAndroid';
import {navigate} from '../navigation/navigationRoot';
import * as routesName from '../constants/routesName';
import appRestarter from './appRestarter';

export const getAccessToken = async () => {
  return await getAsyncStorage('text', keyStorage.ACCESS_TOKEN);
};

export const logout = async () => {
  await clearAsyncStorage();
  await userStore.dispatch(UserAction.toggleUserIsAuthenticate(false));
  await userStore.dispatch(UserAction.loginUserAsBusiness(false));
};

export const onUserInfoTokenFailure = async () => {
  await removeAsyncStorage(keyStorage.CONTACT_INFO);
  await removeAsyncStorage(keyStorage.MOBILE_NUMBER);
  await removeAsyncStorage(keyStorage.ACCESS_TOKEN);
  await removeAsyncStorage(keyStorage.SECRET_KEY);
  await userStore.dispatch(UserAction.toggleUserIsAuthenticate(false));
  await navigate(routesName.APP);
  appRestarter();
};

export const onServerInternalError = () => {
  toastAndroid('خطا در سرور داخلی', 'long', 'bottom');
};

export const onAuthorizeError = () => {
  onUserInfoTokenFailure();
};

export const deniedPermissionAlert = () => {
  Alert.alert(
    'دسترسی داده نشد!',
    'پاراف برای دانلود کردن فایل به اجازه دسترسی نیاز دارد',
    [
      {
        text: 'بستن',
        onPress: () => null,
      },
    ],
    {
      cancelable: false,
    },
  );
};

export const contractExpiredAlert = () => {
  Alert.alert(
    'قرارداد',
    'قرارداد منقضی شده است!',
    [
      {
        text: 'بستن',
        onPress: () => null,
      },
    ],
    {
      cancelable: false,
    },
  );
};

export const getContractStatusBadgeTypeColor = (status: string): string => {
  switch (status) {
    case 'SUBMITTED': {
      return '#FFC107';
    }
    case 'DOWNLOADED': {
      return '#FFC107';
    }
    case 'NOT_SIGNED': {
      return '#DC3545';
    }
    case 'OPENED': {
      return '#007BFF';
    }
    case 'FAIL_TO_FETCH': {
      return '#17A2B8';
    }
    case 'SIGNED': {
      return '#28A745';
    }
    case 'REJECTED': {
      return '#DC3545';
    }
    case 'GATEWAY_SIGNED': {
      return '#28A745';
    }
    case 'WAIT_FOR_SIGN_ON_GATEWAY': {
      return '#FFC107';
    }

    default: {
      return '#FFC107';
    }
  }
};
