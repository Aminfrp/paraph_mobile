import {
  getAppServerEcdhPublicKeyService,
  getPodEcdhKeyPairService,
  getPodEcdhPublicKeyService,
} from '../../../apis';
import {getDeviceUniqueId} from '../../../helpers/deviceInfo';
import {decode} from '../../converter/bufferConverter';
import {buildHash} from '../../converter/hashManipulator';
import {ab2str, str2base64} from '../../converter/stringBase64Converter';
import {Logger} from '../../log/logger';
import {NativeEncryptionModule} from '../../nativeModules';
import certificateLogger from './certificateLogger';

export const generateSecretByKeyPairs = async (ssoID: number) => {
  try {
    const podPublicKey = await getPodEcdhPublicKey(ssoID);
    const appServerPublicKey = await getAppServerEcdhPublicKey();
    const podKeyPairs = await getPodEcdhKeyPair(ssoID);

    Logger.debugLogger('podKeyPairs', appServerPublicKey);

    const secret = await NativeEncryptionModule.generateSecretKey({
      privateKey: podKeyPairs.privateKey,
      publicKey: appServerPublicKey.publicKey,
    });

    return Promise.resolve(secret);
  } catch (error) {
    Logger.debugLogger('error in generateSecretByKeyPairs: ', error);
    return Promise.reject(error);
  }
};

export const generateInitialVector = async (
  userPassInput: string,
  ssoID: number,
) => {
  const userPassHashString = await buildHash(str2base64(userPassInput));
  const ssoIdHashString = await buildHash(str2base64(ssoID.toString()));
  const deviceId = await getDeviceUniqueId();
  return deviceId + userPassHashString + '-' + ssoIdHashString;
};

export const getPodEcdhPublicKey = async (ssoId: number) => {
  try {
    const postData = {
      algorithm: 'ecdh',
      keySize: '1024',
      keyFormat: 'pem',
      identifier: `${ssoId}-paraph-client-mobile`,
    };
    const response = await getPodEcdhPublicKeyService(postData);
    const data = response && response.data;

    return Promise.resolve(data);
  } catch (error) {
    Logger.debugLogger('error in getPodEcdhPublicKey: ', error);
    return Promise.reject(error);
  }
};

export const getPodEcdhKeyPair = async (ssoId: number) => {
  try {
    const postData = {
      keyFormat: 'pem',
      identifier: `${ssoId}-paraph-client-mobile`,
    };
    const response = await getPodEcdhKeyPairService(postData);
    const data = response && response.data;
    Logger.debugLogger('key', data);
    return Promise.resolve(data);
  } catch (error) {
    Logger.debugLogger('error in getPodEcdhKeyPair: ', error);
    return Promise.reject(error);
  }
};
export const getAppServerEcdhPublicKey = async () => {
  try {
    const response = await getAppServerEcdhPublicKeyService();
    const data = response && response.data;
    return Promise.resolve(data);
  } catch (error) {
    Logger.debugLogger('error in getPodEcdhKeyPair: ', error);
    return Promise.reject(error);
  }
};

export const decryptCertificateData = async (
  ssoID: number,
  password: string,
  decryptedContent: string,
) => {
  try {
    const secret = await generateSecretByKeyPairs(ssoID);
    debugger;

    const initialVector = await generateInitialVector(password, ssoID);
    debugger;

    const {secretKey, iv} = getBase64DecryptedCertificateObject(
      secret,
      initialVector,
    );
    debugger;

    const certificateContent = await NativeEncryptionModule.decryptWithAES(
      secretKey,
      iv,
      decryptedContent,
    );
    debugger;

    console.log('cert Content', certificateContent);

    if (!certificateContent) {
      await certificateLogger('error', 'error in decrypt file');
      return Promise.reject('خطا در رمزگشایی گواهی');
    }
    debugger;

    const certificateDecodedData = await decode(certificateContent.data);
    Logger.debugLogger('certiiiii', certificateDecodedData);
    debugger;

    if (!certificateDecodedData) return;
    const certificate = await JSON.parse(ab2str(certificateDecodedData));
    return Promise.resolve(certificate);
  } catch (error) {
    Logger.debugLogger('error in decryptCertificateData: ', error);
    return Promise.reject(error);
  }
};

const getBase64DecryptedCertificateObject = (secret: string, iv: string) => {
  const base64Secret = str2base64(secret);
  const base64InitialVector = str2base64(iv);

  return {
    secretKey: base64Secret,
    iv: base64InitialVector,
  };
};

export const encryptCertificateData = async <T>(
  ssoID: number,
  userPassInput: string,
  certificate: T,
) => {
  try {
    const secret = await generateSecretByKeyPairs(ssoID);

    const initialVector = await generateInitialVector(userPassInput, ssoID);

    const {secretKey, iv, encryptingData} =
      getBase64EncryptingCertificateObject(secret, initialVector, {
        ...certificate,
      });

    const encryptedData = await NativeEncryptionModule.encryptWithAES(
      secretKey,
      iv,
      encryptingData,
    );

    return Promise.resolve(encryptedData);
  } catch (error) {
    Logger.debugLogger('error in encryptCertificateData: ', error);
    return Promise.reject(error);
  }
};

const getBase64EncryptingCertificateObject = <T>(
  secret: string,
  iv: string,
  certificate: T,
) => {
  const base64Secret = str2base64(secret);
  const base64InitialVector = str2base64(iv);
  const base64EncryptingObject = str2base64(
    JSON.stringify({
      ...certificate,
    }),
  );

  return {
    secretKey: base64Secret,
    iv: base64InitialVector,
    encryptingData: base64EncryptingObject,
  };
};
