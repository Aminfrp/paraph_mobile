import React from 'react';
import {View, Text, TouchableOpacity, Linking, Alert} from 'react-native';
import colors from '../../../../assets/theme/colors';

const Index: React.FC = () => {
  const loadLanding = () => {
    Linking.openURL('https://paraph.me/').catch(err =>
      console.error("Couldn't load page", err),
    );
  };

  const loadTelegram = (id: string) => {
    Linking.openURL(`https://t.me/${id}/`).catch(err =>
      console.error("Couldn't load page", err),
    );
  };

  const loadInstagram = () => {
    Alert.alert(
      'اینستاگرام',
      'درحال حاضر غیرفعال است',
      [
        {
          text: 'بستن',
          onPress: () => null,
        },
      ],
      {
        cancelable: false,
      },
    );
  };

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          // marginTop: 10,
        }}>
        <View
          style={{
            width: '30%',
            height: 0.5,
            backgroundColor: colors.primary.gray,
          }}
        />
        <Text
          style={{
            fontFamily: 'YekanBakh-Bold',
            color: colors.primary.gray,
            fontSize: 15,
          }}>
          وبسایت پاراف
        </Text>
        <View
          style={{
            width: '30%',
            height: 0.5,
            backgroundColor: colors.primary.gray,
          }}
        />
      </View>
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={loadLanding}>
          <Text
            style={{
              color: colors.primary.grayDark,
              fontSize: 15,
              // paddingVertical: 10,
            }}>
            www.paraph.me
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          borderTopWidth: 1,
          borderColor: colors.secondary.gray,
          borderStyle: 'solid',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 10,
        }}>
        <Text
          style={{
            color: colors.primary.grayDark,
            fontSize: 15,
            paddingVertical: 10,
            fontFamily: 'YekanBakh-Bold',
          }}>
          توسعه یافته در پادیلو
        </Text>
      </View>
    </View>
  );
};

export default Index;
