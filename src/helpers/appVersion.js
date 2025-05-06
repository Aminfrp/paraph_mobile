import {createRef} from 'react';
import {getUpdateService} from '../apis';
import {APP_VERSION} from '../config/APIConfig';
import debugLogger from './debugLogger';

export const refRBSheet = createRef();

export const getAppVersion = () => {
  return async (setState, showModal) => {
    try {
      const response = await getUpdateService(APP_VERSION, 'mobile');
      const data = response && response.data;

      if (data.active) {
        setState(data);
        refRBSheet.current.open();
        showModal(true);
        return Promise.resolve({data});
      }
    } catch (error) {
      debugLogger('error in getAppVersion:', error);
    }
  };
};
