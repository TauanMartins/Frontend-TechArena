import React, { useEffect, useState } from 'react';
import { getAccessToken, clearAccessToken, saveAccessToken, decodeAccessToken, isTokenValid, saveRefreshToken, clearRefreshToken, getRefreshToken } from '../../TokenUtils';
import { Token } from '../../Model/Token';
import { User } from '../../Model/User';
import { AuthContext } from '../../Auth/AuthContext';
import axios from 'axios';


const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>({ permission: 'G', name: 'Convidado', exp: 0 });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const verifyIsLogged = async () => {
    const token = await getAccessToken();
    const refreshToken = await getRefreshToken();
    if (token) {
      let isValid = isTokenValid(token)
      if (isValid) {
        console.log('Autenticado, logando...')
        setIsAuthenticated(true);
        if (user.name === 'Convidado') { // Caso o usuário saia do app e abra novamente será verificado o Token e por isso não passará pela função Login, portanto, será necessário a decodificação deste Token.
          const userData = decodeAccessToken(token)
          setUser(userData);
        }
      } else {
        clearAccessToken();
      }
    } else {
      if (refreshToken) {
        let isValid = isTokenValid(refreshToken);
        if (isValid) {
          refreshLogin(refreshToken);
        } else {
          logout()
        }
      } else {
        logout();
      }
    }
  };

  const login = async (email: string, password: string) => {
    return await axios.post('http://15.228.203.132/api/http?route=/security/auth/locroom', { username: email, password: password })
      .then(response => {
        const token = response.data as Token;
        registerLogin(token)
        return token;
      }).catch(error => {
        throw new Error('');
      })
  }

  const refreshLogin = async (refreshToken: Token["refreshToken"]) => {
    return await axios.get(`http://api.locroom.com.br/security/auth/refresh?r=${refreshToken}`)
      .then(response => {
        const token = response.data as Token;
        registerLogin(token);
        return token;
      }).catch(error => {
        logout();
        throw new Error(error);
      })
  }
  const registerLogin = (token: Token) => {
    console.log('Autenticado, logando...')
    const userData = decodeAccessToken(token.accessToken)
    setIsAuthenticated(true);
    setUser(userData);
    saveAccessToken(token.accessToken);
    saveRefreshToken(token.refreshToken);
  }
  const logout = () => {
    console.log('Não autenticado, deslogando...')
    clearAccessToken();
    clearRefreshToken();
    setUser({ permission: 'G', name: 'Convidado', exp: 0 });
    setIsAuthenticated(false);
  };

  useEffect(() => {
    verifyIsLogged();
    const checkTokenInterval = setInterval(() => {
      verifyIsLogged();
    }, 3000);
    return () => clearInterval(checkTokenInterval);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
