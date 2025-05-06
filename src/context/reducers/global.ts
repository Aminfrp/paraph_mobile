import * as actionTypes from '../../constants/actionTypes';
import {ContextReducerModel} from '../index';

interface Model<T> extends ContextReducerModel<T> {
  handler: any;
}

const global = (state: any, {type, payload, handler}: Model<any>) => {
  switch (type) {
    case actionTypes.TOGGLE_ACTIVE_ROUTE_NAME:
      return {
        ...state,
        activeRouteName: payload,
        activeRouteHandler: handler,
      };

    default:
      return state;
  }
};

export default global;
