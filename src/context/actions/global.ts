import * as actionTypes from '../../constants/actionTypes';

export const toggleActiveRouteName = <T>(
  payload: T,
  cbFunction?: (input?: any) => void,
) => {
  return {
    type: actionTypes.TOGGLE_ACTIVE_ROUTE_NAME,
    payload,
    handler: cbFunction || null,
  };
};
