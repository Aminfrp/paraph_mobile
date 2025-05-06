import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {toPersianDigits} from '../../helpers/convertNumber';
import {secondsToHMS} from '../../helpers/date';

const Index = props => {
  const {
    initialMinute = 0,
    initialSeconds = 0,
    disableTimer,
    timerDigitStyle,
    timerViewStyle,
  } = props;
  const [minutes, setMinutes] = useState(initialMinute);
  const [seconds, setSeconds] = useState(initialSeconds);
  const [renderCounter, setRenderCounter] = useState(false);

  useEffect(() => {
    const initTime = secondsToHMS(initialSeconds);
    setMinutes(initTime.minute);
    setSeconds(initTime.second);
    setRenderCounter(true);
  }, [initialSeconds]);

  useEffect(() => {
    if (renderCounter) {
      let myInterval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        }
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(myInterval);
            disableTimer();
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        }
      }, 1000);

      return () => {
        clearInterval(myInterval);
      };
    }
  });

  return (
    <>
      {minutes === 0 && seconds === 0 ? (
        <Text style={timerDigitStyle ? timerDigitStyle : {}}>
          {minutes === 0 && seconds === 0 && toPersianDigits('00:00')}
        </Text>
      ) : (
        <View style={timerViewStyle ? timerViewStyle : {}}>
          <Text style={timerDigitStyle ? timerDigitStyle : {}}>
            {minutes < 1
              ? `${toPersianDigits('00')}`
              : toPersianDigits(minutes)}
            :
            {seconds < 10
              ? seconds === 0
                ? `${toPersianDigits('00')}`
                : `${toPersianDigits(0)}${toPersianDigits(seconds)}`
              : toPersianDigits(seconds)}
          </Text>
        </View>
      )}
    </>
  );
};

export default Index;
