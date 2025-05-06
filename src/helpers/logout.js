import RNRestart from 'react-native-restart';
import {clearAsyncStorage} from './asyncStorage';
import userStore from '../context/stores/userStore';
import {UserAction} from '../context/actions';

export default async () => {
  await clearAsyncStorage();
  await userStore.dispatch(UserAction.loginUserAsBusiness(false));
  await userStore.dispatch(UserAction.toggleUserIsAuthenticate(false));
  await RNRestart.Restart();
};
