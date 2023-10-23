import React from 'react';
import { useAuth } from '../utils/Auth/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './NavigationTypes';
import { screens } from './ScreenProps';
import { TabNavigator } from './TabNavigator';
const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { isAuthenticated } = useAuth();
  return (
    <NavigationContainer >
      {isAuthenticated ? (
        <TabNavigator />
      ) : (
        <Stack.Navigator>
          <Stack.Group>
            <Stack.Screen
              key={screens.Login.name}
              name={screens.Login.name as keyof RootStackParamList}
              options={{ headerShown: false }}
              component={screens.Login.component}
            />
          </Stack.Group>
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
