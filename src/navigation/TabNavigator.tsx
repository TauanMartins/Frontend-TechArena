import React from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { screens } from "./ScreenProps";
import { CreateMatchIcon, HomeIcon, LeagueIcon, MapIcon, ProfileIcon } from '../components/IconsButton';
const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  return (
    <Tab.Navigator initialRouteName='Home' screenOptions={{ headerShown: false, tabBarShowLabel: false, tabBarIconStyle: { width: 30, height: 30 }, tabBarStyle: { borderTopWidth: 0, elevation: 0, height: 70, backgroundColor: '#F4F4F4', } }} >
      <Tab.Screen
        name="Home"
        component={screens.Home.component}
        options={({ navigation }) => ({ title: 'Home', tabBarIcon: () => <HomeIcon isActive={navigation.isFocused()} color={'#424242'} size={24} /> })}
      />
      <Tab.Screen
        name="League"
        component={screens.Home.component}
        options={({ navigation }) => ({ title: 'League', tabBarIcon: () => <LeagueIcon isActive={navigation.isFocused()} color={'#424242'} size={34} /> })}
      />
      <Tab.Screen
        name="CreateMatch"
        component={screens.Home.component}
        options={({ navigation }) => ({ title: 'CreateMatch', tabBarIcon: () => <CreateMatchIcon isActive={navigation.isFocused()} color={'#424242'} size={34} /> })}
      />
      <Tab.Screen
        name="Map"
        component={screens.Home.component}
        options={({ navigation }) => ({ title: 'Map', tabBarIcon: () => <MapIcon isActive={navigation.isFocused()} color={'#424242'} size={34} /> })}
      />
      <Tab.Screen
        name="Profile"
        component={screens.Profile.component}
        options={({ navigation }) => ({ title: 'Profile', tabBarIcon: () => <ProfileIcon isActive={navigation.isFocused()} color={'#424242'} size={34} /> })}
      />
    </Tab.Navigator>
  );
};
