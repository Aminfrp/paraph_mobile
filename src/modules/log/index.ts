import {logService} from '../../apis';
import {isDevMode} from '../../config/APIConfig';
import debugLogger from '../../helpers/debugLogger';

export const LOG_TYPES_ENUM = {
  INFO: 'info',
  DEBUG: 'debug',
  WARN: 'warn',
  ERROR: 'error',
  LOG: 'log',
  DEVELOP: 'develop',

  getLogType: (input: string) => {
    for (let [key, value] of Object.entries(LOG_TYPES_ENUM)) {
      if (input === value) {
        return value;
      }
    }
    return false;
  },
};

export const log = (message: string, type = 'develop', source: any) => {
  const logType = {
    info: () =>
      console.info(`${source ? `source: ${source}\n` : ``}${message}`),
    debug: () =>
      console.debug(`${source ? `source: ${source}\n` : ``}${message}`),
    warn: () =>
      console.warn(`${source ? `source: ${source}\n` : ``}${message}`),
    error: () =>
      console.error(`${source ? `source: ${source}\n` : ``}${message}`),
    log: () => console.log(`${source ? `source: ${source}\n` : ``}${message}`),
    develop: () => {
      console.groupCollapsed(`*** Logger ***\n\n${message}`);
      console.trace();
      console.groupEnd();
    },
  };

  if (isDevMode) {
    // logType[type]();
    debugLogger(type, {source: source, message});
  }

  if (type !== 'develop')
    logService(type, {source: source, message})
      .then((r: any) => console.debug(`${r?.data?.message}`))
      .catch(() => console.debug(`log not submitted to the server...`));
};
