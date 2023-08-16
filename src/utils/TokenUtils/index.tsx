import jwt_decode, {JwtPayload} from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Funções de mais alto nível, serão utilizadas para trazer, salvar ou remover o token.
// Além da função de verificação de token válido.
export const saveToken = (token: string) => {
  setCookie('token', token);
};

export const getToken = async () => {
  const token = await getCookie('token');
  return token;
};

export const clearToken = () => {
  deleteCookie('token');
};

export const isTokenValid = (token: string) => {
  try {
    const decodedToken = jwt_decode<JwtPayload>(token);
    const now = Date.now() / 1000; // Obter o tempo atual em segundos
    return decodedToken.exp! > now; // Verificar se o token ainda é válido
  } catch (error) {
    return false;
  }
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
