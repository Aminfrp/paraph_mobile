import React from 'react';
import UserProvider from './provider/userProvider';
import GlobalProvider from './provider/globalProvider';
import CertificateProvider from './provider/certificateProvider';

const RootProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  return (
    <GlobalProvider>
      <UserProvider>
        <CertificateProvider>{children}</CertificateProvider>
      </UserProvider>
    </GlobalProvider>
  );
};

export default RootProvider;
