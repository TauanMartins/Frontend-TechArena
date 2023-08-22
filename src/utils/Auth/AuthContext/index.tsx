import { createContext, useContext } from 'react';
import { AuthContextData } from '../../Model/Context';
import { UnauthenticatedUser } from '../../Model/User';

export const AuthContext = createContext<AuthContextData>({
  user: UnauthenticatedUser,
  isAuthenticated: false,
  login: async () => { },
  logout: () => { },
});

const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};

export { useAuth };
