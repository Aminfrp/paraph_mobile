import {StyleSheet} from 'react-native';
import colors from '../../assets/theme/colors';

export default StyleSheet.create({
  wrapper: {
    backgroundColor:
      'linear-gradient(180deg, #F0F0F0 0%, rgba(174, 252, 210, 0.35) 100%)',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  linkBtn: {
    fontSize: 14,
    color: colors.accent,
    fontFamily: 'YekanBakh-Bold',
    paddingVertical: 20,
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: '#000',
    textAlign: 'center',
  },
  form: {
    zIndex: 10,
    height: '60%',
  },
  bottomWaveImg: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: -10,
  },
  topWaveImg: {
    width: '100%',
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: -10,
  },
  error: {
    color: colors.primary.danger,
    fontFamily: 'YekanBakh-Bold',
    paddingTop: 4,
    fontSize: 12,
    textAlign: 'right',
  },
});
