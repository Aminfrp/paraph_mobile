import {StyleSheet} from 'react-native';
import colors from '../../assets/theme/colors';

export default StyleSheet.create({
  wrapper: {
    // backgroundColor: colors.secondary.gray,
    flexDirection: 'column',
    flex: 1,
    // justifyContent: 'space-between',
    paddingVertical: 20,
  },
  headerWrapper: {},
  title: {
    color: colors.accent,
    paddingBottom: 20,
    textDecorationStyle: 'solid',
    textDecorationColor: '#000',
    textAlign: 'center',
    paddingTop: 4,
    fontSize: 22,
    fontFamily: 'YekanBakh-Bold',
  },
  form: {
    padding: 20,
  },
  error: {
    color: colors.primary.danger,
    fontFamily: 'YekanBakh-Bold',
    paddingTop: 4,
    fontSize: 12,
    textAlign: 'right',
  },
});
