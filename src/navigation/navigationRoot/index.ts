import React from 'react';
import {RefObjModel} from '../../model/refObj.model';

export const navigationRef: RefObjModel<any> = React.createRef();

export function navigate(name: string, params: {}) {
  navigationRef.current?.navigate(name, params);
}

export function getState() {
  navigationRef.current?.getState();
}
