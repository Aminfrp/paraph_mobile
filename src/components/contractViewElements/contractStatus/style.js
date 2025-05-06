import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  wrapper: {
    // paddingHorizontal: 10,
    // height: 52,
    marginVertical: 0,
    borderRadius: 40,
    borderStyle: 'solid',
    borderWidth: 1.5,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  loaderSection: {
    flexDirection: 'row',
  },
  textMessage: {
    fontSize: 17,
    fontFamily: 'YekanBakh-Bold',
    textAlign: 'center',
  },
  numberStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    borderRadius: 24 / 2,
    backgroundColor: '#F0F0F1',
    marginLeft: 8,
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    // alignItems: 'flex-end',
    paddingHorizontal: 5,
  },
  name: {
    color: '#333333',
    fontSize: 14,
    fontFamily: 'YekanBakh-Bold',
    marginBottom: 5,
  },
  codeContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  code: {color: '#828282', fontSize: 12, fontFamily: 'YekanBakh-Bold'},
  number: {
    fontSize: 16,
    color: '#828282',
    fontFamily: 'YekanBakh-Bold',
  },
  date: {
    fontSize: 12,
    fontFamily: 'YekanBakh-Bold',
  },
  dateTitle: {
    marginBottom: 5,
    color: '#828282',
    fontSize: 12,
    fontFamily: 'YekanBakh-Bold',
    textAlign: 'center',
  },
});
