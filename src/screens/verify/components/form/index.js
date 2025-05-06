import React, {useRef} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {OtpInput} from 'react-native-otp-entry';
import SubmitButtons from '../submitButtons';
import CountDownTimer from '../../../../components/countDownTimer';
import styles from '../../style';
import colors from '../../../../assets/theme/colors';
import useOtpSmsListener from '../../../../hooks/useOtpSmsListener';

const clockAccentIcon = require('../../../../assets/img/clock_accent_icon.png');
const clockIcon = require('../../../../assets/img/clock_icon.png');

const Index = props => {
  const {
    pin,
    setPin,
    disabled,
    onResendCode,
    onSubmit,
    pinCount,
    expiresIn,
    disableTimer,
    loading,
    editMobileNumber,
    isTimeEnded,
    onResendCodeLoading,
    error,
  } = props;
  const ref = useRef(null);

  const smsReceivedCallback = code => {
    ref?.current?.setValue(code);
    onSubmit(code);
  };

  // todo: زمانی که کاربر در این صفحه باشد اگر پیامک دیگیری متفاوت از پیامک کد تایید بیاید باعث میشود اپ کرش کند...
  // const otpListener = useOtpSmsListener(pinCount, smsReceivedCallback);

  const getTextColor = () => {
    if (disabled) {
      return colors.black;
    } else {
      return colors.primary.success;
    }
  };

  return (
    <View style={styles.form}>
      <Text style={[styles.textLabel, {color: getTextColor()}]}>
        کد دریافت شده را وارد نمایید.
      </Text>

      <OtpInput
        ref={ref}
        numberOfDigits={pinCount || 6}
        focusColor="green"
        focusStickBlinkingDuration={500}
        onTextChange={setPin}
        // onFilled={onSubmit}
        theme={{
          containerStyle: styles.otpInputView,
          pinCodeContainerStyle: styles.pinCodeContainerStyle,
          pinCodeTextStyle: styles.pinCodeTextStyle,
          focusedPinCodeContainerStyle: styles.focusedPinCodeContainerStyle,
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          paddingHorizontal: 21,
          margin: 0,
        }}>
        {error && <Text style={styles.error}>{error}!</Text>}
      </View>

      <TouchableOpacity onPress={editMobileNumber}>
        <Text style={[styles.linkBtn, {color: getTextColor()}]}>
          ویرایش شماره تلفن
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {}}>
        {!isTimeEnded && (
          <View style={styles.timerWrapper}>
            <CountDownTimer
              initialMinute={0}
              initialSeconds={expiresIn || 120}
              disableTimer={disableTimer}
              timerDigitStyle={[
                styles.timerDigitStyle,
                {color: disabled ? colors.accent : colors.primary.success},
              ]}
            />
            {disabled ? (
              <Image source={clockAccentIcon} />
            ) : (
              <Image source={clockIcon} />
            )}
          </View>
        )}
      </TouchableOpacity>
      <SubmitButtons
        disabled={disabled}
        onResendCode={onResendCode}
        onSubmit={onSubmit}
        loading={loading}
        onResendCodeLoading={onResendCodeLoading}
      />
    </View>
  );
};

export default Index;
