import React, { useEffect, useState } from 'react';
import { getToken, clearToken, saveToken } from '../../TokenUtils';
import { AuthContext, User } from '../AuthContext'

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>({ permission: 'G' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const verifyIsLogged = async () => {
    const token = await getToken();
    if (!token) {
      clearToken();
      return false;
    } else {
      setIsAuthenticated(true);
      return true;
    }
  };


  const login = async (email: string, password: string) => {
    try {
      const response = password === '1234' ? { data: { token: '1234'} } : password === '12345' ? { data: { token: '12345', permission: 'AGU' } } : (() => { throw new Error(); })();
      const token = response.data.token==='1234'?{...response.data, permission: 'GU'}:response.data.token==='12345'?{...response.data, permission: 'GUA'}: {...response.data, permission: 'G'};
      const userData = token;
      setIsAuthenticated(true);
      setUser(userData);
      saveToken(token.token);
      return token.token;
    } catch (error) {
      throw new Error('Erro ao autenticar usuário');
    }
  };

  const logout = () => {
    clearToken();
    setUser({ permission: 'G' });
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
