import React, { useEffect, useState } from 'react';
import { getToken, clearToken, saveToken, decodeAccessToken, isTokenValid } from '../../TokenUtils';
import { AuthContext, Token, User } from '../AuthContext';
import axios from 'axios';


const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>({ permission: 'G', name: 'Convidado', exp: 0 });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const verifyIsLogged = async () => {
    const token = await getToken();
    const isValid = isTokenValid(token)
    if (token && isValid) {
      console.log('Autenticado, logando.')
      setIsAuthenticated(true);
      if (user.name === 'Convidado') {
        const userData = decodeAccessToken(token)
        setUser(userData);
      }
      return true;
    } else {
      console.log('Não autenticado, deslogando.')
      logout();
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    return await axios.post('http://api.locroom.com.br/security/auth/locroom', { username: email, password: password })
      .then(response => {
        const token = response.data as Token;
        const userData = decodeAccessToken(token.accessToken)
        setIsAuthenticated(true);
        setUser(userData);
        saveToken(token);
        return token;
      }).catch(error => {
        throw new Error(error);
      })
  }

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
