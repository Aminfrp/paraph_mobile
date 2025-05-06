import {useCallback, useContext, useEffect, useState} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {getCurRouteName} from '../helpers/getActiveRouteState';
import {GlobalAction} from '../context/actions';
import {GlobalContext} from '../context';

export default (isSet, handler) => {
  const [value, setValue] = useState('');
  const {globalDispatch, globalState} = useContext(GlobalContext);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const curRoute = getCurRouteName(navigation.getState);
      setValue(curRoute);

      if (isSet) {
        if (handler) {
          globalDispatch(GlobalAction.toggleActiveRouteName(curRoute, handler));
        } else {
          globalDispatch(GlobalAction.toggleActiveRouteName(curRoute));
        }
      }
    }, []),
  );

  return [value, setValue];
};
