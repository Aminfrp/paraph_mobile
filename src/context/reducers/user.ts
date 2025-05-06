import * as actionTypes from '../../constants/actionTypes';
import {ContextReducerModel} from '../index';

const user = (state: any, {type, payload}: ContextReducerModel<any>) => {
  switch (type) {
    case actionTypes.TOGGLE_USER_IS_AUTHENTICATE:
      return {
        ...state,
        isAuthenticated: payload,
      };

    case actionTypes.LOGIN_USER_AS_BUSINESS:
      return {
        ...state,
        loginUserAsBusiness: payload,
      };

    default:
      return state;
  }
};

export default user;
