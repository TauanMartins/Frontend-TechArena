import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './NavigationTypes';
import { Alert } from 'react-native';
import { User } from '../utils/Model/User';

const PERMISSIONS = {
  ADMIN: 'A',
  USER: 'U',
  GUEST: 'G',
};

const SCREENS: Record<
  keyof RootStackParamList,
  { permission: string; implemented: boolean }
> = {
  Login: { permission: PERMISSIONS.GUEST, implemented: true },

  HomeStack: { permission: PERMISSIONS.USER, implemented: true },
  Home: { permission: PERMISSIONS.USER, implemented: true },
  HomeAppointments: { permission: PERMISSIONS.USER, implemented: true },

  SettingsStack: { permission: PERMISSIONS.USER, implemented: true },
  Settings: { permission: PERMISSIONS.USER, implemented: true },
  SettingsPreferencesStack: { permission: PERMISSIONS.USER, implemented: true },
  SettingsPreferences: { permission: PERMISSIONS.USER, implemented: true },
  SettingsThemePreferences: { permission: PERMISSIONS.USER, implemented: true },


  SocialStack: { permission: PERMISSIONS.USER, implemented: true },
  Social: { permission: PERMISSIONS.USER, implemented: true },
  SocialChatStack: { permission: PERMISSIONS.USER, implemented: true },
  SocialChat: { permission: PERMISSIONS.USER, implemented: true },
  SocialUserChatDetail: { permission: PERMISSIONS.USER, implemented: true },
};

const navigate = (
  navigation: StackNavigationProp<RootStackParamList>,
  routeName: keyof RootStackParamList,
  isAuthenticated: boolean,
  user: User,
  parameters?: any 
) => {
  const screen = SCREENS[routeName];
  const requiredPermission = screen.permission;
  const implemented = screen.implemented;

  if (!implemented) {
    return Alert.alert(
      'Ops',
      'Desculpe, esta tela ainda não foi implementada.',
    );
  }

  if (isAuthenticated) {
    if (user.permission.includes(requiredPermission)) {
      return navigation.navigate(routeName, parameters);
    } else {
      return Alert.alert('Erro', 'Desculpe, você não tem permissão. 😞');
    }
  } else {
    return Alert.alert('Erro', 'Desculpe, você não está autenticado. 😞');
  }
};

export { navigate };
