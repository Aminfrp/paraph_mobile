import ApiCaller from '../../helpers/axios';
import {BUSINESS_CODE, SERVER_URL} from '../../config/APIConfig';

import {getAsyncStorage} from '../../helpers/asyncStorage';
import * as keyStorage from '../../constants/keyStorage';
import debugLogger from '../../helpers/debugLogger';

export default async (type, message) => {
  try {
    const contactInfo = await getAsyncStorage(
      'object',
      keyStorage.CONTACT_INFO,
    );

    message.userInfo = contactInfo.username;

    const params = {
      logType: type,
      logMessage: JSON.stringify(message),
    };
    await fetchJSON(params);
  } catch (error) {
    debugLogger(error);
  }
};

const fetchJSON = postData => {
  const options = {
    headers: {
      'business-code': BUSINESS_CODE,
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
    needAccessToken: true,
  };

  return ApiCaller(options).post(`${SERVER_URL}api/log/mobile/`, postData);
};
