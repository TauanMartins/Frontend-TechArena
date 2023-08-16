import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from './navigationTypes';

export type ScreenProps<T extends keyof RootStackParamList> = {
  navigation: StackNavigationProp<RootStackParamList, T>;
};
