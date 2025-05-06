import {ContextSingleStoreModel} from '../index';

const userStore: ContextSingleStoreModel<any> = {
  isReady: false,
  dispatch: () => {
    console.error('userStore is NOT ready');
  },
  state: null,
};

export default userStore;
