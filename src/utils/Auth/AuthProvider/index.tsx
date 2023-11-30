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
import { Localization, standardLocalization } from '../../Model/Localization';

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(UnauthenticatedUser);
  const [localization, setLocalization] = useState<Localization>(Localization);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theme, setTheme] = useState(null);
  const [loading, setLoading] = useState(false);
  const deviceTheme = useColorScheme();

  const verifyAuthentication = async () => {
    let dt_birth: string, gender: string;
    const idToken = await getIdToken();
    if (idToken) {
      let isValid = isTokenValid(idToken);
      try {
        if (isValid && !isAuthenticated) {          
          console.log('É válido...');
          setLoading(true);
          try {
            ({ dt_birth, gender } = await getComplementarData());
          } catch (error: any) {
            throw new Error('Falha ao carregar dados do Google.')
          }
          registerLogin(idToken, { dt_birth, gender });
        } else if (!isValid) {
          console.log('Não é válido...');

          setLoading(true);
          await refreshLogin();
        }
      } catch (error) {
        setLoading(false);
        await logout();
        Alert.alert('Sentimos muito!', `${error.message}`);
      }
    }
  };

  const login = async () => {
    let userInfo: UserDecoded, dt_birth: string, gender: string, age: number;
    try {
      try {
        await GoogleSignin.hasPlayServices();
        userInfo = (await GoogleSignin.signIn()) as UserDecoded;
        ({ age, dt_birth, gender } = await getComplementarData());
      } catch (error: any) {
        throw new Error('Falha ao carregar dados do Google. 😞')
      }

      if (age < 18) {
        throw new Error('Você não possui idade suficiente 😞');
      }
      registerLogin(userInfo.idToken, { dt_birth, gender });
    } catch (error) {
      logout();
      Alert.alert('Sentimos muito!', `\n${error.message}`);
    }
  };

  const refreshLogin = async () => {
    let userInfo: UserDecoded, dt_birth: string, gender: string, age: number;
    try {
      try {
        await GoogleSignin.hasPlayServices();
        userInfo = (await GoogleSignin.signInSilently()) as UserDecoded;
        ({ age, dt_birth, gender } = await getComplementarData());
      } catch (error: any) {
        throw new Error('Falha ao carregar dados do Google. 😞')
      }
      registerLogin(userInfo.idToken, { dt_birth, gender });
    } catch (error: any) {
      throw new Error(error.message)
    }

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
      await changeTheme(null, prefered_theme, theme, setTheme, deviceTheme);
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
      throw new Error('Falha ao validar credenciais.')
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    console.log('Não autenticado, deslogando...');
    await clearIdToken();
    setIsAuthenticated(false);
    setUser(UnauthenticatedUser);
    setLocalization(standardLocalization)
    await GoogleSignin.signOut();
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
        value={{
          user, setUser, localization, setLocalization, isAuthenticated, login, logout, loading, setLoading
        }}>
        {children}
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
};

export { AuthProvider };
