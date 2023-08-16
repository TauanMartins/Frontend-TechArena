import React, { useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './NavigationTypes';
import LoginScreen from '../screens/Login';
import DashboardScreen from '../screens/Dashboard';
import Splash from '../screens/Splash';

interface AppNavigatorProps {
  styles: {
    container: {
      flex: number;
      backgroundColor: string;
    };
    text: {
      color: string;
    };
  };
}

const screens = {
  Login: { name: 'Login', component: LoginScreen },
  Dashboard: { name: 'Dashboard', component: DashboardScreen },
  Splash: { name: 'Splash', component: Splash },
  // ... Outras telas
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { isAuthenticated } = useAuth();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isAuthenticated ?
          (
            <Stack.Group>
              <Stack.Screen
                key={screens.Dashboard.name}
                name={screens.Dashboard.name as keyof RootStackParamList}
                component={screens.Dashboard.component} />
            </Stack.Group>
          ) :
          (
            <Stack.Group>
              <Stack.Screen
                key={screens.Login.name}
                name={screens.Login.name as keyof RootStackParamList}
                component={screens.Login.component} />
            </Stack.Group>

          )
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
