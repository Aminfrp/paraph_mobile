import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Switch,
  Image,
  TouchableOpacity,
} from 'react-native';
import styles from './style';
import colors from '../../assets/theme/colors';

const Index = props => {
  const {
    onChangeText,
    style,
    value,
    placeholder,
    label,
    icon,
    iconPosition,
    error,
    type = 'dark',
    size = 'lg',
    bgColor = colors.white,
    isBorder = true,
    description,
    multiline = false,
    numberOfLines = 1,
    switchLabel,
    switchOnChange,
    switchValue = false,
    textHidden = false,
  } = props;
  const [focused, setFocused] = useState(false);
  const [isSecureTextEntry, setIsSecureTextEntry] = useState(textHidden);

  const getFlexDirection = () => {
    if (icon && iconPosition) {
      if (iconPosition === 'left') {
        return 'row';
      }
      return 'row';
    }
    return 'row';
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

  const onDismiss = () => Keyboard.dismiss();

  const getLabelColor = () => {
    const map = {
      secondary: colors.secondary.grayDark,
      dark: colors.accent,
    };

    return map[type];
  };

  const getLabelFontSize = () => {
    const map = {
      lg: 22,
      md: 20,
      sm: 18,
    };

    return map[size];
  };

  const toggleSwitch = () => {
    switchOnChange(!switchValue);
  };

  const onToggleSecureText = () => {
    setIsSecureTextEntry(!isSecureTextEntry);
  };

  return (
    // <KeyboardAvoidingView
    //   behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    //   style={styles.container}>
    <TouchableWithoutFeedback onPress={onDismiss} accessible={false}>
      <View style={styles.inputContainer}>
        <View style={styles.labelWrapper}>
          {label && (
            <Text
              style={[
                styles.label,
                {color: getLabelColor(), fontSize: getLabelFontSize()},
              ]}>
              {label}
            </Text>
          )}
          {switchLabel && switchOnChange && (
            <View style={styles.switchWrapper}>
              {switchLabel && (
                <Text style={[styles.switchLabel]}>{switchLabel}</Text>
              )}
              <Switch
                trackColor={{false: '#e1e1e1', true: '#1D8668'}}
                thumbColor={switchValue ? '#ffffff' : '#ffffff'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={switchValue}
              />
            </View>
          )}
        </View>

        <View
          style={[
            styles.wrapper,
            {
              flexDirection: getFlexDirection(),
              borderColor: isBorder ? getBorderColor() : 'white',
              alignItems: textHidden ? 'center' : icon ? 'center' : 'baseline',
              justifyContent: 'space-between',
            },
          ]}>
          {textHidden ? (
            <TouchableOpacity onPress={onToggleSecureText}>
              <Image
                source={require('../../assets/img/png/eye.png')}
                style={styles.eyeImg}
              />
            </TouchableOpacity>
          ) : (
            <>{icon && icon}</>
          )}
          <TextInput
            secureTextEntry={isSecureTextEntry}
            style={[style, styles.textInput]}
            placeholder={placeholder}
            onChangeText={onChangeText}
            defaultValue={value}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            multiline={multiline}
            numberOfLines={numberOfLines}
            {...props}
          />
        </View>
        {description && <Text style={styles.description}>{description}</Text>}
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
    </TouchableWithoutFeedback>
    // </KeyboardAvoidingView>
  );
};

export default Index;
