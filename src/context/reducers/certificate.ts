import * as actionTypes from '../../constants/actionTypes';
import {ContextReducerModel} from '../index';

const certificate = (state: any, {type, payload}: ContextReducerModel<any>) => {
  switch (type) {
    case actionTypes.GET_PRODUCT_BY_ID_REQUEST:
      return {
        ...state,
        risheProduct: {...state.risheProduct, loading: true},
      };
    case actionTypes.GET_PRODUCT_BY_ID_SUCCESS:
      return {
        ...state,
        risheProduct: {
          ...state.risheProduct,
          data: payload,
          loading: false,
        },
      };

    case actionTypes.GET_PRODUCT_BY_ID_FAILURE:
      return {
        ...state,
        risheProduct: {
          ...state.risheProduct,
          data: null,
          loading: false,
        },
      };

    case actionTypes.GET_NAMAD_PRODUCT_BY_ID_REQUEST:
      return {
        ...state,
        namadProduct: {...state.namadProduct, loading: true},
      };
    case actionTypes.GET_NAMAD_PRODUCT_BY_ID_SUCCESS:
      return {
        ...state,
        namadProduct: {
          ...state.namadProduct,
          data: payload,
          loading: false,
        },
      };
    case actionTypes.GET_NAMAD_PRODUCT_BY_ID_FAILURE:
      return {
        ...state,
        namadProduct: {
          ...state.namadProduct,
          data: null,
          loading: false,
        },
      };

    case actionTypes.SET_NAMAD_CERTIFICATE_IN_OTHER_DEVICE:
      return {
        ...state,
        namadProduct: {
          ...state.namadProduct,
          certificateInOtherDevice: payload,
        },
      };

    case actionTypes.SET_RISHE_CERTIFICATE_IN_OTHER_DEVICE:
      return {
        ...state,
        risheProduct: {
          ...state.risheProduct,
          certificateInOtherDevice: payload,
        },
      };

    default:
      return state;
  }
};

export default certificate;
