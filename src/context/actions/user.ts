import * as actionTypes from '../../constants/actionTypes';

export const toggleUserIsAuthenticate = <T>(payload: T) => {
  return {
    type: actionTypes.TOGGLE_USER_IS_AUTHENTICATE,
    payload,
  };
};

export const loginUserAsBusiness = <T>(payload: T) => {
  return {
    type: actionTypes.LOGIN_USER_AS_BUSINESS,
    payload,
  };
};
