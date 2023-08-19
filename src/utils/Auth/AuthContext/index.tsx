import {createContext, useContext} from 'react';
import { AuthContextData } from '../../Model/Context';


export const AuthContext = createContext<AuthContextData | undefined>(undefined);

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export {useAuth};
