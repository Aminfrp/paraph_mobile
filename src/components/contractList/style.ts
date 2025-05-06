import {StyleSheet} from 'react-native';
import colors from '../../assets/theme/colors';

export default StyleSheet.create({
  headerWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    paddingTop: 15,
  },
  headerTitle: {
    color: colors.accent,
    fontFamily: 'YekanBakh-Bold',
    fontSize: 18,
  },
  headerText: {
    color: colors.primary.grayDark,
    fontFamily: 'Vazir-Thin',
    fontSize: 15,
    marginTop: 3,
    marginBottom: 5,
  },
  listContainer: {
    height: '100%',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 8,
    shadowColor: '#171717',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 10,
    padding: 6,
    width: '100%',
  },
  cardTypeText: {
    color: colors.primary.gray,
    fontFamily: 'YekanBakh-Bold',
    fontSize: 16,
    marginVertical: 5,
    textAlign: 'right',
  },
  cardTitle: {
    color: colors.black,
    fontFamily: 'YekanBakh-Bold',
    fontSize: 20,
    marginVertical: 5,
    textAlign: 'right',
  },
  cardFooterWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardCompanyName: {
    color: colors.primary.gray,
    fontFamily: 'YekanBakh-Bold',
    fontSize: 16,
    // paddingHorizontal: 10,
    // textAlign: 'left',
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  contractItemWrapper: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  contractItemCardWrapper: {
    width: '78%',
    // height: 100,
  },
  contractItemDateWrapper: {
    width: '18%',
  },
  contractItemSeparatorWrapper: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  contractDayText: {
    color: colors.primary.grayDark,
    fontFamily: 'YekanBakh-Bold',
    fontSize: 20,
    textAlign: 'center',
  },
  contractMonthText: {
    color: colors.primary.grayDark,
    fontFamily: 'Vazir-Thin',
    fontSize: 15,
    textAlign: 'center',
    marginVertical: 5,
  },
  contractYearText: {
    color: colors.primary.grayDark,
    fontFamily: 'YekanBakh-Bold',
    fontSize: 18,
    textAlign: 'center',
  },
  footerWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
    marginBottom: 40,
  },
  footerBtn: {
    width: '33%',
  },
});
