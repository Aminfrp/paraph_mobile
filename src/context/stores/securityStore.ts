import {ContextSingleStoreModel} from '../index';

const securityStore: ContextSingleStoreModel<any> = {
  isReady: false,
  dispatch: () => {
    console.error('userStore is NOT ready');
  },
  state: null,
};

export default securityStore;
