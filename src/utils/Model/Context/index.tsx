import { Token } from "../Token";
import { User } from "../User";

export interface AuthContextData {
    user: User;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<Token | Error>;
    logout: () => void;
  }