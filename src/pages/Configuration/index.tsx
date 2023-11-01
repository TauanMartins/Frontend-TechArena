import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Configuration from './main';
import Home from '../Home';
import { screens } from '../../navigation/ScreenProps';
import { RootStackParamList } from '../../navigation/NavigationTypes';

const Stack = createStackNavigator<RootStackParamList>();

const SettingsStack = () => {
  return (

    <Stack.Navigator initialRouteName="Configuration">
      <Stack.Screen
        name={screens.Configuration.name as keyof RootStackParamList}
        options={{ headerShown: false }}
        component={Configuration} />
    </Stack.Navigator>
  );
};

export default SettingsStack;
