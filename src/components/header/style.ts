import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  titleWrapper: {
    height: 56,
    backgroundColor: '#fff',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EBECF0',
  },
  titleText: {
    fontSize: 16,
    color: '#253858',
    fontFamily: 'YekanBakh-Bold',
  },
  backBtnImg: {
    width: 18,
    height: 18,
  },
  buyHistoryButton:{
    marginRight:"auto",
    flex:1,
  },
  buyHistoryText:{
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'YekanBakh-Bold',
    color: '#253858',
    marginRight:"auto",
    borderStyle:'solid',
    borderColor: '#253858',
    borderWidth:1,
    borderRadius:5,
    padding:5
  }
});
