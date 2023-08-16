import React, { createContext, useContext, useEffect, useState } from 'react';
import { getToken, clearToken, saveToken } from '../TokenUtils';

interface AuthContextData {
  user: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<string | Error>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const verifyIsLogged = async () => {
    const token = await getToken();
    console.log('\n\nverificando...')
    if (!token) {
      console.log('não autenticado\n\n')
      clearToken();
      return false;
    } else {
      console.log('autenticado\n\n')
      setUser(token);
      setIsAuthenticated(true);
      return true;
    }
  };

  useEffect(() => {
    verifyIsLogged();
    const checkTokenInterval = setInterval(() => {
      verifyIsLogged();
    }, 3000);
    return () => clearInterval(checkTokenInterval);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = password === '1234' ? { data: { token: 'token: 1234' } } : (() => { throw new Error(); })();
      const token = response.data.token;
      const userData = 'nome: Tauan';
      setIsAuthenticated(true);
      setUser(userData);
      saveToken(token);
      return token;
    } catch (error) {
      throw new Error('Erro ao autenticar usuário');
    }
  };

  const logout = () => {
    clearToken();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
