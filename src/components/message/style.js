import {StyleSheet} from 'react-native';
import colors from '../../assets/theme/colors';

export default StyleSheet.create({
  wrapper: {
    paddingHorizontal: 5,
    height: 52,
    marginVertical: 10,
    borderRadius: 6,
    borderStyle: 'solid',
    borderWidth: 1.5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderSection: {
    flexDirection: 'row',
  },
  textMessage: {
    fontSize: 17,
    fontFamily: 'YekanBakh-Bold',
    textAlign: 'center',
  },
});
