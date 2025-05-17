import React, {useEffect} from 'react';
import {View} from 'react-native';
import * as RNFS from 'react-native-fs';
import styles from '../../style';
import Button from '../../../../components/button';
import {getDownloadFilePath} from '../../../../modules/document/constant';

const Index = props => {
  const {
    data,
    buttonStateType,
    downloadContractHandler,
    downloadContractLoading,
    contractDecryptHandler,
    getSecretKeyBusinessLoading,
    setButtonStateType,
    fileNamePodSpace,
    downloadAndSeeContract,
    decryptAndSeeContract,
    isContractInitiator,
    cancelContractHandler,
    cancelContractHandlerLoading,
    seeContractLoading,
    downloadReceiptHandler,
    downloadReceiptLoading,
    setModalType,
    downloadError,
    onSign,
    onReject,
    onCancellation,
    code,
    isDocumentExpired,
    openDocument,
    openDocumentLoading,
    signLoading,
  } = props;
  const [isExistFile, setIsExistFile] = React.useState(false);
  const [isRejected, setIsRejected] = React.useState(false);
  const [showRedirect, setShowRedirect] = React.useState(false);

  useEffect(() => {
    memoryChecker();
  }, [data, isExistFile]);

  const memoryChecker = async () => {
    const existFile = await checkFileInMemory(fileNamePodSpace);

    if (existFile) {
      const SortedContractStateByDate = data?.sort(
        (a, b) => b.submitTime - a.submitTime,
      );
      if (SortedContractStateByDate) {
        SortedContractStateByDate.forEach(i => {
          if (
            i.contractStateType === 'SUBMITTED' &&
            SortedContractStateByDate[0].contractStateType === 'SUBMITTED'
          ) {
            setButtonStateType(1);
          }
          if (
            i.contractStateType === 'DOWNLOADED' &&
            SortedContractStateByDate[0].contractStateType === 'DOWNLOADED'
          ) {
            setButtonStateType(2);
          }
          if (
            i.contractStateType === 'OPENED' &&
            SortedContractStateByDate[0].contractStateType === 'OPENED'
          ) {
            setButtonStateType(3);
          }
          if (
            i.contractStateType === 'SIGNED' &&
            SortedContractStateByDate[0].contractStateType === 'SIGNED'
          ) {
            setButtonStateType(4);
            setShowRedirect(true);
          }
          if (
            i.contractStateType === 'NOT_SIGNED' &&
            SortedContractStateByDate[0].contractStateType === 'NOT_SIGNED'
          ) {
            setButtonStateType(4);
            setShowRedirect(true);
          }
          if (
            i.contractStateType === 'REJECTED' &&
            SortedContractStateByDate[0].contractStateType === 'REJECTED'
          ) {
            setButtonStateType(4);
            setIsRejected(true);
          }
        });
      }
    } else {
      setButtonStateType(1);
    }
  };

  useEffect(() => {
    fileExistChecker();

    return () => {};
  });

  const fileExistChecker = async () => {
    const existFile = await checkFileInMemory(fileNamePodSpace);
    await setIsExistFile(existFile);
  };

  const checkFileInMemory = async fileName => {
    const encryptedFileName = fileName?.id;

    if (encryptedFileName) {
      return await RNFS.exists(
        getDownloadFilePath(`${encryptedFileName}.encrypted`),
      );
    }
    return false;
  };

  const signOrRejectButtons = [
    {
      title: 'رد',
      type: 'danger',
      loading: false,
      // onPress: () => setModalType('NOT_SIGNED'),
      onPress: () => onReject(),
    },
    {
      title: 'امضا',
      type: 'success',
      // onPress: () => setModalType('SIGNED'),
      loading: signLoading,
      onPress: () => onSign(),
    },
  ];

  return (
    <>
      <View style={styles.buttonsGroup}>
        {downloadError && (
          <View style={styles.btnWrapper}>
            <Button
              title="دانلود و مشاهده سند"
              type="success"
              onPress={openDocument}
              icon="download"
              loading={openDocumentLoading}
              disabled={openDocumentLoading}
            />
          </View>
        )}
      </View>
      {!downloadError && (
        <>
          <View>
            {buttonStateType === 3 && (
              <View style={styles.buttonsGroup}>
                <View style={styles.btnWrapper}>
                  <Button
                    title="مشاهده سند"
                    type="primary-outline"
                    onPress={contractDecryptHandler}
                    loading={seeContractLoading}
                    disabled={seeContractLoading}
                  />
                </View>
              </View>
            )}
          </View>
          <View style={styles.buttonsGroup}>
            {buttonStateType === 1 && (
              <View style={styles.btnWrapper}>
                <Button
                  title="دانلود و مشاهده سند"
                  type="success"
                  onPress={openDocument}
                  icon="download"
                  loading={openDocumentLoading}
                  disabled={openDocumentLoading}
                />
              </View>
            )}

            {!isDocumentExpired && (
              <>
                {buttonStateType === 3 && !isContractInitiator && (
                  <>
                    {signOrRejectButtons.map(item => (
                      <View style={styles.btnWrapper}>
                        <Button
                          title={item.title}
                          type={item.type}
                          onPress={item.onPress}
                          loading={item.loading}
                          disabled={isDocumentExpired || signLoading}
                        />
                      </View>
                    ))}
                  </>
                )}
              </>
            )}

            {buttonStateType === 3 && isContractInitiator && (
              <View style={styles.btnWrapper}>
                <Button
                  title="لغو سند"
                  type="danger"
                  onPress={onCancellation}
                  loading={cancelContractHandlerLoading}
                  disabled={cancelContractHandlerLoading}
                />
              </View>
            )}

            {buttonStateType === 4 && (
              <>
                {!isExistFile && (
                  <View style={styles.btnWrapper}>
                    <Button
                      title="دانلود سند"
                      type="success"
                      onPress={openDocument}
                      loading={downloadContractLoading}
                      disabled={downloadContractLoading}
                    />
                  </View>
                )}

                {isExistFile && (
                  <View style={styles.btnWrapper}>
                    <Button
                      title="مشاهده سند"
                      type="primary"
                      onPress={decryptAndSeeContract}
                      loading={getSecretKeyBusinessLoading}
                      disabled={getSecretKeyBusinessLoading}
                    />
                  </View>
                )}

                <View style={styles.btnWrapper}>
                  <Button
                    title="مشاهده رسید"
                    type="primary-outline"
                    onPress={downloadReceiptHandler}
                    loading={downloadReceiptLoading}
                  />
                </View>
              </>
            )}
          </View>
          {buttonStateType === 4 && (
            <View style={styles.buttonsGroup}>
              {isContractInitiator && !isRejected && (
                <View style={styles.btnWrapper}>
                  <Button
                    title="لغو سند"
                    type="danger"
                    // onPress={cancelContractHandler}
                    onPress={onCancellation}
                    loading={false}
                    disabled={cancelContractHandlerLoading}
                  />
                </View>
              )}
            </View>
          )}
        </>
      )}
    </>
  );
};

export default Index;
