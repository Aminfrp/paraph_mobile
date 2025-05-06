import {NativeModules} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import * as RNFS from 'react-native-fs';
import logService from '../apis/services/log';
import {getAsyncStorage} from './asyncStorage';
import debugLogger from './debugLogger';
import {getDownloadFilePath} from '../modules/document/constant';
import fileDownloader from '../modules/fileDownloader';
import {Logger} from '../modules/log/logger';

const {FileManipulator} = NativeModules;

export default async (
  {url, encryptedFileName, filename},
  checkIsValidPdf = false,
) => {
  return fileDownloader(
    {url, encryptedFileName, filename},
    (checkIsValidPdf = false),
  );
  const access_token = await getAsyncStorage('text', '@Access_Token');

  // const config = {
  //   fileCache: true,
  //   addAndroidDownloads: {
  //     useDownloadManager: true,
  //     notification: true,
  //     mediaScannable: true,
  //     title: encryptedFileName,
  //     path: getDownloadFilePath(encryptedFileName),
  //   },
  // };

  const d_res = {};

  await RNFS.downloadFile({
    fromUrl: url,
    toFile: getDownloadFilePath(encryptedFileName),
    background: true, // Enable downloading in the background (iOS only)
    discretionary: true, // Allow the OS to control the timing and speed (iOS only)
    progress: res => {
      // Handle download progress updates if needed

      const progress = (res.bytesWritten / res.contentLength) * 100;
      Logger.debugLogger(`Progress: ${progress.toFixed(2)}%`);
    },
  })
    .promise.then(async response => {
      const fileDownloaded = await RNFS.readFile(
        getDownloadFilePath(encryptedFileName),
        'base64',
      );
      debugLogger('File downloaded!', response);

      d_res.data = {
        filePath: getDownloadFilePath(encryptedFileName),
      };

      if (checkIsValidPdf) {
        const isValidPdf = await FileManipulator.isBase64DataAsPdf(
          fileDownloaded,
        );

        if (!isValidPdf) {
          await RNFS.unlink(getDownloadFilePath(encryptedFileName));
          throw new Error('NOT_VALID');
        }
      }

      return response;
    })
    .catch(err => {
      debugLogger('Download error:', err);
    });

  return d_res;

  // return await RNFetchBlob.config(config)
  //   .fetch('GET', url, {
  //     Authorization: 'Bearer ' + access_token,
  //   })
  //   .then(async res => {
  //     const path = res.path();
  //     ;
  //
  //     if (checkIsValidPdf) {
  //       ;
  //
  //       const base64Data = await res.readFile('base64');
  //       ;
  //
  //       const isValidPdf = await FileManipulator.isBase64DataAsPdf(base64Data);
  //       ;
  //
  //       if (!isValidPdf) {
  //         ;
  //
  //         await RNFS.unlink(path);
  //         throw new Error('NOT_VALID');
  //       }
  //       ;
  //     }
  //
  //     return res.path();
  //   })
  //   .then(downloadedFilePath => {
  //     logService('info', `file downloaded in ${downloadedFilePath}`);
  //
  //     ;
  //
  //     return Promise.resolve({
  //       hasError: false,
  //       data: {
  //         filePath: downloadedFilePath,
  //         encryptedFileName: encryptedFileName,
  //         fileName: filename,
  //       },
  //     });
  //   })
  //   .catch(error => {
  //     logService(
  //       'error',
  //       `error in downloading from podSpace: ${error.message}, ${error.code}`,
  //     );
  //
  //     ;
  //
  //     debugLogger('error in download fetch api', error);
  //
  //     return Promise.reject({
  //       hasError: true,
  //       data: error,
  //       errorMessage: error.message,
  //     });
  //   });
};
