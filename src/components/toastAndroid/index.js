import {ToastAndroid} from 'react-native';

const toastAndroid = (message, duration, gravity, xOffset, yOffset) => {
  let dur = null;
  let position = null;

  switch (duration) {
    case 'short':
      dur = ToastAndroid.SHORT;
      break;
    case 'long':
      dur = ToastAndroid.LONG;
      break;
    default:
      dur = ToastAndroid.SHORT;
  }

  switch (gravity) {
    case 'top':
      position = ToastAndroid.TOP;
      break;
    case 'bottom':
      position = ToastAndroid.BOTTOM;
      break;
    case 'center':
      position = ToastAndroid.CENTER;
      break;
    default:
      position = ToastAndroid.CENTER;
  }

  return ToastAndroid.showWithGravityAndOffset(
    message,
    dur,
    position,
    (xOffset = 25),
    (yOffset = 50),
  );
};

export default toastAndroid;
