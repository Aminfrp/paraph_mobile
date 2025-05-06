import {log, LOG_TYPES_ENUM} from '../log';
import debugLogger from '../../helpers/debugLogger';

export default (respond: any, innate: any) => {
  const statusCode = respond?.error?.response?.status;

  if (!statusCode) return;

  if (statusCode === 403 || statusCode === 401) {
    debugLogger(respond);
  } else {
    const dto: any = {
      params: respond?.params,
      clientRefId: respond?.refId,
      responseHeaders: respond?.error?.response?.headers,
      message: respond?.error?.response?.data,
    };
    log(dto, LOG_TYPES_ENUM.DEBUG, innate);
    log(JSON.stringify(dto), LOG_TYPES_ENUM.ERROR, `ApiCall-${innate}`);
  }
};
