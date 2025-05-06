import React from 'react';
import {SafeAreaView, useColorScheme} from 'react-native';

import {install} from 'react-native-quick-crypto';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import RootProvider from './src/context/provider';
import AppNavigator from './src/navigation';

const App: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={[backgroundStyle, {flex: 1}]}>
      <RootProvider>
        <AppNavigator />
      </RootProvider>
    </SafeAreaView>
  );
};

export default App;
