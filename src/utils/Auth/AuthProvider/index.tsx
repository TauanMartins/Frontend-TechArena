import React, {useEffect, useState} from 'react';
import {useColorScheme, Alert} from 'react-native';
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
import {UserDecoded} from '../../Model/Token';
import {UnauthenticatedUser, User} from '../../Model/User';
import {AuthContext} from '../../Auth/AuthContext';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {ThemeContext} from '../../Theme/ThemeContext';
import API from '../../API';
import {getComplementarData} from '../../UserUtils';
import {
  changeTheme,
  changeThemeFirstScreen,
  saveTheme,
} from '../../Theme/ThemeUtils';

const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [user, setUser] = useState<User>(UnauthenticatedUser);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theme, setTheme] = useState(null);
  const deviceTheme = useColorScheme();

  const verifyAuthentication = async () => {
    let dt_birth: string, gender: string;
    const accessToken = await getAccessToken();
    const refreshToken = await getRefreshToken();
    if (accessToken && refreshToken) {
      let isValid = isTokenValid(accessToken);
      if (isValid && !isAuthenticated) {
        console.log('É válido...');
        ({dt_birth, gender} = await getComplementarData());
        await registerLogin(accessToken, refreshToken, {dt_birth, gender});
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
      ({age, dt_birth, gender} = await getComplementarData());
    } catch (error) {
      return;
    }
    if (age < 18) {
      logout();
      throw new Error('Você não possui idade suficiente :(');
    }
    registerLogin(userInfo.idToken, userInfo.serverAuthCode, {
      dt_birth,
      gender,
    });
  };

  const refreshLogin = async () => {
    let userInfo: UserDecoded, dt_birth: string, gender: string;
    try {
      await GoogleSignin.hasPlayServices();
      userInfo = (await GoogleSignin.signInSilently()) as UserDecoded;
      ({dt_birth, gender} = await getComplementarData());
    } catch (error: any) {
      logout();
    }
    registerLogin(userInfo.idToken, userInfo.serverAuthCode, {
      dt_birth,
      gender,
    });
  };

  const registerLogin = async (
    idToken: UserDecoded['idToken'],
    serverAuthCode: UserDecoded['serverAuthCode'],
    complementarData: {dt_birth: User['dt_birth']; gender: User['gender']},
  ) => {
    console.log('Autenticado, logando...');
    try {
      const userData = decodeAccessToken(idToken);
      const {
        data: {
          preferences: {prefered_theme},
          user,
        },
      } = await API.$users.user_info({
        idToken: idToken,
        dt_birth: complementarData.dt_birth,
        gender: complementarData.gender,
      }); // get user data like prefered_theme
      changeTheme(null, prefered_theme, theme, setTheme, deviceTheme);
      setUser({
        ...userData,
        dt_birth: complementarData.dt_birth,
        gender: complementarData.gender,
        prefered_theme: prefered_theme,
      });
      setIsAuthenticated(true);
      saveAccessToken(idToken);
      saveRefreshToken(serverAuthCode);
    } catch (error) {
      Alert.alert('Sentimos muito!', 'Falha ao estabelecer conexão!');
      logout();
    }
  };

  const logout = async () => {
    console.log('Não autenticado, deslogando...');
    setIsAuthenticated(false);
    clearAccessToken();
    clearRefreshToken();
    setUser(UnauthenticatedUser);
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
      value={{theme, setTheme, changeThemeFirstScreen, changeTheme, saveTheme}}>
      <AuthContext.Provider
        value={{user, setUser, isAuthenticated, login, logout}}>
        {children}
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
};

export {AuthProvider};
