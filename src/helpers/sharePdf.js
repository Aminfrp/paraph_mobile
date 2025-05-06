import sharePDF from 'react-native-share-pdf';

export default async (base64Data, documentFileName) => {
  try {
    await sharePDF(base64Data, documentFileName);

    return undefined;
  } catch (err) {
    return err;
  }
};
