import React, {useState, useEffect} from 'react';
import RbSheet from '../../../../components/rbSheet';
import {StyleSheet, Text, View} from 'react-native';
import Button from '../../../../components/button';
import colors from '../../../../assets/theme/colors';
import Input from '../../../../components/input';
import * as Toast from '../../../../components/toastNotification/utils';

const Index = props => {
  const {
    refRBSheet,
    disabled,
    rejectContractHandler,
    signContractHandler,
    cancelContractHandler,
    modalType,
    setModalType,
    signByRootCertificate,
  } = props;
  const [bottomModalData, setBottomModalData] = useState({});
  const [bottomModalButtons, setBottomModalButtons] = useState([
    {
      name: 'لغو',
      disabled: false,
      loading: false,
      onPress: () => refRBSheet.current.close(),
      type: 'dark',
    },
  ]);
  const [userMessage, setUserMessage] = useState('');
  const [withInput, setWithInput] = useState(false);
  const [show, setShow] = useState(false);
  const [rootCertificatePassword, setRootCertificatePassword] = useState('');
  const [rootCertificatePasswordError, setIsRootCertificatePasswordError] =
    useState(null);

  useEffect(() => {
    setButtons();
  }, [modalType]);

  const setButtons = () => {
    if (modalType !== '') {
      if (modalType === 'SIGNED') {
        onSignClicked();
        setModalType('');
        return;
      }
      if (modalType === 'NOT_SIGNED') {
        onNotSignedClicked();
        setModalType('');
        return;
      }
      if (modalType === 'REJECTED') {
        onRejectClicked();
        setModalType('');
      }
    }
  };

  const onSignClicked = () => {
    setWithInput(false);
    setBottomModalButtons([
      initialBottomModalButtons[0],
      initialBottomModalButtons[2],
      initialBottomModalButtons[3],
    ]);
    setBottomModalData({
      title: 'آیا از امضای سند خود اطمینان دارید؟',
      description:
        'امضای شما به منزله آگاهی از سند و همچنین شرایط استفاده از پلتفرم است.',
      type: 'success',
    });

    setShow(true);
  };

  const onNotSignedClicked = () => {
    setWithInput(true);
    setBottomModalButtons([
      initialBottomModalButtons[0],
      initialBottomModalButtons[1],
    ]);
    setBottomModalData({
      title: 'آیا از رد سند خود اطمینان دارید؟',
      description:
        'رد شما به منزله آگاهی از سند و همچنین شرایط استفاده از پلتفرم است.',
      type: 'danger',
    });

    setShow(true);
  };

  const onRejectClicked = () => {
    setWithInput(true);
    setBottomModalButtons([
      initialBottomModalButtons[0],
      initialBottomModalButtons[3],
    ]);
    setBottomModalData({
      title: 'آیا از لغو سند خود اطمینان دارید؟',
      description:
        'لغو شما به منزله آگاهی از سند و همچنین شرایط استفاده از پلتفرم است.',
      type: 'danger',
    });

    setShow(true);
  };

  const onSignByRootCertificateClicked = async value => {
    if (value === '') {
      Toast.showToast('danger', 'امضا', 'رمز گواهی خود را وارد نمایید');
    } else {
      await signByRootCertificate(value);
      setShow(false);
    }
  };

  const initialBottomModalButtons = [
    {
      name: 'لغو',
      disabled: false,
      loading: false,
      onPress: () => setShow(false),
      type: 'dark-outline',
    },
    {
      name: 'رد',
      disabled: false,
      loading: false,
      onPress: async message => {
        await rejectContractHandler(message);
        setShow(false);
      },
      type: 'danger',
    },
    {
      name: 'امضا',
      disabled: false,
      loading: false,
      onPress: async message => {
        await signContractHandler();
        setShow(false);
      },
      type: 'success',
    },
    {
      name: 'امضا با گواهی',
      disabled: false,
      loading: false,
      onPress: async message => {
        await onSignByRootCertificateClicked();
      },
      type: 'warning-outline',
      isRootCertificate: true,
    },
    {
      name: 'لغو سند',
      disabled: false,
      loading: false,
      onPress: async message => {
        await cancelContractHandler(message);
        setShow(false);
      },
      type: 'danger',
    },
  ];

  const getTitleColor = type => {
    switch (type) {
      case 'success':
        return colors.primary.success;
      case 'danger':
        return colors.primary.danger;

      default:
        return colors.accent;
    }
  };

  const onClose = () => {
    setShow(false);
    setUserMessage('');
  };

  return (
    <>
      {withInput ? (
        <RbSheet
          ref={refRBSheet}
          title={bottomModalData?.title}
          description={bottomModalData?.description}
          type={bottomModalData?.type}
          disabled={disabled}
          height={300}
          visible={show}
          onClose={onClose}>
          <View style={styles.modalWrapper}>
            <Text
              style={[
                styles.modalTitle,
                {
                  color: getTitleColor(bottomModalData?.type),
                },
              ]}>
              {bottomModalData?.title}
            </Text>

            <Text style={styles.modalText}>{bottomModalData?.description}</Text>
            {bottomModalData?.type !== 'success' && (
              <View style={styles.inputWrapper}>
                <Input
                  onChangeText={value => setUserMessage(value)}
                  placeholder="توضیحات"
                  // label="توضیحات"
                  error={null}
                  style={{
                    textAlign: 'right',
                    width: '100%',
                  }}
                />
              </View>
            )}
            <View style={styles.modalButtons}>
              {bottomModalButtons &&
                bottomModalButtons.length > 0 &&
                bottomModalButtons.map(item => {
                  return (
                    <View style={styles.btnWrapper} key={item.name}>
                      <Button
                        key={item.name}
                        title={item.name}
                        type={item.type}
                        onPress={() => item.onPress(userMessage)}
                        disabled={disabled}
                        loading={item.loading}
                      />
                    </View>
                  );
                })}
            </View>
          </View>
        </RbSheet>
      ) : (
        <RbSheet
          ref={refRBSheet}
          title={bottomModalData?.title}
          description={bottomModalData?.description}
          type={bottomModalData?.type}
          disabled={disabled}
          // height={220}
          height={300}
          visible={show}
          onClose={onClose}

          // height={bottomModalData?.type !== 'success' ? 300 : 240}>
        >
          <View style={styles.modalWrapper}>
            <Text
              style={[
                styles.modalTitle,
                {
                  color: getTitleColor(bottomModalData?.type),
                },
              ]}>
              {bottomModalData?.title}
            </Text>

            <Text style={styles.modalText}>{bottomModalData?.description}</Text>

            <View style={[styles.inputWrapper, {paddingHorizontal: 30}]}>
              <Input
                onChangeText={value => setRootCertificatePassword(value)}
                placeholder="رمز گواهی"
                // label="توضیحات"
                error={rootCertificatePasswordError}
                style={{
                  textAlign: 'right',
                  width: '100%',
                }}
              />
            </View>

            <View style={styles.modalButtons}>
              {bottomModalButtons &&
                bottomModalButtons.length > 0 &&
                bottomModalButtons.map(item => {
                  return (
                    <View
                      style={{...styles.btnWrapper, width: '30%', padding: 2}}
                      key={item.name}>
                      <Button
                        key={item.name}
                        title={item.name}
                        type={item.type}
                        onPress={
                          item.isRootCertificate
                            ? () =>
                                onSignByRootCertificateClicked(
                                  rootCertificatePassword,
                                )
                            : item.onPress
                        }
                        disabled={disabled}
                        loading={item.loading}
                      />
                    </View>
                  );
                })}
            </View>
          </View>
        </RbSheet>
      )}
    </>
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
    fontSize: 18,
    color: colors.accent,
    fontFamily: 'YekanBakh-Bold',
    paddingBottom: 20,
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
  inputWrapper: {
    paddingHorizontal: 10,
  },
});

export default Index;
