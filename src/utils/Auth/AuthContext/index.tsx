import { createContext, useContext } from 'react';

export interface User {
  permission: string;
  // Outras propriedades do usuário, se houver
}

interface AuthContextData {
  user: User;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<string | Error>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextData | undefined>(undefined);

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { useAuth };
