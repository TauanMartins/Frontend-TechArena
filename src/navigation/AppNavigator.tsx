import React from 'react';
import {useAuth} from '../utils/Auth/AuthContext';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {RootStackParamList} from './NavigationTypes';
import LoginScreen from '../screens/Login';
import DashboardScreen from '../screens/Dashboard';

const screens = {
  Login: {name: 'Login', component: LoginScreen},
  Dashboard: {name: 'Dashboard', component: DashboardScreen},
  // ... Outras telas
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const {isAuthenticated} = useAuth();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isAuthenticated ? (
          <Stack.Group>
            <Stack.Screen
              key={screens.Dashboard.name}
              name={screens.Dashboard.name as keyof RootStackParamList}
              options={{headerShown: false}}
              component={screens.Dashboard.component}
            />
          </Stack.Group>
        ) : (
          <Stack.Group>
            <Stack.Screen
              key={screens.Login.name}
              name={screens.Login.name as keyof RootStackParamList}
              options={{headerShown: false}}
              component={screens.Login.component}
            />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
