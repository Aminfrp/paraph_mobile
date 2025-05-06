import {StyleSheet} from 'react-native';
import colors from '../../../assets/theme/colors';

export default StyleSheet.create({
  wrapper: {},
  createContactHeaderWrapper: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1000,
    height: 55,
  },
  tabSwitcherWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 30,
  },
  tabSwitcher: {width: '65%'},
  screenHeader: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  screenTitle: {
    color: colors.accent,
    fontFamily: 'YekanBakh-Bold',
    fontSize: 18,
    marginLeft: 12,
  },
  contactSelect: {
    height: 30,
    width: 30,
    borderRadius: 4,
  },
  imgWrapper: {
    width: '40%',
    height: 200,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stretch: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
  form: {
    padding: 20,
  },
  submitWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    marginTop: 30,
  },
  btnWrapper: {
    marginHorizontal: 10,
    width: '40%',
  },
});
