import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import colors from '../../assets/theme/colors';
import {convertFileSize} from '../../helpers/fileManipulator';

const Index = props => {
  const {value, icon, onPress} = props;

  return (
    <TouchableOpacity style={styles.fileUploader} onPress={onPress}>
      {value ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}>
          <View style={styles.fileDataWrapper}>
            <Image
              source={require('../../assets/img/pdf_icon.png')}
              style={styles.pdfIcon}
            />
            <View style={{flex: 1, marginHorizontal: icon ? 10 : 0}}>
              <Text
                numberOfLines={3}
                style={[
                  styles.text,
                  {
                    color: colors.accent,
                    fontFamily: 'YekanBakh-Bold',
                    fontSize: 18,
                    textAlign: 'right',
                  },
                ]}>
                {value.name}
              </Text>

              <Text
                style={[
                  styles.text,
                  {
                    color: colors.primary.grayDark,
                    textAlign: 'right',
                    fontFamily: 'YekanBakh-Bold',
                  },
                ]}>
                {convertFileSize(value.size)}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {icon && (
                <Image
                  source={require('../../assets/img/download_icon.png')}
                  style={styles.downloadIcon}
                />
              )}
            </View>
          </View>
        </View>
      ) : (
        <>
          <Text style={styles.innerLabelText}>
            برای بارگذاری فایل کلیک کنید.
          </Text>
          <Text style={styles.innerLabelText}>فرمت مجاز: PDF</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fileDataWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  pdfIcon: {
    width: 35,
    height: 40,
    marginLeft: 12,
  },
  text: {
    fontFamily: 'YekanBakh-Bold',
    fontSize: 16,
  },
  innerLabelText: {
    fontSize: 15,
    color: colors.primary.grayDark,
    fontFamily: 'YekanBakh-Bold',
  },
  downloadIcon: {
    width: 28,
    height: 26,
  },
  fileUploader: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: 15,
    // paddingHorizontal: 25,
    borderRadius: 4,
    borderColor: colors.primary.gray,
    borderBottomWidth: 1,
  },
});

export default Index;
