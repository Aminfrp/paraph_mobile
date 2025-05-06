import React from 'react';
import RbSheet from '../../../../components/rbSheet';
import {StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import Button from '../../../../components/button';
import colors from '../../../../assets/theme/colors';

const Index = props => {
  const {refRBSheet, disabled, visible, loading, onClose} = props;

  return (
    <RbSheet
      ref={refRBSheet}
      title="رمزگشایی و دانلود سند"
      disabled={disabled}
      height={200}
      visible={visible}
      onClose={onClose}>
      <View style={styles.modalWrapper}>
        <Text style={[styles.modalTitle]}>رمزگشایی و دانلود سند</Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingBottom: 20,
            justifyContent: 'center',
          }}>
          <Text style={styles.modalText}>دانلود، رمزگشایی و مشاهده سند</Text>
          {loading && (
            <ActivityIndicator size="large" color={colors.primary.success} />
          )}
        </View>

        <View style={styles.modalButtons}>
          <View style={styles.btnWrapper}>
            <Button
              title="بستن"
              type="success-outline"
              onPress={onClose}
              disabled={false}
              loading={false}
            />
          </View>
        </View>
      </View>
    </RbSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    width: '100%',
    backgroundColor: 'white',
    zIndex: 200,
  },
  modalWrapper: {
    width: '100%',
  },
  modalTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'YekanBakh-Bold',
    paddingBottom: 20,
  },
  modalText: {
    textAlign: 'center',
    fontSize: 15,
    color: '#6c6c6c',
    fontFamily: 'YekanBakh-Bold',
    paddingHorizontal: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnWrapper: {
    width: '50%',
    paddingHorizontal: 10,
  },
});

export default Index;
