import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  wrapper: {
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  textTitle: {
    color: '#00091A',
    fontSize: 19,
    fontFamily: 'YekanBakh-Bold',
    marginTop: 20,
  },
  text: {
    color: '#253858',
    fontSize: 14,
    fontFamily: 'YekanBakh-Bold',
    marginTop: 10,
  },
  paymentFooter: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  card: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderRadius: 8,
    paddingVertical: 36,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    borderStyle: 'solid',
    width: '100%',
    marginTop: 28,
  },
  bodyContainer: {
    paddingHorizontal: 66,
  },
  icon: {
    width: 25,
    height: 25,
  },
});
