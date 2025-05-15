import {createContext, useContext} from 'react';
import {AuthContextData} from '../../Model/Context/AuthContext';
import {UnauthenticatedUser} from '../../Model/User';
import { standardLocalization } from '../../Model/Localization';

export const AuthContext = createContext<AuthContextData>({
  user: UnauthenticatedUser,
  setUser: () => {},
  localization: standardLocalization,
  setLocalization: () => {},
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
  loading: false,
  setLoading: () => {},
});

const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};

export {useAuth};
