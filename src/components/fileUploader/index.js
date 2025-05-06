import React, {useState} from 'react';
import {View, Text} from 'react-native';
import DocumentPicker, {
  isInProgress,
  types,
} from 'react-native-document-picker';
import FileUploaderView from '../fileUploadView';
import styles from './style';
import colors from '../../assets/theme/colors';

const Index = props => {
  const {
    onChange,
    label,
    error,
    type = 'dark',
    size = 'lg',
    defaultValue,
  } = props;
  const [value, setValue] = useState(defaultValue || null);

  const pick = async () => {
    try {
      const pickerResult = await DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
        copyTo: 'cachesDirectory',
        type: types.pdf,
      });
      await onChange(pickerResult);

      setValue(pickerResult);
    } catch (e) {
      handleError(e);
    }
  };

  const handleError = err => {
    if (DocumentPicker.isCancel(err)) {
      console.warn('cancelled');
      // User cancelled the picker, exit any dialogs or menus and move on
    } else if (isInProgress(err)) {
      console.warn(
        'multiple pickers were opened, only the last will be considered',
      );
    } else {
      throw err;
    }
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

  return (
    <View style={styles.wrapper}>
      <Text
        style={[
          styles.fileUploaderLabel,
          {color: getLabelColor(), fontSize: getLabelFontSize()},
        ]}>
        {label}
      </Text>
      <FileUploaderView value={value} onPress={pick} />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

export default Index;
