import React, {useEffect} from 'react';
import {View} from 'react-native';
import styles from '../../style';
import Button from '../../../../components/button';
import {ContractStateDTOsEntity} from '../../../../model/contract.model';

type PropsModel = {
  documentStates: ContractStateDTOsEntity[];
  state: number;
  setState: (input: number) => void;
  isInitiator: boolean;
  onReceipt: () => void;
  onReceiptLoading: boolean;
  onSign: () => void;
  onReject: () => void;
  onCancellation: () => void;
  onCancellationLoading: boolean;
  isExpired: boolean;
  signLoading: boolean;
};

const Index: React.FC<PropsModel> = props => {
  const {
    documentStates,
    state,
    setState,
    isInitiator,
    onReceipt,
    onReceiptLoading,
    onSign,
    onReject,
    onCancellation,
    isExpired,
    signLoading,
    onCancellationLoading,
  } = props;
  const [isRejected, setIsRejected] = React.useState(false);

  useEffect(() => {
    documentStateChecker().then(r => {});
  }, [documentStates]);

  const documentStateChecker = async () => {
    const states = documentStates?.sort((a, b) => b.submitTime - a.submitTime);
    if (states) {
      states.forEach(i => {
        if (
          i.contractStateType === 'SUBMITTED' &&
          states[0].contractStateType === 'SUBMITTED'
        ) {
          setState(3);
        }
        if (
          i.contractStateType === 'SIGNED' &&
          states[0].contractStateType === 'SIGNED'
        ) {
          setState(4);
        }
        if (
          i.contractStateType === 'OPENED' &&
          states[0].contractStateType === 'OPENED'
        ) {
          setState(3);
        }
        if (
          i.contractStateType === 'NOT_SIGNED' &&
          states[0].contractStateType === 'NOT_SIGNED'
        ) {
          setState(4);
        }
        if (
          i.contractStateType === 'REJECTED' &&
          states[0].contractStateType === 'REJECTED'
        ) {
          setState(4);
          setIsRejected(true);
        }
      });
    }
  };

  const signOrRejectButtons = [
    {
      title: 'رد',
      type: 'danger',
      state: 'REJECT',
      onPress: () => onReject(),
    },
    {
      title: 'امضا',
      type: 'success',
      state: 'SIGN',
      onPress: () => onSign(),
    },
  ];

  return (
    <>
      <View style={styles.buttonsGroup}></View>
      <>
        <View></View>
        <View style={styles.buttonsGroup}>
          {!isExpired && (
            <>
              {state === 3 && !isInitiator && (
                <>
                  {signOrRejectButtons.map(item => (
                    <View style={styles.btnWrapper}>
                      <Button
                        title={item.title}
                        type={item.type}
                        onPress={item.onPress}
                        loading={item.state === 'SIGN' && signLoading}
                        disabled={isExpired || signLoading}
                      />
                    </View>
                  ))}
                </>
              )}
            </>
          )}

          {state === 3 && isInitiator && (
            <View style={styles.btnWrapper}>
              <Button
                title="لغو سند"
                type="danger"
                onPress={onCancellation}
                loading={onCancellationLoading}
                disabled={onCancellationLoading}
              />
            </View>
          )}

          {state === 4 && (
            <>
              <View style={styles.btnWrapper}>
                <Button
                  title="مشاهده رسید"
                  type="primary-outline"
                  onPress={onReceipt}
                  loading={onReceiptLoading}
                />
              </View>
            </>
          )}
        </View>
        {state === 4 && (
          <View style={styles.buttonsGroup}>
            {isInitiator && !isRejected && (
              <View style={styles.btnWrapper}>
                <Button
                  title="لغو سند"
                  type="danger"
                  onPress={onCancellation}
                  loading={false}
                  disabled={onCancellationLoading}
                />
              </View>
            )}
          </View>
        )}
      </>
    </>
  );
};

export default Index;
