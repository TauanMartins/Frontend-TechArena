import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from './NavigationTypes';
import {Alert} from 'react-native';
import {User} from '../utils/Model/User';

const PERMISSIONS = {
  ADMIN: 'A',
  USER: 'U',
  GUEST: 'G',
};

const SCREENS: Record<
  keyof RootStackParamList,
  {permission: string; implemented: boolean}
> = {
  Login: {permission: PERMISSIONS.GUEST, implemented: true},

  HomeStack: {permission: PERMISSIONS.USER, implemented: true},
  Home: {permission: PERMISSIONS.USER, implemented: true},
  HomeRecommendedSchedules: {permission: PERMISSIONS.USER, implemented: false},

  SettingsStack: {permission: PERMISSIONS.USER, implemented: true},
  Settings: {permission: PERMISSIONS.USER, implemented: true},
  SettingsPreferencesStack: {permission: PERMISSIONS.USER, implemented: true},
  SettingsPreferences: {permission: PERMISSIONS.USER, implemented: true},
  SettingsThemePreferences: {permission: PERMISSIONS.USER, implemented: true},
};

const navigate = (
  navigation: StackNavigationProp<RootStackParamList>,
  routeName: keyof RootStackParamList,
  isAuthenticated: boolean,
  user: User,
) => {
  const screen = SCREENS[routeName];
  const requiredPermission = SCREENS[routeName].permission;
  const implemented = SCREENS[routeName].implemented;
  if (!implemented || !screen) {
    return Alert.alert(
      'Erro',
      'Desculpe, esta tela ainda não foi implementada.',
    );
  }
  if (isAuthenticated) {
    if ('U'.includes(requiredPermission)) {
      return navigation.navigate(routeName);
    } else {
      return Alert.alert('Erro', 'Desculpe, você não tem permissão. :(');
    }
  } else {
    return Alert.alert('Erro', 'Desculpe, você não está autenticado. :(');
  }
};

export {navigate};
