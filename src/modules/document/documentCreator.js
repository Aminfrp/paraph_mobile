import getStoragePermission from '../permissions/storage/getStoragePermission';
import logService from '../../apis/services/log';
import {deniedPermissionAlert} from '../../helpers/utils';
import debugLogger from '../../helpers/debugLogger';
import {
  addContractService,
  getContractStatesService,
  getPodspaceUploadHashService,
  getSecretKeyByContractIdService,
  getUserProfileService,
  shareFileService,
  uploadFileService,
} from '../../apis';
import {getAsyncStorage} from '../../helpers/asyncStorage';
import * as keyStorage from '../../constants/keyStorage';
import loadContract from '../dataNormalizers/loadContract';
import * as routesName from '../../constants/routesName';
import RNFetchBlob from 'rn-fetch-blob';
import * as RNFS from 'react-native-fs';
import {decode} from '../converter/bufferConverter';
import {CONTRACT_IV, POD_SPACE_UPLOAD_FILE_LINK} from '../../config/APIConfig';
import CryptoES from 'crypto-es';
import {buildHash} from '../../helpers/hashManipulator';
import {navigate} from '../../navigation/navigationRoot';
import * as Toast from '../../components/toastNotification/utils';
import refIdGenerator from '../../helpers/refIdGenerator';

class DocumentCreator {
  fileUniqueName = refIdGenerator().split('-')[0];
  dirs = RNFetchBlob.fs.dirs;
  dirsPathName = `${this.dirs.DownloadDir}/paraph/create-document-encrypted/`;
  fileInfo = null;
  file = null;
  selectedContacts = [];
  initiatorSSOID = null;
  expireTime = null;
  description = '';
  code = '';
  title = '';
  isCertificateChecked = false;
  isDraft = false;
  draftId = null;
  isNamadCertificateChecked = false;

  constructor(
    fileInfo,
    file,
    selectedContacts,
    initiatorSSOID,
    expireTime,
    description,
    code,
    title,
    isCertificateChecked,
    isDraft,
    draftId,
    isNamadCertificateChecked,
  ) {
    this.fileInfo = fileInfo;
    this.file = file;
    this.selectedContacts = selectedContacts;
    this.initiatorSSOID = initiatorSSOID;
    this.expireTime = expireTime;
    this.description = description;
    this.code = code;
    this.title = title;
    this.isCertificateChecked = isCertificateChecked;
    this.isDraft = isDraft;
    this.draftId = draftId;
    this.isNamadCertificateChecked = isNamadCertificateChecked;
  }

  getPath() {
    return `${this.dirsPathName}${this.fileInfo.title.split('.').join('-')}${
      this.fileUniqueName
    }-upload.enc`;
  }

  getDirectoryPath() {
    return this.dirsPathName;
  }

  normalizeToTimestamp(date) {
    if (typeof date !== 'number') {
      return this.normalizeDate(date);
    } else {
      return this.normalizeDate(new Date(date));
    }
  }

  normalizeDate(date) {
    debugLogger('date', date);
    return date.setHours(23, 59, 59);
  }

  navigate(path, params) {
    navigate(path, params);
  }

  async checkStoragePermission() {
    const {granted, readGranted, writeGranted} = await getStoragePermission();

    if (!readGranted || !writeGranted) {
      await logService(
        'error',
        `cannot get permission for download from podSpace`,
      );

      deniedPermissionAlert();

      return false;
    }
    return true;
  }

  async generateFileData() {
    try {
      const base_64 = this.isDraft
        ? this.file
        : await this.generateBase64(this.file);

      const hashResult = await this.generateHashFile(base_64);
      const arrayBuffer = await decode(base_64);

      return Promise.resolve({
        base64: base_64,
        arrayBuffer,
        hashResult,
      });
    } catch (error) {
      debugLogger('error in generateFileData:', error);
      return Promise.reject(error);
    }
  }

  async generateBase64(_file) {
    const destPath = `${RNFS.TemporaryDirectoryPath}/${_file.name}`;
    await RNFS.copyFile(_file.uri, destPath);
    let base_64 = null;

    const stat = await RNFS.stat(destPath).then(res => {
      return res;
    });

    await RNFS.readFile(stat.path, 'base64').then(result => {
      base_64 = result;
    });

    return base_64;
  }

  async generateHashFile(base64) {
    return await buildHash(base64);
  }

  async buildContractSignerDtoList(contacts, arrayBuffer, hash) {
    try {
      let contractSignerDtoList = [];
      if (contacts) {
        for (let index = 0; index < contacts.length; index++) {
          const element = contacts[index];
          let order = element?.order;
          let SSOID = element?.ssoId;
          let link = await this.buildResourceLink(SSOID, arrayBuffer, hash);

          contractSignerDtoList.push({
            resourceLink: link,
            order: order ? order : 1,
            level: 3,
            Base64IV: CONTRACT_IV,
            fileName: this.fileInfo.title,
            signerDto: {
              SSOId: SSOID,
            },
          });
        }
      }

      return Promise.resolve(contractSignerDtoList);
    } catch (error) {
      debugLogger('error in buildContractSignerDtoList: ', error);
      return Promise.reject(error);
    }
  }

  async buildContractDto(hash, arrayBuffer) {
    try {
      let link = await this.buildDownloadLink(arrayBuffer, hash);
      let checkedToDate = null;

      if (this.expireTime === null) {
        checkedToDate = this.normalizeToTimestamp(
          new Date().getTime() + 24 * 365 * 10 * 60 * 60 * 1000,
        );
      } else {
        if (this.expireTime?._d) {
          checkedToDate = this.normalizeToTimestamp(this.expireTime._d);
        } else {
          checkedToDate = this.normalizeToTimestamp(this.expireTime);
        }
      }

      return Promise.resolve({
        id: null,
        hash: hash,
        initiatorEncryptionBase64IV: CONTRACT_IV,
        initiatorSSOId: this.initiatorSSOID,
        initiatorDownloadLink: link,
        description: this.description,
        code: this.code,
        title: this.title,
        fromDate: Date.now(),
        toDate: checkedToDate,
        version: 2,
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async buildDownloadLink(arrayBuffer, hash) {
    try {
      let hashFile = (
        await this.buildHashFile(this.initiatorSSOID, arrayBuffer, hash)
      ).hash;
      let shareHash = await shareFileService({
        fileHash: hashFile,
        person: this.initiatorSSOID,
      });

      return `${POD_SPACE_UPLOAD_FILE_LINK}${
        shareHash ? shareHash.data.entity.hash : 'link'
      }`;
    } catch (error) {
      return Promise.rject(error);
    }
  }

  async buildHashFile(ssoId, arrayBuffer, hash) {
    try {
      const secretKeyResponse = await this.getUserSecretKey({
        ssoIdList: [ssoId],
        hash: hash,
      });

      const secretKey =
        secretKeyResponse &&
        secretKeyResponse.data &&
        secretKeyResponse.data[0].secretKey;

      if (secretKey) {
        let uploadHashResponse = await getPodspaceUploadHashService();

        const uploadHash =
          uploadHashResponse &&
          uploadHashResponse.data &&
          uploadHashResponse.data.result &&
          uploadHashResponse.data.result.uploadHash &&
          uploadHashResponse.data.result.uploadHash;

        const encryptedFile = await this.encryptHandler(arrayBuffer, secretKey);
        debugLogger(encryptedFile.encrypted);

        if (uploadHash && encryptedFile) {
          let uploadFileResponse = await uploadFileService({
            postData: encryptedFile.encrypted,
            fileName: this.fileInfo.title,
            uploadHash,
          });

          return uploadFileResponse.data;
        }
      }
    } catch (error) {
      debugLogger('error in buildHashFile: ', error);
      return Promise.reject(error);
    }
  }

  async getUserSecretKey(postData) {
    return Promise.resolve(getSecretKeyByContractIdService(postData));
  }

  async buildResourceLink(userSSOID, arrayBuffer, hash) {
    try {
      let hashFileResponse = (
        await this.buildHashFile(userSSOID, arrayBuffer, hash)
      ).hash;

      let shareHash = await shareFileService({
        fileHash: hashFileResponse,
        person: userSSOID,
      });

      return `${POD_SPACE_UPLOAD_FILE_LINK}${
        shareHash ? shareHash.data.entity.hash : 'link'
      }`;
    } catch (error) {
      debugLogger('error in buildResourceLink', error);
      return Promise.reject(error);
    }
  }

  async getContractInitiatorInfo(_ssoId) {
    try {
      const response = await getUserProfileService(_ssoId);
      const data = response && response.data;

      return Promise.resolve(data);
    } catch (error) {
      debugLogger('getContractInitiatorInfo error:', error);
      return Promise.reject(error);
    }
  }

  async getContractStatesHandler() {
    try {
      const response = await getContractStatesService();
      const data = response && response.data;

      return Promise.resolve(data);
    } catch (error) {
      debugLogger('error in getContractStatesHandler:', error);
      return Promise.reject(error);
    }
  }

  async encryptHandler(fileData, secretKey) {
    try {
      const key = CryptoES.enc.Base64.parse(secretKey);
      const iv = CryptoES.enc.Utf8.parse('Fanap___Contract');
      const wordArray = CryptoES.lib.WordArray.create(fileData);

      const encrypted = CryptoES.AES.encrypt(wordArray, key, {
        iv: iv,
      });

      let fileEncrypted = new Blob([encrypted.toString()]);

      const path = this.getPath();

      let encFile = null;

      encFile = await this.writeEncryptedFile(
        this.getDirectoryPath(),
        path,
        encrypted.toString(),
      );

      return {encrypted: encFile, fileUri: ''};
    } catch (error) {
      debugLogger('error in encryptHandler:', error);
      throw error;
    }
  }

  async writeEncryptedFile(folderPath, filePath, fileData) {
    const isDir = await RNFetchBlob.fs.isDir(folderPath);
    if (isDir) {
      await RNFS.writeFile(filePath, fileData);

      return {
        name: 'file',
        filename: this.fileInfo.title,
        data: RNFetchBlob.wrap(filePath),
      };
    }
    await RNFS.mkdir(this.getDirectoryPath());

    return this.writeEncryptedFile(folderPath, filePath, fileData);
  }

  async deleteFiles(filepath) {
    let exists = await RNFS.exists(filepath);
    if (exists) {
      // exists call delete
      await RNFS.unlink(filepath);
      debugLogger('File Deleted');
    } else {
      debugLogger('File Not Available');
    }
  }

  setOrderSelectedContacts() {
    return (
      this.selectedContacts &&
      this.selectedContacts.length > 0 &&
      this.selectedContacts.map(el => ({...el, order: el.order || 1}))
    );
  }

  async createSuccessfullyCallback(finalResult) {
    const userContactInfo = await this.getUserContactInfo();
    const userSSOID = Number(userContactInfo.id);

    const {contractStateDTOs, contract, signer} = await loadContract(
      finalResult.data.id,
      userSSOID,
    );

    const initiatorInfo = await this.getContractInitiatorInfo(
      finalResult.data.initiatorSSOId,
    );

    const states = await this.getContractStatesHandler();

    if (contractStateDTOs && contract && signer && initiatorInfo && states) {
      this.navigateToCreatedDocumentReceiptScreen({
        data: contract,
        contractStateDTOs,
        states,
        initiatorInfo,
        signer,
      });
    }
  }

  navigateToCreatedDocumentReceiptScreen(params) {
    if (this.draftId) {
      return this.createSuccessfullyByDraftNavigate(params);
    }
    return this.createSuccessfullyByNavigate(params);
  }

  async getUserContactInfo() {
    return await getAsyncStorage('object', keyStorage.CONTACT_INFO);
  }

  createSuccessfullyByDraftNavigate(params) {
    this.navigate(routesName.CREATE_CONTRACT, {
      screen: routesName.CREATE_CONTRACT_SUCCESSFULLY,
      params,
    });
  }

  createSuccessfullyByNavigate(params) {
    this.navigate(routesName.CREATE_CONTRACT_SUCCESSFULLY, params);
  }

  async createDocument() {
    const path = this.getPath();

    try {
      const isStorageAccess = await this.checkStoragePermission();

      if (!isStorageAccess) return;

      if (this.file) {
        const {base64, arrayBuffer, hashResult} = await this.generateFileData();

        if (arrayBuffer) {
          if (hashResult) {
            const normalizedContacts = this.setOrderSelectedContacts();

            let contractSignerDtoList = await this.buildContractSignerDtoList(
              normalizedContacts,
              arrayBuffer,
              hashResult,
            );

            if (contractSignerDtoList) {
              debugLogger('contractSignerDtoList', contractSignerDtoList);

              const contractDto = await this.buildContractDto(
                hashResult,
                arrayBuffer,
              );

              debugLogger('contractDto', contractDto);

              if (contractDto) {
                const templateID = null;

                const finalResult = await addContractService({
                  ...(templateID && {templateId: templateID}),
                  contractDto: {
                    ...contractDto,
                    ...(this.isCertificateChecked && {
                      risheForced: this.isCertificateChecked,
                    }),
                    ...(this.isNamadCertificateChecked && {
                      namadForced: this.isNamadCertificateChecked,
                    }),
                  },
                  contractSignerDtoList,
                  ...(this.draftId && {draftId: this.draftId}),
                });

                if (finalResult) {
                  await this.createSuccessfullyCallback(finalResult);
                }
              }
            }
          }
        }
      }
      await this.deleteFiles(path);
    } catch (error) {
      return await this.createDocumentErrorCallback(error, path);
    }
  }

  async createDocumentErrorCallback(error, path) {
    if (error) {
      const data = error?.data?.errorMessage;

      if (data) {
        Toast.showToast('danger', 'سند', data?.toString());
      }
    }

    debugLogger('error in createDocumentErrorCallback:', error);
    await this.deleteFiles(path);

    return Promise.reject(error);
  }
}

export default DocumentCreator;
