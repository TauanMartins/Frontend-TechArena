import { User } from '../../User';

export interface AuthContextData {
  user: User;
  isAuthenticated: boolean;
  login: () => Promise<void | Error>;
  logout: () => void;
}
