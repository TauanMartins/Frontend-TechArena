import {createContext, useContext} from 'react';

export interface Token {
  accessToken: string;
  refreshToken: string;
}
export interface User {
  exp: number;
  name: string;
  permission: string
  // Outras propriedades do usuário
}


interface AuthContextData {
  user: User;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<Token | Error>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextData | undefined>(
  undefined,
);

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export {useAuth};
