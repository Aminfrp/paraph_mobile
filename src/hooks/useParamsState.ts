import {RouteProp, useRoute} from '@react-navigation/native';

export default () => {
  const route = useRoute<RouteProp<any>>();
  const paramsState = route.params;

  return paramsState;
};
