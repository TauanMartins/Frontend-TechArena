import React, { useState, useEffect } from 'react';
import SplashScreen from './src/screens/Splash';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/utils/AuthContext';
import { useColorScheme } from 'react-native';


const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular um carregamento demorado
    setTimeout(() => {
      setLoading(false);
    }, 1000); // Tempo em milissegundos
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
};

export default App;
