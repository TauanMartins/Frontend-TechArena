import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './NavigationTypes';
import LoginScreen from '../pages/Login';
import HomeScreen from '../pages/Home';
import ConfigurationScreen from '../pages/Configuration';

export type ScreenProps<T extends keyof RootStackParamList> = {
  route: RouteProp<RootStackParamList, T>;
  navigation: StackNavigationProp<RootStackParamList, T>;
};
export const screens = {
  Login: { name: 'Login', component: LoginScreen },
  Home: { name: 'Home', component: HomeScreen },
  Configuration: { name: 'Configuration', component: ConfigurationScreen },
  // ... Outras telas
};