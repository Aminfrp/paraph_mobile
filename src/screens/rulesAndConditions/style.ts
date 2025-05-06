import {StyleSheet} from 'react-native';
import colors from '../../assets/theme/colors';

export default StyleSheet.create({
  wrapper: {
    backgroundColor:
      'linear-gradient(180deg, #F0F0F0 0%, rgba(174, 252, 210, 0.35) 100%)',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-between',
  },
  rulesAndConditionsWrapper: {
    backgroundColor: colors.white,
    color: colors.black,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    paddingTop: 20,
    height: '60%',
    shadowColor: '#171717',
    shadowOffset: {width: 10, height: 10},
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 20,
  },
  rulesAndConditionsWrapperText: {
    fontSize: 16,
    color: colors.accent,
    fontFamily: 'YekanBakh-Bold',
    textAlign: 'right',
    paddingBottom: 20,
  },
  title: {
    fontSize: 18,
    color: colors.success,
    fontFamily: 'YekanBakh-Bold',
    textAlign: 'center',
    padding: 15,
  },
  btnWrapper: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  btn: {
    width: '50%',
  },
  topWaveImg: {
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: -10,
  },
  textTitle: {
    fontSize: 18,
    color: colors.black,
    fontFamily: 'YekanBakh-Bold',
    paddingVertical: 15,
  },
  conditionText: {
    fontSize: 14,
    color: colors.black,
    fontFamily: 'YekanBakh-Bold',
    paddingVertical: 10,
  },
  childrenItem: {
    fontSize: 14,
    color: colors.black,
    fontFamily: 'YekanBakh-Bold',
    textAlign: 'right',
    paddingRight: 10,
  },
});
