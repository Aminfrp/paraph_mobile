import {NativeModules} from 'react-native';
import {Logger} from '../log/logger.ts';
const {EncryptionUtil} = NativeModules;
const {PDFSigner} = NativeModules;

export class NativeEncryptionModule {
  static async getRSAKeyPairs(size = 1024) {
    try {
      const data = await EncryptionUtil.getRsaKeyPairsAsync(size);
      return Promise.resolve(data);
    } catch (error) {
      Logger.debugLogger('error in getKeyPairsAsync: ', error);
      return Promise.reject(error);
    }
  }

  static async encryptWithAES(
    secret: string,
    initialVector: string,
    encryptingObject: string,
  ) {

    try {
      return await EncryptionUtil.encryptWithAES(
        secret,
        initialVector,
        encryptingObject,
      );
    } catch (e) {
      Logger.debugLogger('error in encryptWithAES: ', e);
      return Promise.reject(e);
    }
  }

  static async decryptWithAES(
    secret: string,
    initialVector: string,
    decryptedObject: string,
  ) {
    ;
    try {
      return await EncryptionUtil.decryptWithAES(
        secret,
        initialVector,
        decryptedObject,
      );
    } catch (e) {
      Logger.debugLogger('error in decryptWithAES: ', e);
      return Promise.reject(e);
    }
  }

  static async createSignatureRSA(privateKey: string, signText: string) {
    try {
      Logger.debugLogger('private_key', {privateKey, signText});
      const signature = await EncryptionUtil.createSignatureRSA(
        privateKey,
        signText,
      );

      return Promise.resolve(signature);
    } catch (e) {
      Logger.debugLogger('error in creatSignatureRSA: ', e);
      return Promise.reject(e);
    }
  }

  static async generateSecretKey(pairs: {
    privateKey: string;
    publicKey: string;
  }) {
    try {
      const secret = await EncryptionUtil.generateSecretKey(
        pairs.privateKey,
        pairs.publicKey,
      );
      return Promise.resolve(secret.data);
    } catch (e) {
      Logger.debugLogger('error in generateSecretKey: ', e);
      return Promise.reject(e);
    }
  }

  static async createSignCSR(
    subject: string,
    privateKey: string,
    publicKey: string,
  ) {
    try {
      const signString = await EncryptionUtil.createSignCSR(
        subject,
        privateKey,
        publicKey,
      );
      return Promise.resolve(signString);
    } catch (e) {
      Logger.debugLogger('error in createSignCSR: ', e);
      return Promise.reject(e);
    }
  }

  static async signPdfByCertificate(
    content: string,
    privateKey: string,
    certificate: string,
    signerInfo: string,
  ) {
    try {
      const signString = await PDFSigner.addSignature(
        content,
        privateKey,
        certificate,
        signerInfo,
      );
      Logger.debugLogger('signString', signString);
      return Promise.resolve(signString);
    } catch (e) {
      Logger.debugLogger('error in signPdfByCertificate: ', e);
      return Promise.reject(e);
    }
  }
}
