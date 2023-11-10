import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {screens} from './ScreenProps';
import {
  SettingsIcon,
  CreateMatchIcon,
  HomeIcon,
  LeagueIcon,
  SocialIcon,
} from '../components/IconsButton';
import {useTheme} from '../utils/Theme/ThemeContext';
import {RootStackParamList} from './NavigationTypes';
const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  const {theme} = useTheme();
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIconStyle: {width: 34, height: 34},
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 10,
          maxHeight: 40,
          backgroundColor: theme.PRIMARY,
        },
      }}>
      <Tab.Screen
        name="HomeStack"
        component={screens.HomeStack.component}
        options={({navigation}) => ({
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
        name="League"
        component={screens.Home.component}
        options={({navigation}) => ({
          title: 'League',
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
        name="CreateMatch"
        component={screens.Home.component}
        options={({navigation}) => ({
          title: 'CreateMatch',
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
        options={({navigation}) => ({
          title: 'SocialStack',
          tabBarIcon: () => (
            <SocialIcon
              isActive={navigation.isFocused()}
              color={theme.SECONDARY}
              size={24}
            />
          ),
        })}
      />
      <Tab.Screen
        name={screens.SettingsStack.name as keyof RootStackParamList}
        component={screens.SettingsStack.component}
        options={({navigation}) => ({
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
