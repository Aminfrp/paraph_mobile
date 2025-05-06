import {useFocusEffect} from '@react-navigation/native';
import {useCallback, useContext} from 'react';
import {GlobalContext} from '../context';
import {GlobalAction} from '../context/actions';
import useCurrentRouteName from './useCurrentRouteName';

export default function useActiveRouteNameSetter(
  cbFunction?: (input?: any) => void,
) {
  const {globalDispatch} = useContext<any>(GlobalContext);
  const [curRoute] = useCurrentRouteName();

  useFocusEffect(
    useCallback(() => {
      globalDispatch(
        GlobalAction.toggleActiveRouteName<string>(curRoute, cbFunction),
      );
    }, []),
  );
}
