import refIdGenerator from '../../../helpers/refIdGenerator';
import {logService} from '../../../apis';

export default async (type: string, message: string | unknown) => {
  try {
    const refId = refIdGenerator();
    return Promise.resolve(await logService('info', {message, refId}));
  } catch (error) {}
};
