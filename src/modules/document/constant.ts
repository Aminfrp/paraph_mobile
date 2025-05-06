import RNFetchBlob from 'rn-fetch-blob';
import refIdGenerator from '../../helpers/refIdGenerator';

const path: string = 'paraph/';

let dirs = RNFetchBlob.fs.dirs;
export const appFilesPath = `${dirs.DownloadDir}/${path}`;

export const getDraftUploadFilePath = (documentTitle: string): string =>
  appFilesPath +
  'draft/' +
  documentTitle +
  '-' +
  refIdGenerator().split('-')[0] +
  '.draft-document.pdf';

export const getDownloadFilePath = (fileName: string): string =>
  `${appFilesPath}download/${fileName}`;

export const getDownloadDirectoryPath = () => `${appFilesPath}download/`;

export const getCreateDocumentDirectoryPath = () =>
  `${appFilesPath}create-document-encrypted/`;
