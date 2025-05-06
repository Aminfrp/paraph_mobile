import {I18nManager} from 'react-native';
import {getAsyncStorage, setAsyncStorage} from './asyncStorage';
import * as keyStorage from '../constants/keyStorage';
import RNRestart from 'react-native-restart';

async function disableRTL() {
  I18nManager.allowRTL(false);
  I18nManager.forceRTL(false);
}

function disableRTLHandler() {
  disableRTL().then(() =>
    getAsyncStorage('text', keyStorage.APP_RESTARTED).then(isRestarted => {
      if (isRestarted === 'true') {
        return;
      }
      setAsyncStorage('text', keyStorage.APP_RESTARTED, true).then(() =>
        RNRestart.Restart(),
      );
    }),
  );
}

export default disableRTLHandler;
