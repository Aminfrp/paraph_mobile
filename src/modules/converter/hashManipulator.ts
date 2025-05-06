import CryptoES from 'crypto-es';

export const buildHash = async (base64: string) => {
  try {
    const hash = CryptoES.SHA256(base64);

    return Promise.resolve(hash.toString());
  } catch (error) {
    throw error;
  }
};
