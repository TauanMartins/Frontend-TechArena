import React, { useEffect, useState } from 'react';
import { useColorScheme, Alert } from 'react-native';
import {
  clearIdToken,
  decodeIdToken,
  getIdToken,
  isTokenValid,
  saveIdToken
} from '../../TokenUtils';
import { Tokens, UserDecoded } from '../../Model/Token';
import { UnauthenticatedUser, User } from '../../Model/User';
import { AuthContext } from '../../Auth/AuthContext';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { ThemeContext } from '../../Theme/ThemeContext';
import API from '../../API';
import { getComplementarData } from '../../UserUtils';
import {
  changeTheme,
  changeThemeFirstScreen,
  saveTheme,
} from '../../Theme/ThemeUtils';

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(UnauthenticatedUser);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theme, setTheme] = useState(null);
  const deviceTheme = useColorScheme();

  const verifyAuthentication = async () => {
    let dt_birth: string, gender: string;
    const idToken = await getIdToken();
    if (idToken) {
      let isValid = isTokenValid(idToken);
      if (isValid && !isAuthenticated) {
        console.log('É válido...');
        ({ dt_birth, gender } = await getComplementarData());
        await registerLogin(idToken, { dt_birth, gender });
      } else if (!isValid) {
        console.log('Não é válido...');
        refreshLogin();
      }
    }
  };

  const login = async () => {
    let userInfo: UserDecoded, dt_birth: string, gender: string, age: number;
    try {
      await GoogleSignin.hasPlayServices();
      userInfo = (await GoogleSignin.signIn()) as UserDecoded;
      ({ age, dt_birth, gender } = await getComplementarData());
    } catch (error) {
      logout();
      return;
    }
    if (age < 18) {
      logout();
      throw new Error('Você não possui idade suficiente :(');
    }
    registerLogin(userInfo.idToken, { dt_birth, gender });
  };

  const refreshLogin = async () => {
    let userInfo: UserDecoded, dt_birth: string, gender: string, age: number;
    try {
      await GoogleSignin.hasPlayServices();
      userInfo = (await GoogleSignin.signInSilently()) as UserDecoded;
      ({ age, dt_birth, gender } = await getComplementarData());
    } catch (error: any) {
      logout();
      Alert.alert('Sentimos muito!', `Falha ao reestabelecer conexão! \n${error}` );
    }
    registerLogin(userInfo.idToken, { dt_birth, gender });
  };

  const registerLogin = async (
    idToken: UserDecoded['idToken'],
    complementarData: { dt_birth: User['dt_birth']; gender: User['gender'] },
  ) => {
    console.log('Autenticado, logando...');
    try {
      const userData = decodeIdToken(idToken);
      const extendedUserData = { ...userData, idToken: idToken }
      const {
        data: {
          preferences: { prefered_theme },
          user: {
            permission,
            username
          },
        },
      } = await API.$users.user_info({
        idToken: idToken,
        dt_birth: complementarData.dt_birth,
        gender: complementarData.gender
      }); // get user data = prefered_theme, permission..
      changeTheme(null, prefered_theme, theme, setTheme, deviceTheme);
      setUser({
        ...extendedUserData,
        dt_birth: complementarData.dt_birth,
        gender: complementarData.gender,
        prefered_theme: prefered_theme,
        permission: permission,
        username: username
      });
      console.log(extendedUserData,
        complementarData.dt_birth,
        complementarData.gender,
        prefered_theme,
        permission,
        username)
      setIsAuthenticated(true);
      saveIdToken(idToken);
    } catch (error) {
      logout();      
      Alert.alert('Sentimos muito!', `Falha ao reestabelecer conexão! \n${error}` );
    }
  };

  const logout = async () => {
    console.log('Não autenticado, deslogando...');
    await clearIdToken();
    setUser(UnauthenticatedUser);
    await GoogleSignin.signOut();
    setIsAuthenticated(false);
  };

  useEffect(() => {
    verifyAuthentication();
    const checkTokenInterval = setInterval(() => {
      verifyAuthentication();
    }, 3000);
    return () => clearInterval(checkTokenInterval);
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      changeTheme(null, user.prefered_theme, theme, setTheme, deviceTheme);
    }
  }, [deviceTheme]);


  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, changeThemeFirstScreen, changeTheme, saveTheme }}>
      <AuthContext.Provider
        value={{ user, setUser, isAuthenticated, login, logout }}>
        {children}
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
};

export { AuthProvider };
