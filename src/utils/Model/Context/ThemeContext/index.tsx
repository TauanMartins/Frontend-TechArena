import Light from '../../../Theme/Light';
import Dark from '../../../Theme/Dark';

export interface ThemeContextData {
  theme: null | typeof Light | typeof Dark;
  changeThemeFirstScreen: () => void;
  changeTheme: (preferedTheme: string | null) => void;
}