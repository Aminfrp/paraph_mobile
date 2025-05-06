import React, {createContext, useReducer, useEffect} from 'react';
import userInitialStates from '../initialStates/user';
import userReducer from '../reducers/user';
import userStore from '../stores/userStore';
import {clearAsyncStorage, getAsyncStorage} from '../../helpers/asyncStorage';
import * as keyStorage from '../../constants/keyStorage';
import {UserAction} from '../actions';

export const UserContext = createContext({});

const UserProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [userState, userDispatch] = useReducer(userReducer, userInitialStates);

  if (!userStore.isReady) {
    userStore.isReady = true;
    userStore.dispatch = userDispatch;
    userStore.state = userState;
    Object.freeze(userStore);
  }

  useEffect(() => {
    getUser();
    return () => {};
  }, []);

  const getUser = async () => {
    try {
      const contactInfo = await getAsyncStorage(
        'object',
        keyStorage.CONTACT_INFO,
      );

      const expiresTokenTime = await getAsyncStorage(
        'object',
        keyStorage.EXPIRES_TOKEN_TIME,
      );

      const date = new Date(new Date(expiresTokenTime.date).getTime());
      date.setSeconds(1800); // 30 min...

      const now = new Date().getTime();
      const expireTime = new Date(date).getTime();

      if (contactInfo && userState.isAuthenticated === false) {
        userDispatch(UserAction.toggleUserIsAuthenticate(true));

        if (now >= expireTime) {
          await clearAsyncStorage();
          userDispatch(UserAction.toggleUserIsAuthenticate(false));
        }

        if (contactInfo.asBusiness && userState.loginUserAsBusiness === false) {
          userDispatch(UserAction.loginUserAsBusiness(true));
        }
      }
    } catch (error) {}
  };

  return (
    <UserContext.Provider
      value={{
        userState,
        userDispatch,
      }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
