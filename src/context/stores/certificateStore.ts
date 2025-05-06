import {ContextSingleStoreModel} from '../index';

const certificateStore: ContextSingleStoreModel<any> = {
  isReady: false,
  dispatch: () => {
    console.error('rootCertificateStore is NOT ready');
  },
  state: null,
};

export default certificateStore;
