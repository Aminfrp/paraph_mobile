// import ReactNativeBlobUtil, {FetchBlobResponse} from 'react-native-blob-util';
import {getAsyncStorage} from '../../helpers/asyncStorage';
import {Logger} from '../log/logger';
import {getDownloadFilePath} from '../document/constant';
import * as RNFS from 'react-native-fs';
import {logService} from '../../apis';
import {FileManipulator} from '../nativeModules';
import fileWriter from '../fileManipulator/fileWriter';
import RNFetchBlob, {FetchBlobResponse} from 'rn-fetch-blob';

type InputModel = {
  url: string;
  fileName: string;
  progressSetter?: (progress: string) => void;
};

export default async (
  {url, fileName, progressSetter}: InputModel,
  checkIsValidPdf = false,
) => {
  try {
    const access_token = await getAsyncStorage('text', '@Access_Token');
    const path = getDownloadFilePath(fileName);

    // let dirs = RNFetchBlob.fs.dirs;
    //
    // const config = {
    //   fileCache: true,
    //   path: path,
    // };
    //
    // const isDirExist = await RNFetchBlob.fs.exists(path);
    // const response = await fetch(url, {
    //   headers: {
    //     Authorization: `Bearer ${access_token}`,
    //   },
    // });
    //
    // const blob = await response.blob();
    // console.log('blobblob', blob);
    //
    // const base64Data = await new Promise((resolve, reject) => {
    //   const reader = new FileReader();
    //   reader.onloadend = () => {
    //     const result = reader.result;
    //     if (typeof result === 'string') {
    //       const base64 = result.split(',')[1]; // Extract base64 part
    //       resolve(base64);
    //     } else {
    //       reject(new Error('Failed to convert blob to base64'));
    //     }
    //   };
    //   reader.onerror = reject;
    //   reader.readAsDataURL(blob);
    // });
    //
    // if (typeof base64Data === 'string') {
    //   // const desPath = `${RNFS.DownloadDirectoryPath}/paraph/download`;
    //   // const directoryExists = await RNFS.exists(path);
    //   // ;
    //   // if (!directoryExists) {
    //   //   ;
    //   //   await RNFS.mkdir(path);
    //   // }
    //
    //   await RNFetchBlob.fs
    //     .writeFile(path, base64Data, 'base64')
    //     .then(res => {
    //       console.log('file written');
    //     })
    //     .catch(error => {
    //       console.log('errorerrorerror', error);
    //       console.log('file written faileddddd');
    //     });
    //   ;
    // }
    //
    // return Promise.resolve({
    //   hasError: false,
    //   data: {
    //     filePath: path,
    //     encryptedFileName: fileName,
    //     fileName: fileName,
    //   },
    // });

    const config = {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        mediaScannable: true,
        title: fileName,
        path: getDownloadFilePath(fileName),
      },
    };

    const requestHeaders = {Authorization: 'Bearer ' + access_token};
    const downloadResponse = await RNFetchBlob.config(config)
      .fetch('GET', url, requestHeaders)
      .then((response: FetchBlobResponse) =>
        responseReceivedHandler(response, checkIsValidPdf, path),
      )
      .then((downloadedFilePath: string) =>
        dataSetter(downloadedFilePath, fileName),
      )
      .catch(errorHandler);

    return Promise.resolve(downloadResponse);
  } catch (error) {
    return Promise.reject(error);
  }
};

const progressHandler = (received: string, total: string) => {
  Logger.debugLogger(`Progress: ${total},${received}`);
};

const fileValidation = async (path: string, response: FetchBlobResponse) => {
  try {
    const base64Data: Promise<any> | null = await response.readFile('base64');

    const isValidPdf = await FileManipulator.isBase64DataAsPdf(base64Data);

    if (!isValidPdf) {
      await RNFS.unlink(path);
      throw new Error('NOT_VALID');
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

const responseReceivedHandler = async (
  response: FetchBlobResponse,
  checkIsValidPdf: boolean,
  savePath: string,
): Promise<string> => {
  try {
    const path: string = response.path();

    if (checkIsValidPdf) {
      await fileValidation(path, response);
    }
    return path;
  } catch (error) {
    return Promise.reject(error);
  }
};

const dataSetter = async (path: string, fileName: string) => {
  try {
    await logService('info', `file downloaded in ${path}`);
    return Promise.resolve({
      hasError: false,
      data: {
        filePath: path,
        encryptedFileName: fileName,
        fileName: fileName,
      },
    });
  } catch (error) {
    return Promise.reject(error);
  }
};

const errorHandler = async (error: any) => {
  try {
    await logService(
      'error',
      `error in downloading from podSpace: ${error.message}, ${error.code}`,
    );

    Logger.debugLogger('error in download fetch api', error);

    throw {
      hasError: true,
      data: error,
      errorMessage: error.message,
    };
  } catch (error) {
    return Promise.reject(error);
  }
};
