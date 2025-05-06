import {useEffect, useState} from 'react';
import {DeviceEventEmitter, PermissionsAndroid} from 'react-native';
import debugLogger from '../helpers/debugLogger';
import getSmsPermission from '../modules/permissions/sms/getSmsPermission';

export default (pinCount, callback) => {
  const [receiveSmsPermission, setReceiveSmsPermission] = useState('');

  const requestSmsPermission = async () => {
    try {
      const {granted} = await getSmsPermission();
      setReceiveSmsPermission(granted);
    } catch (err) {
      debugLogger('error in requestSmsPermission: ', err);
    }
  };

  useEffect(() => {
    requestSmsPermission().then(r => null);
  }, []);

  useEffect(() => {
    if (receiveSmsPermission === PermissionsAndroid.RESULTS.GRANTED) {
      let subscriber = DeviceEventEmitter.addListener(
        'onSMSReceived',
        message => {
          const {messageBody, senderPhoneNumber, codeValue} =
            JSON.parse(message);

          if (codeValue && codeValue.length === pinCount) {
            callback(codeValue);
          }
        },
      );

      return () => {
        subscriber.remove();
      };
    }
  }, [receiveSmsPermission]);

  return true;
};
