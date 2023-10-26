import React, { useEffect, useState } from 'react';
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

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(UnauthenticatedUser);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
