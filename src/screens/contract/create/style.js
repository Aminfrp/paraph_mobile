import {StyleSheet} from 'react-native';
import colors from '../../../assets/theme/colors';

export default StyleSheet.create({
  wrapper: {},
  screenHeader: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    backgroundColor: colors.white,
  },
  screenTitle: {
    color: colors.accent,
    fontFamily: 'YekanBakh-Bold',
    fontSize: 18,
  },
  formWrapper: {
    padding: 12,
  },
  inputWrapper: {},
  inputInfoText: {
    fontFamily: 'YekanBakh-Bold',
    fontSize: 12,
    color: colors.primary.gray,
    textAlign: 'left',
  },
  contactListCounterWrapper: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactListCounter: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  contactListCounterText: {
    color: colors.primary.gray,
    fontFamily: 'YekanBakh-Bold',
    paddingTop: 4,
    fontSize: 15,
    marginHorizontal: 6,
  },
  contactListCounterNumberText: {
    color: colors.accent,
    fontFamily: 'YekanBakh-Bold',
    paddingTop: 4,
    fontSize: 15,
  },
  btnGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnWrapper: {
    width: '50%',
    padding: 10,
  },
  addContactsBtn: {
    paddingHorizontal: 12,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderWidth: 1,
    backgroundColor: colors.accent,
    width: '100%',
    marginVertical: 5,
  },
  getCertificateBtn: {
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderWidth: 1,
    borderColor: colors.accent,
    width: 90,
  },
  addContactsBtnText: {
    color: colors.white,
    fontFamily: 'YekanBakh-Bold',
    fontSize: 12,
  },
  getCertificateBtnText: {
    color: colors.accent,
    fontFamily: 'YekanBakh-Bold',
    fontSize: 12,
  },
  error: {
    color: colors.primary.danger,
    fontFamily: 'YekanBakh-Bold',
    paddingTop: 4,
    fontSize: 12,
    textAlign: 'right',
  },
});
