import React, { useEffect } from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { screens } from "./ScreenProps";
import { ConfigurationIcon, CreateMatchIcon, HomeIcon, LeagueIcon, MapIcon } from '../components/IconsButton';
import { useTheme } from '../utils/Theme/ThemeContext';
import { useColorScheme } from 'react-native';
const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  const { theme } = useTheme();
  return (
    <Tab.Navigator initialRouteName='Home' screenOptions={{ headerShown: false, tabBarShowLabel: false, tabBarIconStyle: { width: 34, height: 34 }, tabBarStyle: { borderTopWidth: 0, elevation: 10, maxHeight: 40, backgroundColor: theme.PRIMARY } }} >
      <Tab.Screen
        name="Home"
        component={screens.Home.component}
        options={({ navigation }) => ({ title: 'Home', tabBarIcon: () => <HomeIcon isActive={navigation.isFocused()} color={theme.SECONDARY} size={24} /> })}
      />
      <Tab.Screen
        name="League"
        component={screens.Home.component}
        options={({ navigation }) => ({ title: 'League', tabBarIcon: () => <LeagueIcon isActive={navigation.isFocused()} color={theme.SECONDARY} size={34} /> })}
      />
      <Tab.Screen
        name="CreateMatch"
        component={screens.Home.component}
        options={({ navigation }) => ({ title: 'CreateMatch', tabBarIcon: () => <CreateMatchIcon isActive={navigation.isFocused()} color={theme.SECONDARY} size={34} /> })}
      />
      <Tab.Screen
        name="Map"
        component={screens.Home.component}
        options={({ navigation }) => ({ title: 'Map', tabBarIcon: () => <MapIcon isActive={navigation.isFocused()} color={theme.SECONDARY} size={34} /> })}
      />
      <Tab.Screen
        name="Configuration"
        component={screens.Configuration.component}
        options={({ navigation }) => ({ title: 'Configuration', tabBarIcon: () => <ConfigurationIcon isActive={navigation.isFocused()} color={theme.SECONDARY} size={34} /> })}
      />
    </Tab.Navigator>
  );
};