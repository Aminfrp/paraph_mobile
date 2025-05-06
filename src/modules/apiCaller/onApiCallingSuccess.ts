import {log, LOG_TYPES_ENUM} from '../log';

export default (info: any, innate: any) => {
  const dto = {
    params: info?.params,
    clientRefId: info?.refId,
    responseHeaders: info?.response?.headers,
    status: info?.response?.status,
  };
  log(JSON.stringify(dto), LOG_TYPES_ENUM.INFO, innate);
};
