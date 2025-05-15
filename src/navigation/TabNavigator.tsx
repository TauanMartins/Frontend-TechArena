import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator  } from '@react-navigation/bottom-tabs';
import { screens } from './ScreenProps';
import {
  SettingsIcon,
  CreateMatchIcon,
  HomeIcon,
  LeagueIcon,
  SocialIcon,
} from '../components/IconsButton';
import { useTheme } from '../utils/Theme/ThemeContext';
import { RootStackParamList } from './NavigationTypes';
import { Keyboard } from 'react-native';
const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  const { theme } = useTheme();
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIconStyle: { borderWidth: 1, borderColor: 'transparent', width: 34, height: 34 },
        tabBarStyle: {
          elevation: 10,
          backgroundColor: theme.PRIMARY,
          display: keyboardVisible ? 'none' : 'flex'
        },
      }}>
      <Tab.Screen
        name="HomeStack"
        component={screens.HomeStack.component}
        options={({ navigation }) => ({
          title: 'HomeStack',
          tabBarIcon: () => (
            <HomeIcon
              isActive={navigation.isFocused()}
              color={theme.SECONDARY}
              size={24}
            />
          ),
        })}
      />
      <Tab.Screen
        name="LeagueStack"
        component={screens.LeagueStack.component}
        options={({ navigation }) => ({
          title: 'LeagueStack',
          tabBarIcon: () => (
            <LeagueIcon
              isActive={navigation.isFocused()}
              color={theme.SECONDARY}
              size={34}
            />
          ),
        })}
      />
      <Tab.Screen
        name="CreateMatchStack"
        component={screens.CreateMatchStack.component}
        options={({ navigation }) => ({
          title: 'CreateMatchStack',
          tabBarIcon: () => (
            <CreateMatchIcon
              isActive={navigation.isFocused()}
              color={theme.SECONDARY}
              size={34}
            />
          ),
        })}
      />
      <Tab.Screen
        name="SocialStack"
        component={screens.SocialStack.component}
        options={({ navigation }) => ({
          title: 'SocialStack',
          tabBarIcon: () => (
            <SocialIcon
              isActive={navigation.isFocused()}
              color={theme.SECONDARY}
              size={26}
            />
          ),
        })}
      />
      <Tab.Screen
        name={screens.SettingsStack.name as keyof RootStackParamList}
        component={screens.SettingsStack.component}
        options={({ navigation }) => ({
          title: 'SettingsStack',
          tabBarIcon: () => (
            <SettingsIcon
              isActive={navigation.isFocused()}
              color={theme.SECONDARY}
              size={34}
            />
          ),
        })}
      />
    </Tab.Navigator>
  );
};
