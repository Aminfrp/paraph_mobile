import * as actionTypes from '../../constants/actionTypes';
import {getProductByIdService} from '../../apis';
import {Logger} from '../../modules/log/logger';
import {ContextDispatchModel} from '../index';

const getProductByIdRequest = () => {
  return {
    type: actionTypes.GET_PRODUCT_BY_ID_REQUEST,
  };
};
export const getProductByIdSuccess = <T>(payload: T) => {
  return {
    type: actionTypes.GET_PRODUCT_BY_ID_SUCCESS,
    payload,
  };
};
export const getProductByIdFailure = () => {
  return {
    type: actionTypes.GET_PRODUCT_BY_ID_FAILURE,
  };
};
export const getProductById = <T>(productId: T) => {
  return async (dispatch: ContextDispatchModel) => {
    dispatch(getProductByIdRequest());

    try {
      const response = await getProductByIdService(productId);
      const data = response && response.data;
      const product = data && data[0];

      dispatch(getProductByIdSuccess(product));
    } catch (error) {
      Logger.debugLogger('error in getProductById: ', error);
      dispatch(getProductByIdFailure());
    }
  };
};

const getNamadProductByIdRequest = () => {
  return {
    type: actionTypes.GET_NAMAD_PRODUCT_BY_ID_REQUEST,
  };
};
export const getNamadProductByIdSuccess = <T>(payload: T) => {
  return {
    type: actionTypes.GET_NAMAD_PRODUCT_BY_ID_SUCCESS,
    payload,
  };
};
export const getNamadProductByIdFailure = () => {
  return {
    type: actionTypes.GET_NAMAD_PRODUCT_BY_ID_FAILURE,
  };
};
export const getNamadProductById = <T>(productId: T) => {
  return async (dispatch: ContextDispatchModel) => {
    dispatch(getNamadProductByIdRequest());

    try {
      const response = await getProductByIdService(productId);
      const data = response && response.data;
      const product = data && data[0];

      dispatch(getNamadProductByIdSuccess(product));
    } catch (error) {
      Logger.debugLogger('error in getNamadProductById: ', error);
      dispatch(getNamadProductByIdFailure());
    }
  };
};

export const setIsNamadCertificateInOtherDevice = <T>(payload: T) => {
  return {
    type: actionTypes.SET_NAMAD_CERTIFICATE_IN_OTHER_DEVICE,
    payload,
  };
};

export const setIsRisheCertificateInOtherDevice = <T>(payload: T) => {
  return {
    type: actionTypes.SET_RISHE_CERTIFICATE_IN_OTHER_DEVICE,
    payload,
  };
};
