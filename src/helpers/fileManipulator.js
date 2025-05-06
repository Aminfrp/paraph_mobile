// import {decode as atob, encode as btoa} from 'base-64';
import * as RNFS from 'react-native-fs';
import {toByteArray} from 'react-native-quick-base64';
import {toPersianDigits} from './convertNumber';
import debugLogger from './debugLogger';

export const concatBase64FileToSSOID = (base64, ssoId) => {
  try {
    const enc = new TextEncoder(); // always utf-8
    const arrayBufferSSOID = enc.encode(ssoId);
    const buffer = base64ToArrayBuffer(base64);
    let base64Extended = concatTypedArrays(buffer, arrayBufferSSOID);

    return {base64: arrayBufferToBase64(base64Extended)};
  } catch (error) {
    return error;
  }
};

export const base64ToArrayBuffer = base64 => {
  try {
    const binary_string = window.atob(base64);

    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }

    return bytes.buffer;
  } catch (error) {
    return error;
  }
};

export const arrayBufferToBase64 = buffer => {
  try {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    return window.btoa(binary);
  } catch (error) {
    throw error;
  }
};

export const concatTypedArrays = (firstBuffer, secondBuffer) => {
  try {
    const concatedBuffer = new Uint8Array(
      firstBuffer.byteLength + secondBuffer.byteLength,
    );
    const unit8Tmp = new Uint8Array(firstBuffer);
    concatedBuffer.set(unit8Tmp, 0);
    concatedBuffer.set(secondBuffer, firstBuffer.byteLength);

    return concatedBuffer;
  } catch (error) {
    return error;
  }
};

export const getArrayBufferFile = file => {
  const borrowsFile = new FileReader();
  new Promise((resolve, _) => {
    borrowsFile.onload = () => resolve(file);
  }).then(() => null);
  borrowsFile.readAsArrayBuffer(file);

  return borrowsFile;
};

export const convertFileSize = size => {
  return 'MB ' + toPersianDigits((size / (1024 * 1024)).toFixed(2));
};

export const getBase64ByFileUri = async uri => {
  return await RNFS.readFile(uri, 'base64').catch(error => {
    debugLogger('error in getBase64ByFileUri: ', error);
  });
};

export const base64ToByteArray = base64 => {
  return toByteArray(base64);
};
