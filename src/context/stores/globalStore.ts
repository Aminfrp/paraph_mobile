import {ContextSingleStoreModel} from '../index';

const globalStore: ContextSingleStoreModel<any> = {
  isReady: false,
  dispatch: () => {
    console.error('globalStore is NOT ready');
  },
  state: null,
};

export default globalStore;
