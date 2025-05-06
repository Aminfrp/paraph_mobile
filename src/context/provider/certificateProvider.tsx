import React, {createContext, useReducer} from 'react';
import certificateInitialStates from '../initialStates/certificate';
import rootCertificateReducer from '../reducers/certificate';
import certificateStore from '../stores/certificateStore';

export const CertificateContext = createContext({});

const CertificateProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [certificateState, certificateDispatch] = useReducer(
    rootCertificateReducer,
    certificateInitialStates,
  );

  if (!certificateStore.isReady) {
    certificateStore.isReady = true;
    certificateStore.dispatch = certificateDispatch;
    certificateStore.state = certificateState;
    Object.freeze(certificateStore);
  }

  return (
    <CertificateContext.Provider
      value={{
        certificateState: certificateState,
        certificateDispatch: certificateDispatch,
      }}>
      {children}
    </CertificateContext.Provider>
  );
};

export default CertificateProvider;
