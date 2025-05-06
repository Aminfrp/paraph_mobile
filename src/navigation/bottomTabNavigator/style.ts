import {Dimensions, StyleSheet} from 'react-native';
import colors from '../../assets/theme/colors';

export default StyleSheet.create({
  navigationWrapper: {
    backgroundColor: colors.white,
    height: 55,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    shadowColor: '#171717',
    shadowOffset: {width: 30, height: 20},
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 20,
    position: 'relative',
  },
  tabBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    height: 44,
  },
  addBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    // position: 'absolute',
    // left: Dimensions.get('window').width / 2 - 25,
    // bottom: '240%',
    backgroundColor: colors.primary.success,
    // zIndex: 999999,
    width: 40,
    height: 40,
    transform: [{rotate: '45deg'}],
  },
  groupContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '40%',
  },
  tabBtnText: {
    color: colors.primary.grayDark,
    fontFamily: 'Vazir-Medium',
    fontSize: 17,
    marginHorizontal: 10,
  },
  tabBtnActive: {},
  contentContainer: {
    height: '100%',
  },
  tabBtnWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnIcon: {
    width: 22,
    height: 22,
  },
  confirmModalWrapper: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  confirmModalRow: {
    height: '45%',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderColor: colors.lightGray,
    flexDirection: 'row',
    alignItems: 'center',
    // paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  confirmModalBottomRow: {
    height: '50%',
    borderStyle: 'solid',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  confirmModalIcon: {
    width: 25,
    height: 25,
  },
  confirmModalRowTextWrapper: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  confirmModalRowBoldText: {
    color: colors.primary.success,
    fontFamily: 'YekanBakh-Bold',
    fontSize: 17,
    marginVertical: 5,
  },
  confirmModalRowText: {
    color: colors.gray,
    fontFamily: 'YekanBakh-Bold',
    fontSize: 14,
    marginVertical: 5,
  },
});

// import {StyleSheet} from 'react-native';
// import colors from '../../assets/theme/colors';
//
// export default StyleSheet.create({
//   navigationWrapper: {
//     backgroundColor: colors.white,
//     height: 58,
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     padding: 20,
//     shadowColor: '#171717',
//     shadowOffset: {width: 30, height: 20},
//     shadowOpacity: 1,
//     shadowRadius: 3,
//     elevation: 20,
//   },
//   tabBtn: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 10,
//     height: 44,
//     width: 120,
//   },
//   tabBtnText: {
//     color: colors.primary.grayDark,
//     fontFamily: 'Vazir-Medium',
//     fontSize: 17,
//     marginHorizontal: 10,
//   },
//   tabBtnActive: {},
//   contentContainer: {
//     height: '100%',
//   },
//   tabBtnWrapper: {
//     flexDirection: 'row-reverse',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   btnIcon: {
//     width: 22,
//     height: 22,
//   },
// });
