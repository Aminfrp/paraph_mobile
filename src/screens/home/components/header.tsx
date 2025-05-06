import React from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import colors from '../../../assets/theme/colors';

type PropsModel = {
  activeFilterName: string;
  onPress: (input: string) => void;
  loading: boolean;
};

const Index: React.FC<PropsModel> = props => {
  const {activeFilterName, onPress, loading} = props;

  const getTabBackground = (index: string) => {
    return activeFilterName === index
      ? 'rgba(151, 71, 255, 0.13)'
      : 'transparent';
  };

  const options = ['اسناد در انتظار امضا', 'اسناد نیازمند بررسی'];

  return (
    <View
      style={{
        flexDirection: 'column',
        paddingHorizontal: 10,
        paddingVertical: 10,
      }}>
      {loading ? (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            width: '100%',
          }}>
          <ActivityIndicator size="large" color="green" />
        </View>
      ) : (
        <>
          <View style={{flexDirection: 'row-reverse'}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: 38,
                width: '70%',
                gap: 10,
              }}>
              {options.map((el, key) => (
                <TouchableOpacity
                  key={key}
                  onPress={() => onPress(el)}
                  style={{
                    width: '49%',
                    borderRadius: 40,
                    height: '100%',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: getTabBackground(el),
                    paddingHorizontal: 2,
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: '#000',
                      fontFamily: 'YekanBakh-Bold',
                    }}>
                    {el}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Text
            style={{
              color: colors.primary.grayDark,
              fontFamily: 'Vazir-Thin',
              fontSize: 15,
              marginTop: 10,
              marginBottom: 5,
            }}>
            {` ${activeFilterName} در لیست ذیل قابل مشاهده است.`}
          </Text>
        </>
      )}
    </View>
  );
};

export default Index;
