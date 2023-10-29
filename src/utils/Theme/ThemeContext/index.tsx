import { createContext, useContext } from 'react';
import { ThemeContextData } from '../../Model/Context/ThemeContext';

export const ThemeContext = createContext<ThemeContextData>({
    theme: null,
    changeThemeFirstScreen: () => { },
    changeTheme: () => { }
});

const useTheme = () => {
    const context = useContext(ThemeContext);
    return context;
};

export { useTheme };
