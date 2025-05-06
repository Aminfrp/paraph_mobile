import RNFetchBlob from 'rn-fetch-blob';
import * as RNFS from 'react-native-fs';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {deniedPermissionAlert} from './utils';
import logService from '../apis/services/log';
import {getPersianDate} from './date';
import {getContractStatusBadgeText} from '../modules/dataNormalizers/contractStatusBadge';
import getStoragePermission from '../modules/permissions/storage/getStoragePermission';
import getSignerFullName from '../modules/dataNormalizers/getSignerFullName';
import {toPersianDigits} from './convertNumber';
import debugLogger from './debugLogger';

export default async (
  fileName,
  fileData,
  signers,
  user,
  initiatorInfo,
  failureCbFn,
  states,
) => {
  try {
    const {granted, readGranted, writeGranted} = await getStoragePermission();

    if (!readGranted || !writeGranted) {
      await logService('error', `cannot get permission for saving file`);

      deniedPermissionAlert();

      await failureCbFn({
        message: 'You need to give storage permission to save the file',
      });
      return;
    }

    const contractData = {
      ...fileData,
      contractDto: {
        ...fileData.contractDto,
        description:
          fileData.contractDto.description !== null
            ? fileData.contractDto.description
            : '',
      },
    };

    const normalizedContractStateDTOs =
      signers &&
      signers.length > 0 &&
      signers.map(i => {
        if (i.contractStateType === 'SIGNED') {
          return {
            ...i,
            stateMessage: '',
          };
        }
        return {
          ...i,
          stateMessage: i.stateMessage !== null ? i.stateMessage : '',
        };
      });

    await openPdf(
      fileName,
      contractData,
      normalizedContractStateDTOs,
      user,
      initiatorInfo,
      states,
    );

    return Promise.resolve();
  } catch (error) {
    await logService('error', `error in saveReceiptToFile Method: ${error}`);

    debugLogger('decryptFile error:', error);

    return Promise.reject(error);
  }
};

export const generateReceiptFileSharing = async (
  fileName,
  fileData,
  signers,
  user,
  initiatorInfo,
  states,
) => {
  try {
    const contractData = {
      ...fileData,
      contractDto: {
        ...fileData.contractDto,
        description:
          fileData.contractDto.description !== null
            ? fileData.contractDto.description
            : '',
      },
    };

    const normalizedContractStateDTOs =
      signers &&
      signers.length > 0 &&
      signers.map(i => {
        if (i.contractStateType === 'SIGNED') {
          return {
            ...i,
            stateMessage: '',
          };
        }
        return {
          ...i,
          stateMessage: i.stateMessage !== null ? i.stateMessage : '',
        };
      });

    const pdf = await renderPdf(
      fileName,
      contractData,
      normalizedContractStateDTOs,
      user,
      initiatorInfo,
      states,
    );

    return Promise.resolve(pdf);
  } catch (error) {
    return Promise.reject(error);
  }
};

const openPdf = async (
  fileName,
  fileData,
  signers,
  user,
  initiatorInfo,
  states,
) => {
  try {
    const existFile = await checkFileInMemory(`${fileName}-receipt`);

    if (existFile) {
      await RNFetchBlob.android.actionViewIntent(
        `${fileName}-receipt`,
        'application/pdf',
      );

      return Promise.resolve();
    } else {
      const {htmlContent, filename} = await renderPdf(
        fileName,
        fileData,
        signers,
        user,
        initiatorInfo,
        states,
      );

      let options = {
        html: htmlContent,
        fileName: filename + Math.random() * 10,
        directory: 'Download',
      };

      let file = await RNHTMLtoPDF.convert(options);

      await RNFetchBlob.android.actionViewIntent(
        file.filePath,
        'application/pdf',
      );

      return Promise.resolve();
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

export const checkFileInMemory = async fileName => {
  let dirs = RNFetchBlob.fs.dirs;
  const encryptedFileName = fileName;

  if (encryptedFileName) {
    return await RNFS.exists(`${dirs.DownloadDir}/${encryptedFileName}.pdf`);
  }
  return false;
};

export const renderPdf = async (
  fileName,
  fileData,
  signers,
  user,
  initiatorInfo,
  states,
) => {
  try {
    let htmlContent = `<header >
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed #219776; padding-bottom: 10px">
          <div>
            <div><span style="font-size:19px; color: #219776">Filename:</span> <span style="font-size:18px;  color: #7F7F7F">${fileName}.pdf</span></div>
            <div><span style="font-size:19px; color: #219776">Hash:</span>  <span style="font-size:18px;  color: #7F7F7F">${
              fileData.contractDto.hash
            }</span></div>
          </div>
          <div style="font-size:18px;  color: #7F7F7F">${
            getPersianDate(new Date().getTime()).date
          }</div>
        </div>
        </header>
        <section  >
          <p style="text-align: center; font-size: 18px;">جزییات سند</p>
           <h2 style="text-align: center; font-weight: 800; direction: rtl">
             <span>${fileData.contractDto.title}</span>
          </h2>
          <div style="display: flex; flex-direction:row-reverse; justify-content: space-around; align-items: center">
          <div style="display: flex; flex-direction: column; justify-content: center; align-items: center">
            <p style="font-size: 18px;">شماره سند</p>
            <p>${toPersianDigits(fileData.contractDto.code)}</p>
          </div>
          <div style="display: flex; flex-direction: column; justify-content: center; align-items: center">
            <p style="font-size: 18px;">ایجاد کننده</p>
            <p>${getSignerFullName(initiatorInfo)}</p>
          </div>
          <div style="display: flex; flex-direction: column; justify-content: center; align-items: center">
            <p style="font-size: 18px;">تاریخ</p>
            <p>${getPersianDate(fileData.contractDto.fromDate).date}</p>
          </div>
          </div>
        </section>
        <div style="text-align:right; padding: 15px 05px; background-color:#219776; color: #ffffff; font-size: 24px;"> امضا کنندگان</div>

`;

    const sign = item => {
      if (item.sign) {
        return `
                  <div style="padding-bottom: 10px">
              <p style="text-align: right">امضا:</p>
              <p>${item.sign}</p>
            </div>
      `;
      } else {
        return `<div></div>`;
      }
    };

    const list = await signers
      ?.map(item => {
        return `
      <div style=" border-bottom: 1px dashed #219776;">

        <div style="display: flex; flex-direction: row-reverse; justify-content: space-between; align-items: center; ">
        <div style="display: flex; flex-direction: row-reverse; justify-content: space-between; align-items: center">
          <h3 style="padding-left: 10px">
            :${getSignerFullName(item.user)}
          </h3>
          <h6 style="font-size: 18px;">${getContractStatusBadgeText(
            item.contractStateType,
            states,
          )}</h6>
 
        </div>
        <div style="font-size: 18px;">
          ${
            getPersianDate(item.submitTime).date
          } <span style="padding-left: 10px">تاریخ</span>
        </div>
        </div>
            <div style="display: flex; flex-direction: row-reverse; justify-content: flex-start; align-items: center">
              <h3 style="padding-left: 10px">:توضیحات</h3>
              <h6 style="font-size: 18px;">${item.stateMessage}</h6>
            </div>
      </div>`;
      })
      .join(' ');

    htmlContent += list;

    htmlContent += `
    <div style="text-align:right; margin-top:50px; padding: 15px 05px; background-color:#7400B8; color: #ffffff; font-size: 24px;">توضیحات</div>
    <div style="text-align:right; font-size: 18px; margin-top: 25px">${fileData.contractDto.description}</div>
`;

    return Promise.resolve({htmlContent, filename: fileName});
  } catch (error) {
    return Promise.reject(error);
  }
};
