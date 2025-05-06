import Toast from 'react-native-toast-message';

export const showToast = (type, title, description) => {
  Toast.show({
    type: type,
    text1: title,
    text2: description,
  });
};

export const hideToast = () => Toast.hide();

export const onPressToast = () => Toast.onPress();
