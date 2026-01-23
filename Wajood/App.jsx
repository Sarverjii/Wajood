import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AuthStack from './src/navigation/AuthStack';
import AppStack from './src/navigation/AppStack';
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import Config from 'react-native-config';

import Toast from 'react-native-toast-message';

const AppContent = () => {
  console.log(`${Config.API_BASE_URL}/api/contacts/saved`);

  const { isAuthenticated } = React.useContext(AuthContext);
  if (isAuthenticated === null) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return isAuthenticated ? <AppStack /> : <AuthStack />;
};

const App = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <AuthProvider>
        <NavigationContainer>
          <AppContent />
          <Toast />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
