import {getCurRouteName} from '../helpers/getActiveRouteState';
import {useNavigation} from '@react-navigation/native';

export default function useCurrentRouteName() {
  const {getState} = useNavigation();
  const curRoute = getCurRouteName(getState);

  return [curRoute];
}
