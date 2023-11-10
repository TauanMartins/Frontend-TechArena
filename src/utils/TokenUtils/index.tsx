import jwt_decode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tokens } from '../Model/Token';
import { User } from '../Model/User';

// Funções de mais alto nível, serão utilizadas para trazer, salvar ou remover o token.
// Além da função de verificação de token válido.
export const saveIdToken = (token: Tokens['idToken']) => {
  setCookie('idToken', token);
};

export const getIdToken = async () => {
  const token = await getCookie('idToken');
  return token;
};

export const clearIdToken = async () => {
  await deleteCookie('idToken');
};

export const decodeIdToken = (idToken: Tokens['idToken']) => {
  const decodedToken = jwt_decode(idToken) as User;
  return decodedToken;
};

export const isTokenValid = (token: Tokens['idToken']) => {
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
