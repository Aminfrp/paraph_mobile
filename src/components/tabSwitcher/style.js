import {StyleSheet} from 'react-native';
import colors from '../../assets/theme/colors';

export default StyleSheet.create({
  container: {
    height: 50,
    borderRadius: 40,
    backgroundColor: '#ececec',
    flexDirection: 'row',
    alignItems: 'center',
  },
  tab: {
    width: '50%',
    borderRadius: 40,
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabTitle: {
    fontSize: 14,
    color: colors.white,
    fontFamily: 'YekanBakh-Bold',
  },
});
