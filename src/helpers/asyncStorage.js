import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'react-native-crypto-js';
import debugLogger from './debugLogger';

const defaultEncryptionKey = {
  keySize: 256 / 32,
  iterations: 100,
};

const setAsyncStorage = async (
  type,
  key,
  data,
  encryptionKey = defaultEncryptionKey,
) => {
  try {
    if (type === 'text') {
      return await setTextInAsyncStorage(key, data, encryptionKey);
    } else if (type === 'object') {
      return await setObjectInAsyncStorage(key, data, encryptionKey);
    }
  } catch (error) {
    debugLogger(error);
  }
};

const setTextInAsyncStorage = async (key, data, encryptionKey) => {
  let encryptedData = CryptoJS.AES.encrypt(
    data.toString(),
    String(encryptionKey),
  ).toString();

  await AsyncStorage.setItem(key.toString(), encryptedData);

  return true;
};

const setObjectInAsyncStorage = async (key, data, encryptionKey) => {
  let DATA = JSON.stringify(data);
  let encryptedData = CryptoJS.AES.encrypt(
    DATA.toString(),
    String(encryptionKey),
  ).toString();

  await AsyncStorage.setItem(key.toString(), encryptedData);

  return true;
};

const getAsyncStorage = async (
  type,
  key,
  encryptionKey = defaultEncryptionKey,
) => {
  try {
    if (type === 'text') {
      return await getTextFromAsyncStorage(key, encryptionKey);
    } else if (type === 'object') {
      return await getObjectFromAsyncStorage(key, encryptionKey);
    }
  } catch (error) {
    debugLogger(error);
  }
};

const getTextFromAsyncStorage = async (key, encryptionKey) => {
  let data = await AsyncStorage.getItem(key.toString());

  if (data === null) {
    return null;
  } else {
    let bytes = CryptoJS.AES.decrypt(data, String(encryptionKey));

    return bytes.toString(CryptoJS.enc.Utf8);
  }
};

const getObjectFromAsyncStorage = async (key, encryptionKey) => {
  let data = await AsyncStorage.getItem(key.toString());

  if (data === null) {
    return null;
  } else {
    let bytes = CryptoJS.AES.decrypt(data, String(encryptionKey));
    let unEncryptData = bytes.toString(CryptoJS.enc.Utf8);

    return JSON.parse(unEncryptData);
  }
};

const removeAsyncStorage = async key => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    debugLogger(error);
  }
};

const clearAsyncStorage = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    debugLogger(error);
  }
};

export {
  setAsyncStorage,
  getAsyncStorage,
  removeAsyncStorage,
  clearAsyncStorage,
};
