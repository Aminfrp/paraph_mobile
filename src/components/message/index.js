import React, {useState} from 'react';
import {View, Text, ActivityIndicator, TouchableOpacity} from 'react-native';
import styles from './style';
import colors from '../../assets/theme/colors';

const Index = props => {
  const {message, retry, retryFn, type, onDismiss, show} = props;

  const getColor = () => {
    switch (type) {
      case 'danger':
        return colors.primary.danger;
      case 'primary':
        return colors.primary.purple;
      case 'success':
        return colors.primary.success;
      case 'secondary':
        return colors.primary.gray;
      case 'info':
        return colors.primary.info;
      default:
        return colors.primary.purple;
    }
  };

  return (
    <>
      {show && (
        <TouchableOpacity style={[styles.wrapper, {borderColor: getColor()}]}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            {message && (
              <Text style={[styles.textMessage, {color: getColor()}]}>
                {message}
              </Text>
            )}
            {retry && !typeof onDismiss === 'function' && (
              <TouchableOpacity style={[]} onPress={retryFn}>
                <Text style={{color: getColor()}}>{retry}</Text>
              </TouchableOpacity>
            )}
            {typeof onDismiss === 'function' && (
              <TouchableOpacity
                style={[]}
                onPress={() => {
                  onDismiss();
                }}>
                <Text style={{color: getColor()}}>X</Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      )}
    </>
  );
};

export default Index;
