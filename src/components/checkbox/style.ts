import {StyleSheet} from 'react-native';
import colors from '../../assets/theme/colors';

export default StyleSheet.create({
  inputContainer: {
    display: 'flex',
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  checkboxContainer: {
    width: 25,
    height: 25,
    borderRadius: 4,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffffcc',
    borderWidth: 1,
  },
  wrapper: {
    height: 46,
    paddingHorizontal: 5,
    marginTop: 5,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  error: {
    color: colors.primary.danger,
    fontFamily: 'YekanBakh-Bold',
    paddingTop: 4,
    fontSize: 12,
  },
  label: {
    fontSize: 15,
    fontFamily: 'YekanBakh-Bold',
    marginHorizontal: 6,
  },
});
