import {refreshTokenService} from '../apis';
import * as keyStorage from '../constants/keyStorage';
import {getAsyncStorage} from './asyncStorage';
import debugLogger from './debugLogger';

export default async () => {
  try {
    const expiresTokenTime = await getAsyncStorage(
      'object',
      keyStorage.EXPIRES_TOKEN_TIME,
    );

    const date = new Date(new Date(expiresTokenTime.date).getTime());
    date.setSeconds(expiresTokenTime.data);

    const now = new Date().getTime();
    const expireTime = new Date(date).getTime();

    if (now >= expireTime) {
      debugLogger('status 403 Forbidden: need access_token');

      return await getRefreshToken();
    }
    return true;
  } catch (error) {}
};

const getRefreshToken = async () => {
  try {
    const refreshToken = await getAsyncStorage(
      'text',
      keyStorage.REFRESH_TOKEN,
    );

    let params = {
      refresh_token: refreshToken,
    };

    await refreshTokenService(params);

    // const refreshData = await fetch(
    //   `${RAD_SERVER_URL}api/cms/users/refresh_token?${convertJsonToQueryString(
    //     {
    //       keyId: keyId,
    //       businessClientId: CLIENT_ID,
    //       refresh_token: refreshToken,
    //     },
    //   )}`,
    //   {
    //     method: 'POST',
    //     body: params,
    //   },
    // )
    //   .then(res => res.json())
    //   .then(data => data.result);
    //
    // await setAsyncStorage(
    //   'text',
    //   keyStorage.ACCESS_TOKEN,
    //   refreshData.access_token,
    // );
    // await setAsyncStorage(
    //   'text',
    //   keyStorage.REFRESH_TOKEN,
    //   refreshData.refresh_token,
    // );
    // await setAsyncStorage('object', keyStorage.EXPIRES_TOKEN_TIME, {
    //   data: refreshData.expires_in,
    //   date: new Date().getTime(),
    // });
  } catch (error) {
    debugLogger(error);
    return Promise.reject(error);
  }
};
