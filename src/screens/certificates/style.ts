import {StyleSheet} from 'react-native';
import colors from '../../assets/theme/colors';

export default StyleSheet.create({
  wrapper: {
    // flex: 1,
    paddingHorizontal: 12,
  },
  noCertificateBought: {
    flex: 1,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 200,
  },
  noCertificateBoughtCertificateImgWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  noCertificateBoughtCertificateImg: {
    width: 64,
    height: 64,
  },
  noCertificateBoughtCertificateTextWrapper: {
    marginBottom: 20,
  },
  noCertificateBoughtCertificateTextBold: {
    color: '#7A869A',
    fontSize: 18,
    fontFamily: 'YekanBakh-Bold',
    marginTop: 28,
    textAlign: 'center',
  },
  noCertificateBoughtCertificateText: {
    color: '#A5ADBA',
    fontSize: 14,
    fontFamily: 'YekanBakh-Bold',
    marginTop: 10,
    textAlign: 'center',
  },
  noCertificateBoughtCertificateBtnGroup: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noCertificateBoughtCertificateBtnWrapper: {
    width: '50%',
    padding: 10,
  },
  textTitle: {
    color: '#00091A',
    fontSize: 18,
    fontFamily: 'YekanBakh-Bold',
    marginTop: 20,
  },
  certificateDataCardsWrapper: {
    marginVertical: 15,
  },
  certificateDataCard: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#F4F5F7',
    paddingHorizontal: 10,
    marginVertical: 12,
    paddingBottom: 20,
  },
  certificateDataCardStateText: {
    color: '#7A869A',
    fontSize: 14,
    fontFamily: 'YekanBakh-Bold',
    marginTop: 10,
    marginRight: 10,
  },
  certificateDataCardDateWrapper: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
    marginVertical: 10,
  },
  certificateDataCardDateText: {
    color: '#7A869A',
    fontSize: 16,
    fontFamily: 'YekanBakh-Bold',
  },
  certificateDataCardSmallIcon: {
    width: 25,
    height: 25,
    marginRight: 5,
  },
  certificateDataCardDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#EBECF0',
    borderStyle: 'dashed',
    marginVertical: 10,
  },
  certificateDataCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  deviceCertificateExistText: {
    color: '#ff0000',
    fontFamily: 'YekanBakh-Bold',
    flex: 1,
  },
  deviceAndRisheCertificateExistContainer: {
    flexDirection: 'row',
    gap: 5,
  },
  deviceAndRisheCertificateExistText: {
    fontFamily: 'YekanBakh-Bold',
    fontSize: 16,
    flex: 1,
  },
  deviceAndRisheCertificateExistIcon: {
    width: 32,
    height: 20,
  },
});
