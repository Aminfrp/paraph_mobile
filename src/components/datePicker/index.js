import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Dimensions} from 'react-native';
import styles from '../input/style';
import colors from '../../assets/theme/colors';
import Button from '../../components/button';
import PersianCalendarPicker from 'react-native-persian-calendar-picker';
import Modal from '../modal';
import {toPersianDigits} from '../../helpers/convertNumber';

const Index = props => {
  const {
    onChangeText,
    onClose,
    onSubmit,
    style,
    value,
    placeholder,
    label,
    icon,
    iconPosition,
    error,
    type = 'dark',
    size = 'lg',
    isBorder = true,
  } = props;
  const [focused, setFocused] = useState(false);

  const getFlexDirection = () => {
    if (icon && iconPosition) {
      if (iconPosition === 'left') {
        return 'row';
      }
      return 'row';
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

  const getDatePickerWidth = () => {
    const windowWidth = Dimensions.get('window').width;
    const width = (windowWidth * 94) / 100;

    return Math.floor(width);
  };

  const toggleFocused = () => setFocused(!focused);

  const onCloseHandler = () => {
    toggleFocused();
    onClose && onClose();
  };

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={focused}
        onClose={toggleFocused}>
        <PersianCalendarPicker
          onDateChange={date => onChangeText(date)}
          disabledDate={[1649221606]}
          previousTitle="قبلی"
          nextTitle="بعدی"
          selectedDayColor={colors.primary.success}
          selectedDayTextColor={colors.white}
          todayBackgroundColor={colors.secondary.grayDark}
          textStyle={{
            color: colors.accent,
            fontFamily: 'YekanBakh-Bold',
            paddingTop: 4,
            fontSize: 13,
          }}
          width={getDatePickerWidth()}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={{paddingHorizontal: 10, width: '40%'}}>
            <Button
              title="لغو"
              disabled={false}
              loading={false}
              onPress={onCloseHandler}
              type="primary-outline"
            />
          </View>
          <View style={{paddingHorizontal: 10, width: '40%'}}>
            <Button
              title="ذخیره"
              disabled={false}
              loading={false}
              onPress={toggleFocused}
              type="success"
            />
          </View>
        </View>
      </Modal>

      <View style={styles.inputContainer}>
        {label && (
          <Text
            style={[
              styles.label,
              {color: getLabelColor(), fontSize: getLabelFontSize()},
            ]}>
            {label}
          </Text>
        )}
        <TouchableOpacity
          style={[
            styles.wrapper,
            {
              flexDirection: getFlexDirection(),
              borderColor: isBorder ? getBorderColor() : 'white',
              alignItems: icon ? 'center' : 'baseline',
            },
          ]}
          onPress={toggleFocused}>
          <View style={{paddingHorizontal: 3}}>{icon && icon}</View>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              height: '100%',
              paddingHorizontal: 4.5,
            }}>
            <Text
              style={[
                style,
                styles.textInput,
                {
                  fontSize: 15,
                  fontWeight: 'bold',
                },
              ]}>
              {value !== 'Invalid date' && toPersianDigits(value)}
            </Text>
          </View>
        </TouchableOpacity>
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
    </View>
  );
};

export default Index;
