import {View, Text} from 'react-native';
import React from 'react';

const Index = props => {
  const {title} = props;

  if (!title) {
    return (
      <View
        style={{
          borderColor: '#c8c8c8',
          borderBottomWidth: 1,
          borderStyle: 'solid',
          width: '100%',
          marginVertical: 20,
        }}
      />
    );
  }

  return (
    <View
      style={{
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 'auto',
        marginBottom: 18,
      }}>
      <View style={{width: '25%'}}>
        <Text
          style={{
            fontFamily: 'YekanBakh-Bold',
            fontSize: 12,
            color: '#3d4040',
          }}>
          {title}
        </Text>
      </View>
      <View
        style={{
          borderColor: '#e70e0e',
          borderBottomWidth: 1,
          borderStyle: 'solid',
          width: '75%',
        }}
      />
    </View>
  );
};

export default Index;
