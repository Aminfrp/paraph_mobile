import {isDevMode} from '../../config/APIConfig';
import {logService} from '../../apis';

export class Logger {
  public static debugLogger(logText?: string, logData?: any) {
    if (isDevMode) {
      if (logData) {
        console.log(logText, logData);
        return;
      }
      console.log(logText);
    }
  }

  public static async serverDebugLogger(
    message: string,
    type = 'develop',
    source?: any,
  ) {
    if (isDevMode) {
      this.debugLogger(type, {source: source, message});
    }

    if (type !== 'develop') {
      logService(type, {source: source, message})
        .then((r: any) => this.debugLogger(`${r?.data?.message}`))
        .catch(() => this.debugLogger(`log not submitted to the server...`));
    }
  }
}
