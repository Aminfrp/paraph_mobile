import {Logger} from '../log/logger.ts';
import isStoragePermissionValid from '../permissions/storage/isStoragePermissionValid';
import fileDownloader from '../fileDownloader';
import RNFetchBlob from 'rn-fetch-blob';
import {getPodSpaceFileDetailsService} from '../../apis';

export class DocumentFileUtils {
  // todo: please complete this methode...
  private async downloadFile(resourceLink: string, fileName: string) {
    try {
      const encryptedFileName = fileName + '.pdf.enc';
      if (await isStoragePermissionValid()) {
        const result = await fileDownloader({
          url: resourceLink,
          fileName: encryptedFileName,
        });

        if (result) {
          const clientFileSize = await this.getFileSize(result.data.filePath);
          const remoteFileSize = await this.getPodSpaceFileSize(resourceLink);

          if (this.isFileSizeValid(remoteFileSize, clientFileSize)) {
          }
        }
      }
    } catch (error) {
      Logger.debugLogger('error in downloadFile: ', error);
      return Promise.reject(error);
    }
  }

  private async getFileSize(filePath: string) {
    try {
      const {size} = await RNFetchBlob.fs.stat(filePath);
      return size;
    } catch (error) {
      Logger.debugLogger('error in getFileSize: ', error);
      return Promise.reject(error);
    }
  }

  private async getPodSpaceFileSize(resourceLink: string) {
    try {
      const fileDetails = await getPodSpaceFileDetailsService(resourceLink);
      return fileDetails && fileDetails.data.size;
    } catch (error) {
      Logger.debugLogger('error in getPodSpaceFileSize: ', error);
      return Promise.reject(error);
    }
  }

  private isFileSizeValid(remoteFileSize: number, clientFileSize: number) {
    if (remoteFileSize === clientFileSize) {
      return true;
    }
    this.throwError('FILE_SIZE_VALIDATION', 'فایل ذخیره شده مفایرت دارد');
  }

  private throwError(type: string, message: string) {
    throw {type, message};
  }
}
