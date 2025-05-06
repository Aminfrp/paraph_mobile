import React from 'react';
import {View, Text, StatusBar} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import Button from '../button';
import styles from './style';
import colors from '../../assets/theme/colors';

export default React.forwardRef(
  (
    {
      buttons,
      title,
      description,
      type,
      disabled,
      closeOnDragDown = true,
      closeOnPressBack = true,
      closeOnPressMask = true,
      titleStyle,
      descriptionStyle,
      secondTitle,
    },
    ref,
  ) => {
    const getTitleColor = () => {
      switch (type) {
        case 'success':
          return colors.primary.success;
        case 'danger':
          return colors.primary.danger;

        default:
          return colors.accent;
      }
    };

    return (
      <>
        <RBSheet
          ref={ref}
          height={220}
          openDuration={0}
          closeOnPressBack={closeOnPressBack}
          closeOnDragDown={closeOnDragDown}
          closeOnPressMask={closeOnPressMask}
          animationType="slide"
          customStyles={{
            container: styles.container,
          }}>
          <StatusBar backgroundColor="#7F7F7F" animated />
          <View style={styles.modalWrapper}>
            <Text
              style={[
                styles.modalTitle,
                {
                  ...titleStyle,
                  color: getTitleColor(),
                },
              ]}>
              {title}
            </Text>

            <Text style={[styles.modalText, {...descriptionStyle}]}>
              {description}
            </Text>
            <View style={styles.modalButtons}>
              {buttons &&
                buttons.length > 0 &&
                buttons.map(item => {
                  return (
                    <View style={styles.btnWrapper} key={item.name}>
                      <Button
                        key={item.name}
                        title={item.name}
                        type={item.type}
                        onPress={item.onPress}
                        disabled={disabled}
                        loading={item.loading}
                      />
                    </View>
                  );
                })}
            </View>
          </View>
        </RBSheet>
      </>
    );
  },
);
