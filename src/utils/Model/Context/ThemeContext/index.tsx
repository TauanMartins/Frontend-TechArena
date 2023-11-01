import Light from '../../../Theme/Light';
import Dark from '../../../Theme/Dark';
import { User } from '../../User';
import React, { Dispatch, SetStateAction } from 'react';

export interface ThemeContextData {
  theme: null | typeof Light | typeof Dark;
  setTheme: Dispatch<SetStateAction<null | typeof Light | typeof Dark>>;
  changeThemeFirstScreen: () => void;
  changeTheme: (nextThemeChoosed: User['prefered_theme'] | null,
    preferedTheme: User['prefered_theme'],
    theme: typeof Light | typeof Dark,
    setTheme: Dispatch<SetStateAction<typeof Light | typeof Dark>>,
    deviceTheme: 'light' | 'dark'
  ) => void;
  saveTheme: (preferedTheme: User["prefered_theme"], user: User, setUser: React.Dispatch<React.SetStateAction<User>>) => void;
}