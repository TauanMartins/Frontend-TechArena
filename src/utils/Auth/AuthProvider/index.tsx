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
    console.log("Verificando...")
    const accessToken = await getAccessToken();
    const refreshToken = await getRefreshToken();
    if (accessToken && refreshToken) {
      let isValid = isTokenValid(accessToken);
      if (isValid && user.permission === 'G') {
        console.log("É válido...")
        registerLogin(accessToken, refreshToken);
      } else if (!isValid) {
        console.log("Não é válido...")
        refreshLogin();
      }
    }
  };

  const login = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = (await GoogleSignin.signIn().then(response => {
        return response;
      })) as Token;
      registerLogin(userInfo.idToken, userInfo.serverAuthCode);
    } catch (error: any) {
      throw new Error(`Desculpe, não foi possível concluir o login :(\n ${error} \nRequester: ${user.azp}`);
    }
  };

  const refreshLogin = async () => {
    console.log('RefreshLogin')
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = (await GoogleSignin.signInSilently().then(response => {
        return response;
      })) as Token;
      registerLogin(userInfo.idToken, userInfo.serverAuthCode);
    } catch (error: any) {
      logout();
      throw new Error(`Desculpe, não foi possível concluir o login :(\n ${error}`);
    }
  };

  const registerLogin = (accessToken: Token['idToken'], refreshToken: Token['serverAuthCode']) => {
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
      console.log('Entrou aqui')
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
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
