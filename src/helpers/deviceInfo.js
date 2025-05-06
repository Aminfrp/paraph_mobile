import DeviceInfo from 'react-native-device-info';
import JailMonkey from 'jail-monkey';

const {isJailBroken} = JailMonkey;
const {isEmulator, getUniqueId} = DeviceInfo;

export const getDeviceIsEmulator = () => isEmulator();

export const getDeviceUniqueId = () => getUniqueId();

export const getDeviceIsRooted = () => isJailBroken();
