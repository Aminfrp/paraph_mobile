import {ContextSingleStoreModel} from '../index';

const contractStore: ContextSingleStoreModel<any> = {
  isReady: false,
  dispatch: () => {
    console.error('contractStore is NOT ready');
  },
  state: null,
};

export default contractStore;
