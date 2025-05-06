import React from 'react';
import {View, Text, ActivityIndicator, TouchableOpacity} from 'react-native';
// @ts-ignore
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './style';
import colors from '../../assets/theme/colors';

type PropsModel = {
  title?: string;
  disabled?: boolean;
  loading?: boolean;
  onPress: () => void;
  type: string;
  icon?: React.FC;
};

const Index: React.FC<PropsModel> = props => {
  const {title, disabled, loading, onPress, type, icon} = props;

  const getBgColor = (): string => {
    // if (disabled) {
    //   return colors.gray;
    // }
    switch (type) {
      case 'danger':
        return colors.primary.danger;
      case 'primary':
        return colors.primary.purple;
      case 'success':
        return colors.primary.success;
      case 'secondary':
        return colors.secondary.paleGray;
      case 'dark':
        return colors.accent;
      case 'gray':
        return colors.gray;
      case 'warning':
        return colors.warning;
      case 'white':
        return colors.white;
      case 'white-outline':
        return colors.white;
      case 'white-transparent':
        return colors.white;
      default:
        return 'none';
    }
  };

  const getBorderColor = () => {
    if (disabled) {
      return colors.gray;
    }
    switch (type) {
      case 'danger-outline':
        return colors.primary.danger;
      case 'primary-outline':
        return colors.primary.purple;
      case 'success-outline':
        return colors.primary.success;
      case 'secondary-outline':
        return colors.secondary.grayDark;
      case 'dark-outline':
        return colors.accent;
      case 'gray-outline':
        return colors.gray;
      case 'warning-outline':
        return colors.warning;
      case 'white-outline':
        return colors.gray;
      case 'transparent-outline':
        return colors.white;

      default:
        return colors.primary.purple;
    }
  };

  const getColor = (): string => {
    switch (type) {
      case 'danger-outline':
        return colors.primary.danger;
      case 'primary-outline':
        return colors.primary.purple;
      case 'success-outline':
        return colors.primary.success;
      case 'secondary-outline':
        return colors.secondary.paleGray;
      case 'dark-outline':
        return colors.accent;
      case 'gray-outline':
        return colors.gray;
      case 'warning-outline':
        return colors.warning;
      case 'white-outline':
        return colors.black;
      case 'transparent-outline':
        return colors.black;
      default:
        return colors.primary.purple;
    }
  };

  const getActivityIndicatorColor = (): string => {
    switch (type) {
      case 'danger':
        return colors.white;
      case 'primary':
        return colors.white;
      case 'success':
        return colors.white;
      case 'secondary':
        return colors.white;
      case 'dark':
        return colors.white;
      case 'gray':
        return colors.white;
      case 'danger-outline':
        return colors.primary.danger;
      case 'primary-outline':
        return colors.primary.purple;
      case 'success-outline':
        return colors.primary.success;
      case 'secondary-outline':
        return colors.secondary.paleGray;
      case 'dark-outline':
        return colors.accent;
      case 'gray-outline':
        return colors.gray;
      default:
        return colors.gray;
    }
  };

  return (
    <TouchableOpacity
      disabled={disabled}
      style={[
        styles.buttonContainer,
        {
          backgroundColor: getBgColor(),
          borderColor: type.includes('outline')
            ? getBorderColor()
            : getBgColor(),
        },
      ]}
      onPress={onPress}>
      <View style={[styles.loaderSection]}>
        {loading ? (
          <ActivityIndicator color={getActivityIndicatorColor()} />
        ) : (
          <>
            {title && (
              <Text
                style={{
                  paddingLeft: loading ? 5 : 0,
                  fontSize: 13,
                  fontFamily: 'Vazir-Medium',
                  color: type.includes('outline') ? getColor() : colors.white,
                }}>
                {title}
              </Text>
            )}
            {icon && (
              <Icon
                name={icon}
                size={15}
                color={type.includes('outline') ? getColor() : colors.white}
                style={styles.icon}
              />
            )}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default Index;
