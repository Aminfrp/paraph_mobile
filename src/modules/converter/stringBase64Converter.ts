import {decode, encode} from './bufferConverter';

export function ab2str(buf: ArrayBuffer) {
  // @ts-ignore
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}
export function str2ab(str: any) {
  let buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  let bufView = new Uint16Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

export const str2base64 = (str: string) => encode(str2ab(str));

// @ts-ignore
export const base642str = (base64: string) => decode(str2ab(base64));
