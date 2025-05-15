import { Localization } from '../../Localization';
import { Tokens } from '../../Token';
import { User } from '../../User';
import { Dispatch, SetStateAction } from 'react';
export interface AuthContextData {
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
  isAuthenticated: boolean;
  localization: Localization,
  setLocalization: Dispatch<SetStateAction<Localization>>;
  login: () => Promise<void | Error>;
  logout: () => void;
  loading: boolean,
  setLoading: Dispatch<SetStateAction<boolean>>;
}
