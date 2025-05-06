import React from 'react';
import {Image, Text, TouchableOpacity, View, StyleSheet} from 'react-native';

type PropsModel = {
  text: string;
  onPress: () => void;
};

const Index: React.FC<PropsModel> = props => {
  const {text, onPress} = props;
  return (
    <View style={styles.savedFileAddressHintWrapper}>
      <Text style={styles.savedFileAddressHintText}>{text}</Text>
      <TouchableOpacity onPress={onPress}>
        <Image
          source={require('../../assets/img/png/close-icon.png')}
          style={{width: 25, height: 25}}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  savedFileAddressHintWrapper: {
    height: 60,
    width: '100%',
    backgroundColor: '#FFFBE6',
    position: 'absolute',
    zIndex: 100,
    bottom: 0,
    left: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
  },
  savedFileAddressHintText: {
    fontFamily: 'YekanBakh-Bold',
    fontSize: 14,
    color: '#00091A',
    width: '90%',
  },
});

export default Index;
