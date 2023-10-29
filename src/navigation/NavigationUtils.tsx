import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from './NavigationTypes';
import {Alert} from 'react-native';
import {User} from '../utils/Model/User';

const PERMISSIONS = {
  ADMIN: 'A',
  USER: 'U',
  GUEST: 'G',
};

const SCREEN_PERMISSIONS: Record<keyof RootStackParamList, string> = {
  Login: PERMISSIONS.GUEST,
  Home: PERMISSIONS.USER,
  Configuration: PERMISSIONS.USER,
};

const navigate = (
  navigation: StackNavigationProp<RootStackParamList>,
  routeName: keyof RootStackParamList,
  isAuthenticated: boolean,
  user: User,
) => {
  const requiredPermission = SCREEN_PERMISSIONS[routeName];
  if (isAuthenticated) {
    if (user.permission.includes(requiredPermission)) {
      return navigation.navigate(routeName);
    } else {
      return Alert.alert('Erro', 'Desculpe, você não tem permissão. :(');
    }
  } else {
    return Alert.alert('Erro', 'Desculpe, você não está autenticado. :(');
  }
};

export {navigate};
