import React, {createContext, useReducer, useState, useEffect} from 'react';
import globalInitialStates from '../initialStates/global';
import globalReducer from '../reducers/global';
import globalStore from '../stores/globalStore';
import {getAppVersion} from '../../helpers/appVersion';
import AppVersion from '../../components/appVersion';

export const GlobalContext = createContext({});

const GlobalProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [globalState, globalDispatch] = useReducer(
    globalReducer,
    globalInitialStates,
  );
  const [versionInfo, setVersionInfo] = useState({
    active: false,
    version: '',
    filePath: '',
    visible: false,
  });
  const [showVersionInfoModal, setShowVersionInfoModal] = useState(false);

  useEffect(() => {
    getAppVersion()(setVersionInfo, setShowVersionInfoModal);

    return () => {};
  }, []);

  if (!globalStore.isReady) {
    globalStore.isReady = true;
    globalStore.dispatch = globalState;
    globalStore.state = globalDispatch;
    Object.freeze(globalStore);
  }

  return (
    <GlobalContext.Provider
      value={{
        globalState,
        globalDispatch,
      }}>
      {children}
      <AppVersion
        visible={showVersionInfoModal}
        filePath={versionInfo && versionInfo?.filePath}
        version={versionInfo && versionInfo?.version}
        disabled={false}
      />
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
