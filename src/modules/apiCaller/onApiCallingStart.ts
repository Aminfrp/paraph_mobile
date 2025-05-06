import {log, LOG_TYPES_ENUM} from '../log';

export default (innate: string, params?: any) => {
  const logTitle = innate + '-START';

  log(JSON.stringify(params), LOG_TYPES_ENUM.INFO, logTitle);
};
