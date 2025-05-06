import {StyleSheet} from 'react-native';
import colors from '../../assets/theme/colors';

export default StyleSheet.create({
  logoImage: {
    height: 110,
    width: 110,
    alignSelf: 'center',
    marginTop: 20,
  },
  item: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: colors.secondary.gray,
    borderStyle: 'solid',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  itemText: {
    fontSize: 17,
    paddingVertical: 7,
    padding: 7,
    textAlign: 'center',
    fontFamily: 'YekanBakh-Bold',
  },
  itemDangerColor: {
    color: colors.primary.danger,
  },
  itemPrimaryColor: {
    color: colors.accent,
  },
  headerStyle: {
    backgroundColor: '#ffffff',
    height: 66,
  },
  backIcon: {},
  menuIcon: {},
  headerTitleWrapper: {},
  headerTitleLogo: {
    height: 32,
    width: 70,
  },
  drawerContentWrapper: {
    flex: 1,
  },
  drawerScrollbarWrapper: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },
  modalTextDescription: {
    fontFamily: 'YekanBakh-Bold',
    fontSize: 16,
    color: colors.accent,
    marginBottom: 10,
  },
});
