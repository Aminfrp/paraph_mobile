import {isDevMode} from '../config/APIConfig';

export default (logText, logData) => {
  if (isDevMode) {
    if (logData) {
      console.log(logText, logData);
      return;
    }
    console.log(logText);
  }
};
