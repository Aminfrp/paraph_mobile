import {useContext, useEffect, useState} from 'react';
import {UserContext} from '../context';
import {isDevMode} from '../config/APIConfig';
import {getDeviceIsEmulator, getDeviceIsRooted} from '../helpers/deviceInfo';

export default () => {
  const {
    userState: {isAuthenticated},
  } = useContext<any>(UserContext);

  const [isEmulator, setIsEmulator] = useState<boolean>(false);
  const [isDeviceRooted, setIsDeviceRooted] = useState<boolean>(false);

  const componentMountUtils = async (): Promise<void> => {
    await runSecurityUtils();
  };

  useEffect(() => {
    componentMountUtils().then(r => {});
  }, [isAuthenticated]);

  const runSecurityUtils = async (): Promise<void> => {
    if (!isDevMode) {
      await getDeviceIsEmulator().then(res => setIsEmulator(res));
      setIsDeviceRooted(getDeviceIsRooted());
    }
  };

  return {
    isEmulator,
    isDeviceRooted,
  };
};
