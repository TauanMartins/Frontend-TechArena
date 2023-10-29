import React, { useEffect, useState } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import {
  getAccessToken,
  clearAccessToken,
  saveAccessToken,
  decodeAccessToken,
  isTokenValid,
  saveRefreshToken,
  clearRefreshToken,
  getRefreshToken,
} from '../../TokenUtils';
import { Token } from '../../Model/Token';
import { UnauthenticatedUser, User } from '../../Model/User';
import { AuthContext } from '../../Auth/AuthContext';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Theme from '../../Theme';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import { ThemeContext } from '../../Theme/ThemeContext';

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(UnauthenticatedUser);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theme, setTheme] = useState(null);
  const deviceTheme = useColorScheme();

  const changeThemeFirstScreen = () => {
    const standardTheme = Theme['light'];
    const nextBarStyle = 'dark-content'; // Dark = letra da topBar preta
    changeNavigationBarColor(standardTheme.SECONDARY); // Secondary = Tema da barra de cima/baixo virará preto
    StatusBar.setBackgroundColor(standardTheme.PRIMARY); // Primary = Tema da barra de cima virará branco
    StatusBar.setBarStyle(nextBarStyle) // Tema da fonte da barra de cima
  }

  const changeTheme = (preferedTheme: User["prefered_theme"]) => {
    const nextTheme = preferedTheme ? Theme[preferedTheme] : Theme[deviceTheme];
    if (theme === nextTheme) {
      return;
    } else {
      const nextBarStyle = nextTheme === Theme['light'] ? 'dark-content' : 'light-content';
      setTheme(nextTheme) // Tema geral
      changeNavigationBarColor(nextTheme.PRIMARY, theme === Theme['light']); // Tema da barra de cima/baixo
      StatusBar.setBackgroundColor(nextTheme.PRIMARY); // Tema da barra de cima
      StatusBar.setBarStyle(nextBarStyle) // Tema da fonte da barra de cima
    }
  }

  const saveTheme = (preferedTheme: User["prefered_theme"]) => {
    const nameTheme = Theme[preferedTheme] === Theme['light'] ? 'light' : 'dark'
    setUser({ ...user, prefered_theme: nameTheme }) //TODO: implementar salvamento do tema
  }

  const verifyIsLogged = async () => {
    const accessToken = await getAccessToken();
    const refreshToken = await getRefreshToken();
    if (accessToken && refreshToken) {
      let isValid = isTokenValid(accessToken);
      if (isValid && !isAuthenticated) {
        console.log("É válido...")
        await registerLogin(accessToken, refreshToken);
      } else if (!isValid) {
        console.log("Não é válido...")
        refreshLogin();
      }
    }
  };

  const login = async () => {
    let userInfo: Token;
    try {
      await GoogleSignin.hasPlayServices();
      userInfo = await GoogleSignin.signIn() as Token;
    } catch (error) {
      return;
    }
    registerLogin(userInfo.idToken, userInfo.serverAuthCode);
  };

  const refreshLogin = async () => {
    let userInfo: Token;
    try {
      await GoogleSignin.hasPlayServices();
      userInfo = await GoogleSignin.signInSilently() as Token;
    } catch (error: any) {
      logout();
    }
    registerLogin(userInfo.idToken, userInfo.serverAuthCode);
  };

  const registerLogin = async (accessToken: Token['idToken'], refreshToken: Token['serverAuthCode']) => {
    console.log('Autenticado, logando...');
    const userData = decodeAccessToken(accessToken);
    // checar se o usuário possui um tema junto com outras informações a partir do endpoint POST /user
    changeTheme(null); // TODO: implementar comunicação com o backend com o id do usuário e email   
    setUser(userData); // TODO: implementar comunicação com o backend com o id do usuário e email    
    setIsAuthenticated(true);
    saveAccessToken(accessToken);
    saveRefreshToken(refreshToken);

  };

  const logout = async () => {
    console.log('Não autenticado, deslogando...');
    setIsAuthenticated(false);
    clearAccessToken();
    clearRefreshToken();
    setUser(UnauthenticatedUser);
    if (isAuthenticated) {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    }
  };

  useEffect(() => {
    verifyIsLogged();
    const checkTokenInterval = setInterval(() => {
      verifyIsLogged();
    }, 3000);
    return () => clearInterval(checkTokenInterval);
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      changeTheme(null)
    }
  }, [deviceTheme])
  return (
    <ThemeContext.Provider value={{ theme, changeThemeFirstScreen, changeTheme }}>
      <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
        {children}
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
};

export { AuthProvider };
