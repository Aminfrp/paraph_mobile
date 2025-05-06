import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from './style';
import colors from '../../assets/theme/colors';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type PropsModel = {
  onChange: () => void;
  value: boolean;
  type: string;
  label?: string;
  error: string | null;
  disabled?: boolean;
};

const Index: React.FC<PropsModel> = props => {
  const {onChange, value, type, label, error, disabled} = props;
  const [focused, setFocused] = useState(false);

  const getBgColor = () => {
    if (disabled) {
      return colors.gray;
    }
    switch (type) {
      case 'danger':
        return colors.primary.danger;
      case 'primary':
        return colors.primary.purple;
      case 'success':
        return colors.primary.success;
      case 'secondary':
        return colors.secondary;
      case 'dark':
        return colors.accent;
      case 'gray':
        return colors.gray;
      default:
        return 'none';
    }
  };

  const getBorderColor = () => {
    if (focused) {
      return colors.secondary.success;
    }
    if (error) {
      return colors.primary.danger;
    }
    return colors.gray;
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity onPress={() => (disabled ? null : onChange())}>
        <View style={styles.inputContainer}>
          <View
            style={[styles.checkboxContainer, {borderColor: getBorderColor()}]}>
            {value && (
              <MaterialCommunityIcons
                name="check"
                size={20}
                color={getBgColor()}
              />
            )}
          </View>
          {label && <Text style={styles.label}>{label}</Text>}
        </View>
      </TouchableOpacity>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

export default Index;
