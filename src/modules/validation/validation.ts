import {SignerDto} from '../../model/contract.model.ts';

export const validNumberString = (value: string) =>
  value.match(/^[0-9]+$/) != null;

export const isPersianString = (string: string) => {
  const p = /^[\u0600-\u06FF\s]+$/;

  return p.test(string);
};

export const checkFirstOrderValid = (signers: SignerDto[]) => {
  return signers.length > 0 && signers.some(el => el.order === 1);
};

export const isEnglishCharacter = (string: string) => {
  const p = /^[A-Za-z]*$/;

  return p.test(string);
};

export const isEmail = (email: string) => {
  const p = /\S+@\S+\.\S+/;
  return p.test(email);
};

export const isPersian = (string: string) => {
  const persianRegex = /^[\u0600-\u06FF\s]+$/;

  return persianRegex.test(string);
};

export const isAddressValid = (string: string) => {
  if (!isPersian(string)) return false;
  const persianRegex = /[^\u0600-\u06FF\s]|[؛،؟]/g;

  return !persianRegex.test(string);
};

export const isNationalIdValid = (nationalId: string) => {
  const persianRegex = /^[0-9]{10}$/;

  return persianRegex.test(nationalId);
};
