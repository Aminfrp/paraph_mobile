import {ReadDirItem} from 'react-native-fs';
import getLoggedInUserSSOID from '../../../helpers/getLoggedInUserSSOID';
import {CertificateTypeEnum} from '../../../model/certificateType.enum';
import {PairsModel} from '../../../model/pairs.model';
import {ValueOf} from '../../../model/valueof.type';
import {decode} from '../../converter/bufferConverter';
import {ab2str, str2base64} from '../../converter/stringBase64Converter';
import {appDocumentDirectoryPath} from '../../fileManipulator/constants';
import dirReader from '../../fileManipulator/dirReader';
import fileReader from '../../fileManipulator/fileReader';
import fileRemover from '../../fileManipulator/fileRemover';
import fileWriter from '../../fileManipulator/fileWriter';
import {Logger} from '../../log/logger';
import {NativeEncryptionModule} from '../../nativeModules';

export const saveRSAKeyPairsFile = async (
  pairs: PairsModel,
  certificateType: ValueOf<CertificateTypeEnum>,
) => {
  try {
    const ssoID = await getLoggedInUserSSOID();
    const fileName = `${certificateType}-rsa-key-pairs-${ssoID}`;
    const path = `${appDocumentDirectoryPath}/${fileName}`;
    const encryptData = await NativeEncryptionModule.encryptWithAES(
      str2base64(`rsa-key-pairs-${ssoID}`),
      str2base64(`paraph-${ssoID}`),
      str2base64(
        JSON.stringify({
          ...pairs,
        }),
      ),
    );

    const state = await fileWriter(path, encryptData.data, 'base64')
      .then(success => {
        Logger.debugLogger('RSA-KEY-PAIRS FILE WRITTEN!', path);
        return true;
      })
      .catch(err => {
        Logger.debugLogger('err.message', err.message);
        return false;
      });

    return Promise.resolve(state);
  } catch (error) {
    Logger.debugLogger('error in saveRSAKeyPairsFile: ', error);
    return Promise.reject(error);
  }
};

export const readDecodedPairsFile = async (
  certificateType: ValueOf<CertificateTypeEnum>,
): Promise<PairsModel | null> => {
  try {
    const ssoID = await getLoggedInUserSSOID();
    const base64pairs: string | null = await readPairsFile(certificateType);

    if (base64pairs) {
      let pairs: PairsModel = {public: '', private: ''};

      const decrypted = await NativeEncryptionModule.decryptWithAES(
        str2base64(`rsa-key-pairs-${ssoID}`),
        str2base64(`paraph-${ssoID}`),
        base64pairs,
      );

      const contentFile = decode(decrypted.data);
      if (!contentFile) {
        return Promise.resolve(null);
      }
      pairs = await JSON.parse(ab2str(contentFile));
      return Promise.resolve(pairs);
    }
    return null;
  } catch (error) {
    Logger.debugLogger('error in readDecodedPairsFile: ', error);
    return Promise.resolve(null);
  }
};

export const readPairsFile = async (
  certificateType: ValueOf<CertificateTypeEnum>,
): Promise<string | null> => {
  try {
    const ssoID = await getLoggedInUserSSOID();
    const fileName = `${certificateType}-rsa-key-pairs-${ssoID}`;
    const files: Array<ReadDirItem> | undefined = await dirReader(
      appDocumentDirectoryPath,
    );

    const pairs: ReadDirItem | undefined = files?.find(
      el => el.name === fileName,
    );

    if (pairs) {
      const certificateFileBase64: string | undefined = await fileReader(
        pairs?.path,
        'base64',
      );

      if (certificateFileBase64) {
        return Promise.resolve(certificateFileBase64);
      }
      return null;
    }
    return null;
  } catch (error) {
    Logger.debugLogger('error in readPairsFile: ', error);
    return Promise.resolve(null);
  }
};

export const removeCertificateFile = async (
  certificateType: ValueOf<CertificateTypeEnum>,
) => {
  try {
    if (await readCertificateFile(certificateType)) {
      const ssoID = await getLoggedInUserSSOID();
      const fileName = `${certificateType}-certificate-${ssoID}`;
      const path = `${appDocumentDirectoryPath}/${fileName}`;

      await fileRemover(path);
      Logger.debugLogger('File Deleted');
    }
  } catch (error) {
    Logger.debugLogger('error in removeCertificateFile: ', error);
    return Promise.reject(error);
  }
};

export const readCertificateFile = async (
  certificateType: ValueOf<CertificateTypeEnum>,
): Promise<string | undefined> => {
  try {
    const ssoID = await getLoggedInUserSSOID();
    const fileName = `${certificateType}-certificate-${ssoID}`;
    Logger.debugLogger('TEST Certificate file', fileName);
    const files: Array<ReadDirItem> | undefined = await dirReader(
      appDocumentDirectoryPath,
    );
    const certificateFile: ReadDirItem | undefined = files?.find(
      el => el.name === fileName,
    );
    Logger.debugLogger('TEST Certificate file path', certificateFile?.path);

    if (certificateFile) {
      const certificateFileBase64: string | undefined = await fileReader(
        certificateFile?.path,
        'base64',
      );

      return Promise.resolve(certificateFileBase64);
    }
  } catch (e) {
    await Logger.serverDebugLogger('error in readCertificateFile: ', e);
    return Promise.reject(e);
  }
};

export const writeCertificateFile = async (
  certificateType: ValueOf<CertificateTypeEnum>,
  fileData: string,
) => {
  try {
    const ssoID = await getLoggedInUserSSOID();
    const fileName = `${certificateType}-certificate-${ssoID}`;
    const path = `${appDocumentDirectoryPath}/${fileName}`;

    const isFileWrite = await saveCertificateFile(fileData, path);

    let message = '';
    if (isFileWrite) {
      await removeRSAKeyPairsFile(certificateType);
      message = 'گواهی رمزنگاری و ذخیره شد';
      return Promise.resolve(message);
    }

    message = 'دریافت و ساخت گواهی ریشه با خطا مواجه شد';
    return Promise.reject(message);
  } catch (error) {
    Logger.debugLogger('error in writeCertificateFile: ', error);
  }
};

const saveCertificateFile = async (contents: string, path: string) => {
  try {
    const state = await fileWriter(path, contents.toString(), 'base64')
      .then(success => {
        Logger.debugLogger('FILE WRITTEN!', path);
        return true;
      })
      .catch(err => {
        Logger.debugLogger(err.message);
        return false;
      });

    return Promise.resolve(state);
  } catch (e) {
    Logger.debugLogger('error in saveCertificateFile: ', e);
    return Promise.reject(e);
  }
};

export const removeRSAKeyPairsFile = async (
  certificateType: ValueOf<CertificateTypeEnum>,
) => {
  try {
    if (await readDecodedPairsFile(certificateType)) {
      const ssoID = await getLoggedInUserSSOID();
      const fileName = `${certificateType}-rsa-key-pairs-${ssoID}`;

      const path = `${appDocumentDirectoryPath}/${fileName}`;

      await fileRemover(path);

      Logger.debugLogger('File Deleted');
    }
  } catch (error) {
    Logger.debugLogger('error in removeCertificateFile: ', error);
    return Promise.reject(error);
  }
};
