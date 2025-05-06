import React from 'react';
import {ScrollView, View, StatusBar} from 'react-native';
import styles from './style';

type PropsModel = {
  style: {};
  children: React.ReactNode;
  notScrollView?: boolean;
};

const Index: React.FC<PropsModel> = props => {
  const {style, children, notScrollView} = props;
  return (
    <>
      <StatusBar
        backgroundColor="white"
        // color="#000000"
        // hidden={true}
        barStyle="dark-content"
        // statusBarStyle="dark-content"
      />
      {notScrollView ? (
        <View style={[styles.wrapper, style]}>{children}</View>
      ) : (
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={[styles.wrapper, style]}>{children}</View>
        </ScrollView>
      )}
    </>
  );
};

export default Index;
