import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './NavigationTypes';
import LoginScreen from '../pages/Login';
import HomeScreen from '../pages/Home';
import SettingsStack, { Settings } from '../pages/Settings';
import SettingsThemePreferences from '../pages/Settings/Preferences/ThemePreferences';
import SettingsPreferencesStack, {
  SettingsPreferences,
} from '../pages/Settings/Preferences';
import HomeStack from '../pages/Home';
import Home from '../pages/Home';
import HomeAppointments from '../pages/Home/HomeAppointments';
import SocialStack, { Social } from '../pages/Social';
import SocialChatStack, { SocialChat } from '../pages/Social/Chat';
import SocialUserChatDetail from '../pages/Social/Chat/UserChatDetail';
import { UpdateSportsPrefered } from '../components/UpdateSportsPrefered';
import CreateMatchStack from '../pages/CreateMatch';
import CreateMatchHome, { CreateMatchHomeStack } from '../pages/CreateMatch/CreateMatchHome';
import CreateMatchMap, { CreateMatchMapStack } from '../pages/CreateMatch/CreateMatchMap';
import CreateMatchPersonal, { CreateMatchPersonalStack } from '../pages/CreateMatch/CreateMatchPersonal';

export type ScreenProps<T extends keyof RootStackParamList> = {
  route: RouteProp<RootStackParamList, T>;
  navigation: StackNavigationProp<RootStackParamList, T>;
  parameters: RootStackParamList[T];
};
export const screens = {
  // Páginas seguem hierarquia:
  // 1 - Stack que agrupa todas as possíveis opções de telas a serem mostradas neste menu.
  // 2 - Página inicial do menu, normalmente mostra vários botões que levam para outras páginas.
  // 3 - Página opcional, mostrará opções de uma aba anterior e levará para um menu mais específico.
  // 4 - Página final.

  /* ------------------------------------------------------------------------------------------------*/

  Login: { name: 'Login', component: LoginScreen },

  /* ------------------------------------------------------------------------------------------------*/
  
  HomeStack: { name: 'HomeStack', component: HomeStack },
  Home: { name: 'Home', component: Home },
  HomeAppointments: { name: 'HomeAppointments', component: HomeAppointments },
  
  /* ------------------------------------------------------------------------------------------------*/

  CreateMatchStack: { name: 'CreateMatchStack', component: CreateMatchStack },
  Agendamentos: { name: 'Agendamentos', component: CreateMatchMap },
  CreateMatchMapStack: { name: 'CreateMatchMapStack', component: CreateMatchMapStack },
  CreateMatchMap: { name: 'CreateMatchMap', component: CreateMatchMap },
  CreateMatchHomeStack: { name: 'CreateMatchHomeStack', component: CreateMatchHomeStack },
  CreateMatchHome: { name: 'CreateMatchHome', component: CreateMatchHome },
  CreateMatchPersonalStack: { name: 'CreateMatchPersonalStack', component: CreateMatchPersonalStack },
  CreateMatchPersonal: { name: 'CreateMatchPersonal', component: CreateMatchPersonal },

  /* ------------------------------------------------------------------------------------------------*/

  SettingsStack: { name: 'SettingsStack', component: SettingsStack },
  Settings: { name: 'Settings', component: Settings },
  SettingsPreferencesStack: { name: 'SettingsPreferencesStack', component: SettingsPreferencesStack, },
  SettingsPreferences: { name: 'SettingsPreferences', component: SettingsPreferences, },
  SettingsThemePreferences: { name: 'SettingsThemePreferences', component: SettingsThemePreferences, },
  SettingsFavoriteSports: { name: 'SettingsFavoriteSports', component: UpdateSportsPrefered, },

  /* ------------------------------------------------------------------------------------------------*/

  SocialStack: { name: 'SocialStack', component: SocialStack },
  Social: { name: 'Social', component: Social },
  SocialChatStack: { name: 'SocialChatStack', component: SocialChatStack, },
  SocialChat: { name: 'SocialChat', component: SocialChat, },
  SocialUserChatDetail: { name: 'SocialUserChatDetail', component: SocialUserChatDetail, },
};
