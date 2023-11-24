import changeNavigationBarColor from 'react-native-navigation-bar-color';
import Theme from '..';
import { StatusBar } from 'react-native';
import { User } from '../../Model/User';
import API from '../../API';
import Light from '../Light';
import Dark from '../Dark';

export const changeThemeFirstScreen = () => {
  const standardTheme = Theme.light;
  const nextBarStyle = 'dark-content'; // Dark = letra da topBar preta
  changeNavigationBarColor(standardTheme.SECONDARY); // Secondary = Tema da barra de cima/baixo virará preto
  StatusBar.setBackgroundColor(standardTheme.PRIMARY); // Primary = Tema da barra de cima virará branco
  StatusBar.setBarStyle(nextBarStyle); // Tema da fonte da barra de cima
};

export const changeTheme = async (
  nextThemeChoosed: User['prefered_theme'] | null,
  preferedTheme: User['prefered_theme'] | null,
  theme: typeof Light | typeof Dark,
  setTheme: React.Dispatch<
    React.SetStateAction<null | typeof Light | typeof Dark>
  >,
  deviceTheme: 'light' | 'dark',
) => {
  const nextTheme = nextThemeChoosed ? Theme[nextThemeChoosed] : preferedTheme ? Theme[preferedTheme] : Theme[deviceTheme];
  const nextBarStyle = (nextTheme === Theme.light) ? 'dark-content' : 'light-content';
  changeNavigationBarColor(nextTheme.PRIMARY, nextTheme === Theme.light); // Tema da barra de cima/baixo
  setTheme(nextTheme); // Tema geral
  StatusBar.setBackgroundColor(nextTheme.PRIMARY); // Tema da barra de cima
  StatusBar.setBarStyle(nextBarStyle); // Tema da fonte da barra de cima
};

export const saveTheme = async (
  preferedTheme: User['prefered_theme'],
  user: User,
  setUser: React.Dispatch<React.SetStateAction<User>>,
) => {
  await API.$users_prefered_theme.user_prefered_theme({
    prefered_theme: preferedTheme,
    user: user.email,
  });
  setUser({ ...user, prefered_theme: preferedTheme });
};
