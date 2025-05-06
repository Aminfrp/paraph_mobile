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
  linkBtn: {
    fontSize: 16,
    fontFamily: 'YekanBakh-Bold',
    paddingTop: 10,
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: '#000',
    textAlign: 'center',
  },
  form: {
    zIndex: 10,
    height: '50%',
  },
  phoneNumberInformation: {},
  btnGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnWrapper: {
    width: '45%',
    paddingHorizontal: 5,
  },
  text: {
    color: colors.accent,
    paddingBottom: 20,
    textDecorationStyle: 'solid',
    textDecorationColor: '#000',
    textAlign: 'center',
  },
  modalTextDescription: {
    fontFamily: 'YekanBakh-Bold',
    fontSize: 16,
    color: colors.accent,
    marginBottom: 10,
  },
  error: {
    color: colors.primary.danger,
    fontFamily: 'YekanBakh-Bold',
    paddingTop: 4,
    fontSize: 12,
  },
  phone: {
    textDecorationLine: 'underline',
    paddingHorizontal: 10,
  },
  textLabel: {
    fontSize: 18,
    color: colors.success,
    fontFamily: 'YekanBakh-Bold',
    textDecorationStyle: 'solid',
    textDecorationColor: '#000',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  timerWrapper: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  otpInputView: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 4,
    flexDirection: 'row',
  },
  pinCodeContainerStyle: {
    backgroundColor: 'white',
    width: 48,
    height: 48,
  },
  pinCodeTextStyle: {
    fontSize: 14,
  },
  focusedPinCodeContainerStyle: {
    borderColor: '#afafaf',
    borderWidth: 1,
    borderStyle: 'solid',
  },
  borderStyleBase: {
    width: 30,
    height: 45,
  },
  borderStyleHighLighted: {
    borderColor: colors.primary.success,
  },
  underlineStyleBase: {
    width: 42,
    height: 42,
    borderWidth: 1,
    borderRadius: 8,
    color: colors.black,
    backgroundColor: '#ffffffcc',
  },
  underlineStyleHighLighted: {
    borderColor: '#03DAC6',
  },
  timerDigitStyle: {
    fontSize: 16,
    paddingHorizontal: 10,
    fontFamily: 'YekanBakh-Bold',
  },
  bottomWaveImg: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: -10,
  },
  topWaveImg: {
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: -10,
  },
});
