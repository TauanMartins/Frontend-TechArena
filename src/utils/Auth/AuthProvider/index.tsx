import React, {useEffect, useState} from 'react';
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
import {Token} from '../../Model/Token';
import {UnauthenticatedUser, User} from '../../Model/User';
import {AuthContext} from '../../Auth/AuthContext';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {GOOGLE_CLIENT_ID} from '../../Config';

const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [user, setUser] = useState<User>(UnauthenticatedUser);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const verifyIsLogged = async () => {
    const token = await getAccessToken();
    const refreshToken = await getRefreshToken();
    if (token) {
      let isValid = isTokenValid(token);
      if (isValid) {
        if (!isAuthenticated) {
          registerLogin(token);
        }
      } else {
        clearAccessToken();
      }
    } else {
      if (refreshToken) {
        let isValid = isTokenValid(refreshToken);
        if (isValid) {
          refreshLogin();
        } else {
          logout();
        }
      }
    }
  };

  const login = async () => {
    try {
      GoogleSignin.configure({
        webClientId: GOOGLE_CLIENT_ID,
      });
      await GoogleSignin.hasPlayServices();
      const userInfo = (await GoogleSignin.signIn().then(response => {
        return response;
      })) as Token;
      registerLogin(userInfo.idToken);
    } catch (error: any) {
      throw new Error(`Desculpe, não foi possível concluir o login :(\n ${error}` );
    }
  };

  const refreshLogin = async () => {
    try {
      GoogleSignin.configure({
        webClientId: GOOGLE_CLIENT_ID,
      });
      await GoogleSignin.hasPlayServices();
      const userInfo = (await GoogleSignin.signInSilently().then(response => {
        return response;
      })) as Token;
      registerLogin(userInfo.idToken);
    } catch (error: any) {
      throw new Error(`Desculpe, não foi possível concluir o login :(\n ${error}` );
    }
  };

  const registerLogin = (token: Token['idToken']) => {
    console.log('Autenticado, logando...');
    const userData = decodeAccessToken(token);
    setUser(userData); // TODO: implementar comunicação com o backend com o id do usuário e email
    saveAccessToken(token);
    saveRefreshToken(token);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    console.log('Não autenticado, deslogando...');
    setIsAuthenticated(false);
    setUser(UnauthenticatedUser);
    clearAccessToken();
    clearRefreshToken();
    if (isAuthenticated) {
      await GoogleSignin.revokeAccess(); // Revoke the access token
      await GoogleSignin.signOut(); // Sign out of Google
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
    <AuthContext.Provider value={{user, isAuthenticated, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};

export {AuthProvider};
