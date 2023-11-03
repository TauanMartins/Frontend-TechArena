import {User} from '../../User';
import {Dispatch, SetStateAction} from 'react';
export interface AuthContextData {
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
  isAuthenticated: boolean;
  login: () => Promise<void | Error>;
  logout: () => void;
}
