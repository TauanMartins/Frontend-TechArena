import jwt_decode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Token } from '../Model/Token';
import { User } from '../Model/User';

// Funções de mais alto nível, serão utilizadas para trazer, salvar ou remover o token.
// Além da função de verificação de token válido.
export const saveAccessToken = (token: Token["accessToken"]) => {
  setCookie('accessToken', token);
};

export const getAccessToken = async () => {
  const token = await getCookie('accessToken');
  return token;
};

export const clearAccessToken = () => {
  deleteCookie('accessToken');
};

export const saveRefreshToken = (token: Token["refreshToken"]) => {
  setCookie('refreshToken', token);
};

export const getRefreshToken = async () => {
  const token = await getCookie('refreshToken');
  return token;
};

export const clearRefreshToken = () => {
  deleteCookie('refreshToken');
};

export const decodeAccessToken = (accessToken: string) => {
  const decodedToken = jwt_decode(accessToken) as User;
  const { name, exp } = decodedToken;
  return { name, exp, permission: 'GU' };
};

export const isTokenValid = (token: string) => {
  const decodedToken = jwt_decode(token) as User;
  const tokenTime = decodedToken.exp;
  const now = Date.now() / 1000;
  return tokenTime > now;
};

// Funções mais primitivas, mexem com o cookie diretamente
export const setCookie = async (key: string, value: string) => {
  await AsyncStorage.setItem(key, value);
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
