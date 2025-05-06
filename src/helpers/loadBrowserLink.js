import {Linking} from 'react-native';

export default url => {
  Linking.openURL(url).catch(err =>
    console.error(`Couldn't load page ${url}`, err),
  );
};
