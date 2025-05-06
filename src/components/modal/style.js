import {StyleSheet} from 'react-native';
import colors from '../../assets/theme/colors';

export default StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '94%',
  },
  headerWrapper: {},
  title: {
    fontFamily: 'YekanBakh-Bold',
    fontSize: 18,
    color: colors.accent,
    marginBottom: 10,
    padding: 8,
  },
  overlay: {
    flex: 1,
    backgroundColor: colors.secondary.grayDark,
    width: '100%',
    height: '100%',
    position: 'absolute',
    opacity: 0.6,
  },
});
