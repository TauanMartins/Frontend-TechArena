import jwt_decode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Token, User } from '../Auth/AuthContext';

// Funções de mais alto nível, serão utilizadas para trazer, salvar ou remover o token.
// Além da função de verificação de token válido.
export const saveToken = (token: Token) => {
  setCookie('token', token);
};

export const getToken = async () => {
  const token = await getCookie('token');
  return token;
};

export const clearToken = () => {
  deleteCookie('token');
};

export const decodeAccessToken = (accessToken: string) => {
  const decodedToken = jwt_decode(accessToken) as User;
  const { name, exp } = decodedToken;
  return { name, exp, permission: 'GU' };
};

export const isTokenValid = (token: string | null) => {
  if (token) {
    const decodedToken = jwt_decode(token) as User;
    const tokenTime = decodedToken?.exp;
    const now = Date.now() / 1000;
    return tokenTime > now; 
  } else {
    return false
  }
};

// Funções mais primitivas, mexem com o cookie diretamente
export const setCookie = async (key: string, value: Token) => {
  await AsyncStorage.setItem(key, value.accessToken);
};

export const getCookie = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (error) {
    return null;
  }
};

export const deleteCookie = async (key: string) => {
  await AsyncStorage.removeItem(key);
};
