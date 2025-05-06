import {StyleSheet} from 'react-native';
import colors from '../../assets/theme/colors';

export default StyleSheet.create({
  appTitleWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 25,
    // flex: 1,
  },
  appTitleText: {
    fontSize: 16,
    color: colors.accent,
    fontFamily: 'Vazir-Medium',
    paddingVertical: 20,
  },
  appLogoTitleText: {
    fontSize: 30,
    fontFamily: 'YekanBakh-Bold',
    textAlign: 'center',
    color: colors.primary.lightSuccess,
  },
});
