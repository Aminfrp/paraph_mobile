import {YellowBox} from 'react-native';
import moment from 'moment-jalaali';
import fa from 'moment/src/locale/fa';

const secondsToHMS = seconds => {
  const second = ~~seconds % 60;
  const minute = ~~((seconds % 3600) / 60);
  const hour = ~~(seconds / 3600);

  return {second, minute, hour};
};

const getPersianDate = timestamp => {
  YellowBox.ignoreWarnings(['']);

  moment.locale('fa', fa);

  const date = moment(new Date(timestamp)).format('jYYYY/jM/jD');
  const parsed = date.split('/');

  const dayName = moment(new Date(timestamp)).format('dddd');
  const monthName = moment(new Date(timestamp)).format('MMMM');

  const persianDayName = getPersianDayName(dayName);
  const persianMontName = getPersianMontName(parsed[1]);

  return {
    date,
    dayName,
    monthName,
    persianDayName,
    persianMontName,
    year: parsed[0],
    month: parsed[1],
    day: parsed[2],
  };
};

const getPersianDayName = day => {
  const map = {
    Sunday: 'یکشنبه',
    Monday: 'دوشنبه',
    Tuesday: 'سه شنبه',
    Wednesday: 'چهارشنبه',
    Thursday: 'پنج شنبه',
    Friday: 'جمعه',
    Saturday: 'شنبه',
  };

  return map[day];
};

const getPersianMontName = month => {
  const map = {
    '۱': 'فروردین',
    '۲': 'اردیبهشت',
    '۳': 'خرداد',
    '۴': 'تیر',
    '۵': 'مرداد',
    '۶': 'شهریور',
    '۷': 'مهر',
    '۸': 'آبان',
    '۹': 'آذر',
    '۱۰': 'دی',
    '۱۱': 'بهمن',
    '۱۲': 'اسفند',
  };

  return map[month];
};

const getDiffTimestampBySecond = second => {
  const date = new Date();
  const now = new Date(date.getTime());
  const nowTimestamp = date.getTime();
  date.setSeconds(second);
  const to = new Date(date.getTime());
  const toTimestamp = date.getTime();

  return {now, to, nowTimestamp, toTimestamp};
};

const getDiffTimestampBySecond2 = (timestamp, second) => {
  const date = new Date(timestamp);

  date.setSeconds(second);

  return new Date(date).getTime();
};

const getDateByDays = days => {
  const now = new Date();
  now.setDate(now.getDate() + days);

  return moment(new Date(now));
};

const getDateByDaysCountAfterNow = days => {
  const now = new Date();
  now.setDate(now.getDate() + days);

  return moment(new Date(now));
};

const getDateByDaysCountAfterSpecialDate = (days, specialDateTimestamp) => {
  const time = new Date(specialDateTimestamp);
  time.setDate(time.getDate() + days);

  return moment(new Date(time));
};

export {
  secondsToHMS,
  getPersianDate,
  getDiffTimestampBySecond,
  getDiffTimestampBySecond2,
  getDateByDaysCountAfterNow,
  getDateByDaysCountAfterSpecialDate,
};
