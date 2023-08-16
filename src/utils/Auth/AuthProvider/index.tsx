import React, { useEffect, useState } from 'react';
import { getToken, clearToken, saveToken, decodeAccessToken, isTokenValid } from '../../TokenUtils';
import { AuthContext, User } from '../AuthContext';
import jwtDecode from 'jwt-decode';
import { tokenAPI } from '../../API';

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>({ permission: 'G', name: 'Convidado', exp: 0 });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const verifyIsLogged = async () => {
    const token = await getToken();
    const isValid = isTokenValid(token)    
    if (token && isValid) { 
      console.log('Autenticado, logando.')
      setIsAuthenticated(true);
      return true;
    } else {
      console.log('Não autenticado, deslogando.')
      logout();
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = password === '123' ? tokenAPI : (() => {
        throw new Error();
      })();
      const token = response;
      const userData = decodeAccessToken(token.accessToken)
      setIsAuthenticated(true);
      setUser(userData);
      saveToken(token);
      return token;
    } catch (error) {
      console.log(error)
      throw new Error('Erro ao autenticar usuário');
    }
  };

  const logout = () => {
    clearToken();
    setUser({ permission: 'G', name: 'Convidado', exp: 0 });
    setIsAuthenticated(false);
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
