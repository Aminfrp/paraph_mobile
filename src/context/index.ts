import {GlobalContext} from './provider/globalProvider';
import {UserContext} from './provider/userProvider';
import {CertificateContext} from './provider/certificateProvider';

export type ContextSingleStoreModel<T> = {
  isReady: boolean;
  dispatch: (input?: any) => void;
  state: T;
};

export type ContextDispatchModel = (input?: any) => void;

export type ContextReducerModel<T> = {type: string; payload: T};

export {GlobalContext, UserContext, CertificateContext};
