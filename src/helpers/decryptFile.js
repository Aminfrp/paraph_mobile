import RNFetchBlob from 'rn-fetch-blob';
import * as RNFS from 'react-native-fs';
import {deniedPermissionAlert} from './utils';
import logService from '../apis/services/log';
import getStoragePermission from '../modules/permissions/storage/getStoragePermission';
import CryptoJS from 'react-native-crypto-js';
import {CONTRACT_IV} from '../config/APIConfig';
import debugLogger from './debugLogger';

export default async (secretKey, file, iv, show = true) => {
  try {
    const {granted, readGranted, writeGranted} = await getStoragePermission();

    if (!readGranted || !writeGranted) {
      await logService(
        'error',
        `cannot get permission for download from podSpace`,
      );

      deniedPermissionAlert();

      return;
    }

    await openPdf(secretKey, file, iv, show);

    return Promise.resolve();
  } catch (error) {
    await logService('error', `error in decryptFile Method: ${error}`);

    debugLogger('decryptFile error:', error);

    return Promise.reject(error);
  }
};

const openPdf = async (secretKey, file, Base64IV, show) => {
  try {
    const fileUri = await writeFile(secretKey, file, Base64IV);
    if (show) {
      RNFetchBlob.android.actionViewIntent(fileUri, 'application/pdf');
    }

    // if (Platform.OS === 'android') {
    //   RNFetchBlob.android.actionViewIntent(res.path(), mimeType || 'application/pdf');
    // }
    //
    // if (Platform.OS === 'ios') {
    //   RNFetchBlob.ios.previewDocument(res.path());
    // }

    return Promise.resolve();
  } catch (error) {
    await logService('error', `error in openPdf Method: ${error}`);

    debugLogger('openPdf error:', error);

    return Promise.reject(error);
  }
};

const writeFile = async (secretKey, file, Base64IV) => {
  try {
    const {filePath, encryptedFileName, fileName} = file;

    const response = await RNFS.readFile(filePath);

    const contractIV = CONTRACT_IV;
    const IV = 'Fanap___Contract';

    let iv;

    if (Base64IV && Base64IV === contractIV) {
      iv = CryptoJS.enc.Utf8.parse(IV);
    } else {
      iv = CryptoJS.enc.Base64.parse(Base64IV);
    }

    const key = CryptoJS.enc.Base64.parse(secretKey);

    const decrypted = CryptoJS.AES.decrypt(response, key, {iv: iv});

    const fileUri = filePath.replace(encryptedFileName, fileName);

    await RNFS.writeFile(
      fileUri,
      decrypted.toString(CryptoJS.enc.Base64),
      'base64',
    );

    return Promise.resolve(fileUri);
  } catch (error) {
    debugLogger('writeFile error:', error);

    return Promise.reject(error);
  }
};
