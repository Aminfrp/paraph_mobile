import CryptoES from 'crypto-es';
import {ContractModel} from '../../model/contract.model.ts';
import fileReader from '../fileManipulator/fileReader.ts';
import {Logger} from '../log/logger.ts';
import {getDownloadFilePath} from './constant';

export class DocumentUtils {
  protected _contractObjData: ContractModel;
  protected readonly fileName: string;

  constructor(contractObjData: ContractModel, constantTempName: string) {
    this._contractObjData = contractObjData;
    this.fileName = constantTempName + '-' + contractObjData?.id;
  }

  protected dateValidation(timestamp: number) {
    if (timestamp === 0) {
      return true;
    }

    return new Date().getTime() <= timestamp;
  }

  protected async fileHashValidation() {
    try {
      if (this._contractObjData.contractDto.trusted) {
        return true;
      }

      const filePath = getDownloadFilePath(`${this.fileName}.pdf`);

      const fileContent = await fileReader(filePath, 'base64');

      const originalHash = this._contractObjData.contractDto.hash;

      if (fileContent) {
        const hash = this.getFileHash(fileContent);
        return hash === originalHash;
      }
    } catch (error) {
      Logger.debugLogger('error in fileHashValidation:', error);
      return Promise.reject(error);
    }
  }

  protected getFileHash(base64File: string) {
    try {
      let localHash;
      let localHashString;

      localHash = CryptoES.SHA256(base64File);
      localHashString = localHash.toString();

      return localHashString;
    } catch (error) {
      Logger.debugLogger('error in getFileHash:', error);
      return error;
    }
  }
}
