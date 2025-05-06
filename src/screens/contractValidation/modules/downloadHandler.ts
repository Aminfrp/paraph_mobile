import RNFetchBlob from 'rn-fetch-blob';
import isStoragePermissionValid from '../../../modules/permissions/storage/isStoragePermissionValid';
import {RnFetchBlobStatModel} from '../../../model/rnFetchBlobStat.model';
import {Logger} from '../../../modules/log/logger';

export const downloadLocalFile = async (uri: string) => {
  try {
    const isPermission: boolean = await isStoragePermissionValid(
      `cannot get permission for saving file`,
    );

    if (isPermission) {
      const fileStatObj: RnFetchBlobStatModel = await RNFetchBlob.fs.stat(uri);

      const path = fileStatObj.path;

      if (path) {
        await RNFetchBlob.android.actionViewIntent(path, 'application/pdf');
      }
    }

    // await RNFetchBlob.fs
    //   .stat(uri)
    //   .then(stats => stats.path)
    //   .then(path => {
    //     setTimeout(
    //       () => RNFetchBlob.android.actionViewIntent(path, 'application/pdf'),
    //       300,
    //     );
    //   });
  } catch (error: any) {
    Logger.debugLogger(error);
  }
};
