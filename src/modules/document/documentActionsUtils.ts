import RNFetchBlob from 'rn-fetch-blob';
import {
  rejectContractByIdService,
  saveSignedPdfService,
  signByCertificateService,
  signContractByIdService,
  updateStateService,
} from '../../apis';
import * as Toast from '../../components/toastNotification/utils';
import getLoggedInUserSSOID from '../../helpers/getLoggedInUserSSOID.ts';
import {ContractModel} from '../../model/contract.model.ts';
import {SavedSignedPdfInputModel} from '../../model/savedSignedPdfInput.model.ts';
import {SignByCertificateInputModel} from '../../model/signByCertificateInput.model.ts';
import {signByNamadCertificate} from '../certificate/namadCertificate';
import {signByRisheCertificate} from '../certificate/rishe';
import fileReader from '../fileManipulator/fileReader.ts';
import fileWriter from '../fileManipulator/fileWriter';
import {Logger} from '../log/logger.ts';
import {NativeEncryptionModule} from '../nativeModules';
import {getDownloadFilePath} from './constant';
import {DocumentUtils} from './documentUtils.ts';
// @ts-ignore
import {decode as atob} from 'base-64';

export class DocumentActionsUtils extends DocumentUtils {
  constructor(contractObjData: ContractModel, constantTempName: string) {
    super(contractObjData, constantTempName);
  }

  private get signedPdfPath() {
    return getDownloadFilePath(this.fileName + '-signed');
  }

  private async generateRisheSignature(
    password: string,
    dataForSign: string,
    fileNotExistCallback?: () => {},
  ) {
    try {
      const ssoID: number = await getLoggedInUserSSOID();
      if (ssoID) {
        const signData = await signByRisheCertificate(
          password,
          dataForSign,
          ssoID,
          fileNotExistCallback,
        );
        return Promise.resolve(signData);
      }
    } catch (error) {
      Logger.debugLogger('error in generateRisheSignature: ', error);
      return Promise.reject(error);
    }
  }

  private async generateNamadSignature(password: string, dataForSign: string) {
    try {
      const ssoID: number = await getLoggedInUserSSOID();

      if (ssoID) {
        const signData = await signByNamadCertificate(
          password,
          dataForSign,
          ssoID,
        );

        return Promise.resolve(signData);
      }
    } catch (error) {
      Logger.debugLogger('error in generateRisheSignature: ', error);
      return Promise.reject(error);
    }
  }

  private async signPdfByCertificate(
    certificate: string,
    privateKey: string,
    signerInfo: string,
    keyId: string,
  ) {
    try {
      const filePath = getDownloadFilePath(`${this.fileName}.pdf`);
      const fileContent = await fileReader(filePath, 'base64');
      if (fileContent) {
        const pdfContent = await NativeEncryptionModule.signPdfByCertificate(
          fileContent,
          privateKey,
          certificate,
          signerInfo,
        );
        await this.saveSignedPDFFile(pdfContent, keyId, 'rishe');
      }
    } catch (error: any) {
      Logger.debugLogger('error in signPdfByCertificate: ', error);
      return Promise.reject(error);
    }
  }

  private async callSignByCertificateService(
    signature: string,
    keyId: string,
    certType: string,
  ) {
    try {
      const signParams: SignByCertificateInputModel = {
        sign: signature,
        id: this._contractObjData.id,
        keyId: keyId,
        certType,
      };
      const response = await signByCertificateService(signParams);
      const signResponse = response && response.data;
      return Promise.resolve(signResponse);
    } catch (error: any) {
      Logger.debugLogger('error in callSignByCertificateService: ', error);
      return Promise.reject(error);
    }
  }

  private async callSignByIdService() {
    try {
      const signParams = {
        contractDtoId: this._contractObjData.contractDto.id,
        contactId: this._contractObjData.signerDto.SSOId,
        id: this._contractObjData.id,
        description: {
          documentSignDescription: '',
        },
      };
      const response = await signContractByIdService(signParams);
      const signResponse = response && response.data;
      return Promise.resolve(signResponse);
    } catch (error: any) {
      Logger.debugLogger('error in callSignByIdService: ', error);
      return Promise.reject(error);
    }
  }

  private async callRejectByIdService(message: string) {
    try {
      const documentId = this._contractObjData.id;
      const updateParams = {
        contractStateType: 'NOT_SIGNED',
        stateMessage: message,
        submitTime: new Date().getTime(),
        id: documentId,
      };
      const response = await updateStateService(updateParams);
      const rejectResponse = response && response.data;
      return Promise.resolve(rejectResponse);
    } catch (error: any) {
      Logger.debugLogger('error in callRejectByIdService: ', error);
      return Promise.reject(error);
    }
  }

  private async callCancelByIdService(message: string) {
    try {
      const documentId = this._contractObjData.contractDto.id;
      const updateParams = {
        contractStateType: 'REJECTED',
        stateMessage: message,
        submitTime: new Date().getTime(),
        id: documentId,
      };
      const response = await rejectContractByIdService(updateParams);
      const rejectResponse = response && response.data;
      return Promise.resolve(rejectResponse);
    } catch (error: any) {
      Logger.debugLogger('error in callCancelByIdService: ', error);
      return Promise.reject(error);
    }
  }

  private isBase64Content(contentString: string) {
    const base64regex =
      /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    return base64regex.test(contentString);
  }

  private signByCertificateErrorCallback(error: any) {
    if (error && error.data && error.data.errorMessage) {
      Toast.showToast(
        'danger',
        'امضا با گواهی',
        error.data.errorMessage?.toString() || 'خطا در امضا با گواهی',
      );
    }
    return Promise.reject(error);
  }

  private signByIdErrorCallback(error: any) {
    if (error && error.data && error.data.errorMessage) {
      Toast.showToast(
        'danger',
        'امضا یا شناسه سند',
        error.data.errorMessage?.toString() || 'خطا در امضا یا شناسه سند',
      );
    }
    return Promise.reject(error);
  }

  private rejectByIdErrorCallback(error: any) {
    if (error && error.data && error.data.message) {
      Toast.showToast(
        'danger',
        'امضا یا شناسه سند',
        error.data.message?.toString() || 'خطا در رد یا شناسه سند',
      );
    }
    return Promise.reject(error);
  }

  private getDataForSign(): string {
    let dataForSign: string = '';
    if (this._contractObjData.contractDto?.content) {
      if (this.isBase64Content(this._contractObjData.contractDto?.content)) {
        dataForSign = atob(this._contractObjData.contractDto?.content);
      }
      dataForSign = this._contractObjData.contractDto.content;
    } else {
      dataForSign = this._contractObjData.contractDto.hash;
    }
    return dataForSign;
  }

  private async isReadyForSign() {
    try {
      if (!this.dateValidation(this._contractObjData.contractDto.toDate)) {
        this.throwSignError(
          'DOCUMENT_VALIDATION_ERROR',
          'قرارداد منقضی شده است!',
        );
        return Promise.reject(false);
      }
      const isHashValid = await this.fileHashValidation();
      if (!isHashValid) {
        this.throwSignError(
          'DOCUMENT_VALIDATION_ERROR',
          'فایل ذخیره شده با فایل قرارداد مغایرت دارد!',
        );

        return Promise.reject(false);
      }
      return true;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private throwSignError(type: string, message: string) {
    throw {type, message};
  }

  private async writeSignedPDFFile(
    filePath: string,
    fileData: string,
  ): Promise<any> {
    await fileWriter(filePath, fileData);
    return {
      name: this.fileName + '-signed.pdf',
      filename: this.fileName + '-signed.pdf',
      data: RNFetchBlob.wrap(filePath),
    };
  }

  private async saveSignedPDFFile(
    pdfContent: string,
    keyId: string,
    certType: string,
  ) {
    try {
      const file = await this.writeSignedPDFFile(
        this.signedPdfPath + '-signed.pdf',
        pdfContent,
      );
      const postData: SavedSignedPdfInputModel = {
        keyId,
        file: file,
        certType,
        signerId: this._contractObjData.id,
      };
      await saveSignedPdfService(postData);
    } catch (error) {
      Logger.debugLogger('error in saveSignedPDFFile: ', error);
      return Promise.reject(error);
    }
  }

  public async signByRishe(
    password: string,
    signerInfo: string,
    fileNotExistCallback?: () => {},
  ) {
    try {
      const certType: string = 'rishe';
      const isValid = await this.isReadyForSign();

      if (isValid) {
        let dataForSign: string = this.getDataForSign();
        const signData = await this.generateRisheSignature(
          password,
          dataForSign,
          fileNotExistCallback,
        );
        if (signData) {
          await this.callSignByCertificateService(
            signData.signature,
            signData.keyId,
            certType,
          );
          await this.signPdfByCertificate(
            signData.certificate.certificate,
            signData.pairs.private,
            signerInfo,
            signData.keyId,
          );
        }
      }
    } catch (error: any) {
      return this.signByCertificateErrorCallback(error);
    }
  }

  public async signByNamad(password: string) {
    try {
      const certType: string = 'namad';
      const isValid = await this.isReadyForSign();

      if (isValid) {
        let dataForSign: string = this.getDataForSign();
        const signData = await this.generateNamadSignature(
          password,
          dataForSign,
        );
        if (signData) {
          return await this.callSignByCertificateService(
            signData.signature,
            signData.keyId,
            certType,
          );
        }
      }
    } catch (error: any) {
      return this.signByCertificateErrorCallback(error);
    }
  }

  public async signById() {
    try {
      const isValid = await this.isReadyForSign();
      if (isValid) {
        await this.callSignByIdService();
      }
    } catch (error: any) {
      return this.signByIdErrorCallback(error);
    }
  }

  public async rejectById(message: string) {
    try {
      const isValid = await this.isReadyForSign();
      if (isValid) {
        await this.callRejectByIdService(message);
      }
    } catch (error: any) {
      return this.rejectByIdErrorCallback(error);
    }
  }

  public async cancelById(message: string) {
    try {
      const isValid = await this.isReadyForSign();
      if (isValid) {
        await this.callCancelByIdService(message);
      }
    } catch (error: any) {
      return this.rejectByIdErrorCallback(error);
    }
  }
}
