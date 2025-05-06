import {StyleSheet} from 'react-native';
import colors from '../../assets/theme/colors';

export default StyleSheet.create({
  container: {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    width: '100%',
    backgroundColor: 'white',
    zIndex: 200,
  },
  modalWrapper: {
    width: '100%',
  },
  modalTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'YekanBakh-Bold',
    paddingBottom: 20,
  },
  modalText: {
    textAlign: 'center',
    fontSize: 18,
    color: colors.accent,
    fontFamily: 'YekanBakh-Bold',
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnWrapper: {
    width: '50%',
    paddingHorizontal: 10,
  },
});
