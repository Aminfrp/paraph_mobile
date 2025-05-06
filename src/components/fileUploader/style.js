import {StyleSheet} from 'react-native';
import colors from '../../assets/theme/colors';

export default StyleSheet.create({
  wrapper: {},
  fileUploaderLabel: {
    color: colors.primary.grayDark,
    fontFamily: 'YekanBakh-Bold',
    fontSize: 14,
    marginTop: 1,
    marginBottom: 5,
    paddingBottom: 10,
  },
  fileUploader: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 4,
    borderColor: colors.primary.gray,
    borderBottomWidth: 1,
  },
  error: {
    color: colors.primary.danger,
    fontFamily: 'YekanBakh-Bold',
    paddingTop: 4,
    fontSize: 12,
  },
  fileDataWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  pdfIcon: {
    width: 35,
    height: 40,
    marginLeft: 12,
  },
  text: {
    fontFamily: 'YekanBakh-Bold',
    fontSize: 16,
  },
  innerLabelText: {
    fontSize: 16,
    color: colors.primary.grayDark,
    fontFamily: 'YekanBakh-Bold',
  },
});
