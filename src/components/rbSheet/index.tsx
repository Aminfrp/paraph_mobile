import React, {useEffect} from 'react';
import {View, StatusBar} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import styles from './style';

export default React.forwardRef((props: any, ref: any) => {
  const {
    disabled,
    closeOnDragDown = true,
    closeOnPressBack = true,
    closeOnPressMask = true,
    statusBarBgColor = '#7F7F7F',
    height = 220,
    children,
    visible,
    onHide,
    onClose,
  } = props;

  useEffect(() => {
    if (visible) {
      ref?.current.open();
    } else {
      ref?.current.close();
      onHide && onHide();
    }
  }, [ref, visible, height]);

  return (
    <>
      {/*// @ts-ignore*/}
      <RBSheet
        ref={ref}
        height={height}
        openDuration={0}
        closeOnPressBack={closeOnPressBack}
        closeOnDragDown={closeOnDragDown}
        closeOnPressMask={closeOnPressMask}
        animationType="slide"
        customStyles={{
          container: styles.container,
        }}
        onClose={() => onClose && onClose()}>
        <StatusBar backgroundColor={statusBarBgColor} animated />
        <View style={styles.modalWrapper}>{children}</View>
      </RBSheet>
    </>
  );
});
