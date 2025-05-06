import {StyleSheet} from 'react-native';
import colors from '../../assets/theme/colors';

export default StyleSheet.create({
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
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
    paddingTop: 10,
    paddingHorizontal: 5,
    color: colors.accent,
  },
  mainWrapper: {},
  modalText: {
    textAlign: 'center',
    fontSize: 16,
    color: colors.accent,
    fontFamily: 'YekanBakh-Bold',
    paddingBottom: 15,
    paddingHorizontal: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    width: '50%',
    paddingHorizontal: 10,
  },
  link: {
    textAlign: 'center',
    fontSize: 16,
    color: colors.primary.success,
    fontFamily: 'YekanBakh-Bold',
    paddingBottom: 10,
  },
});
