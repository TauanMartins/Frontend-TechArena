import React, { useState, useEffect } from 'react';
import SplashScreen from './src/screens/Splash';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/utils/AuthContext';


const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      // Realizar alguma operação assíncrona
      // ...

      setLoading(false);
    })();

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
