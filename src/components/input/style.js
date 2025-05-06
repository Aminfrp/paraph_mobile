import {StyleSheet} from 'react-native';
import colors from '../../assets/theme/colors';

export default StyleSheet.create({
  inputContainer: {
    paddingVertical: 12,
  },
  wrapper: {
    height: 46,
    // borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 5,
    marginTop: 5,
    backgroundColor: '#FAFBFC',
  },
  textInput: {
    flex: 1,
    width: '100%',
    fontSize: 15,
    backgroundColor: '#FAFBFC',
    // color: colors.black,

    fontFamily: 'YekanBakh-Bold',
    textAlign: 'right',
  },
  error: {
    color: colors.primary.danger,
    fontFamily: 'YekanBakh-Bold',
    paddingTop: 4,
    fontSize: 12,
    textAlign: 'right',
  },
  description: {
    color: colors.primary.gray,
    fontFamily: 'YekanBakh-Bold',
    paddingTop: 4,
    fontSize: 12,
  },
  labelWrapper: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontFamily: 'YekanBakh-Bold',
    paddingBottom: 10,
    color: '#00091A',
  },
  switchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    fontFamily: 'YekanBakh-Bold',
    color: '#253858',
  },
  eyeImg: {
    width: 20,
    height: 20,
  },
});
