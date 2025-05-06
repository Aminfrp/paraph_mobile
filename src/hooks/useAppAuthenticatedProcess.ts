import {useContext, useEffect, useState} from 'react';
import {UserContext} from '../context';
import {getAsyncStorage} from '../helpers/asyncStorage';
import * as keyStorage from '../constants/keyStorage';
import {Logger} from '../modules/log/logger';

export default () => {
  const {
    userState: {isAuthenticated},
  } = useContext<any>(UserContext);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(isAuthenticated);
  const [authLoaded, setAuthLoaded] = useState<boolean>(false);

  const componentMountUtils = async (): Promise<void> => {
    await getUser();
  };

  useEffect(() => {
    componentMountUtils().then(r => {});
  }, [isAuthenticated]);

  const getUser = async (): Promise<void> => {
    try {
      const contactInfo = await getAsyncStorage(
        'object',
        keyStorage.CONTACT_INFO,
      );
      const accessToken = await getAsyncStorage(
        'text',
        keyStorage.ACCESS_TOKEN,
      );
      const refreshToken = await getAsyncStorage(
        'text',
        keyStorage.REFRESH_TOKEN,
      );
      Logger.debugLogger('accessToken', accessToken);
      Logger.debugLogger('contactInfo', contactInfo);
      Logger.debugLogger('refreshToken', refreshToken);

      contactInfo ? setIsLoggedIn(true) : setIsLoggedIn(false);

      setAuthLoaded(true);
    } catch (error: any) {
      Logger.debugLogger(error);
    }
  };

  return {
    isLoggedIn,
    authLoaded,
  };
};
