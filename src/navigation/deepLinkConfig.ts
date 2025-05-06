import {LinkingOptions} from '@react-navigation/native';

const config = {
  screens: {
    CERTIFICATE: {
      screens: {
        CHECK_CERTIFICATE: '/certificate/check',
        GENERATE_CERTIFICATE_DEEP_LINK: {
          path: '/certificate/generate/:invoiceId/:customerInvoiceId/:keyId',
        },
      },
    },
  },
};

const linking: LinkingOptions<ReactNavigation.RootParamList> | undefined = {
  prefixes: [`paraph.me://app/`],
  config: config,
};

export default linking;
