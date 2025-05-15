import React, { useEffect, useState } from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  Alert
} from 'react-native';
import { useTheme } from '../../utils/Theme/ThemeContext';
import { ScreenProps, screens } from '../../navigation/ScreenProps';
import { RootStackParamList } from '../../navigation/NavigationTypes';
import { NotificationIcon } from '../../components/IconsButton';
import { useAuth } from '../../utils/Auth/AuthContext';
import { navigate } from '../../navigation/NavigationUtils';
import { AvatarImage } from '../../components/AvatarImage';
import { Localization, standardLocalization } from '../../utils/Model/Localization';
import Geolocation from '@react-native-community/geolocation';
import { Header } from '../../components/HomeScreenComponents/Header';
import Light from '../../utils/Theme/Light';
import Dark from '../../utils/Theme/Dark';
import { FavoriteSports } from '../../components/HomeScreenComponents/FavoriteSports';
import API from '../../utils/API';
import { CreateSportsPrefered } from '../../components/CreateSportsPrefered';
import Loader from '../../components/Loader';
import { EventCardRow } from '../../components/HomeScreenComponents/AppointmentListSuggested';
import { DetailAppointment } from '../../components/DetailAppointment';
import SocialChatStack from '../Social/Chat';
import HomeAppointments, { LeagueMapStack } from './LeagueMap';
import CreateMatchMap from './LeagueMap';
import CreateMatchPersonal, { LeaguePersonalStack } from './LeaguePersonal';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { LeagueHomeStack } from './LeagueHome';
import LeagueMap from './LeagueMap';

const Stack = createStackNavigator<RootStackParamList>();

const LeagueStack = ({ route }) => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          elevation: 0,
          borderBottomWidth: 0,
          backgroundColor: theme.PRIMARY,
        },
        headerTitleStyle: {
          color: theme.SECONDARY,
        },
      }}>
      <Stack.Screen
        initialParams={route.params}
        name={screens.Ligas.name as keyof RootStackParamList}
        options={{
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'Sansation Regular',
            fontSize: 26,
            color: theme.SECONDARY,
          },
        }}
        component={TopTabs} />
    </Stack.Navigator>
  );
};



const Tab = createMaterialTopTabNavigator();

export const TopTabs = ({ route }) => {
  const { theme } = useTheme();
  return (
    <Tab.Navigator

      initialRouteName={route.params?.page ? route.params.page : 'Criar Torneio'}
      screenOptions={{
        lazy: true,
        swipeEnabled: false,
        tabBarStyle: {
          backgroundColor: theme.PRIMARY
        },
        tabBarLabelStyle: {
          fontFamily: 'Sansation Regular',
          fontSize: 16,
          color: theme.SECONDARY,
        },
        tabBarIndicatorStyle: { backgroundColor: theme.SECONDARY }
      }}
    >
      <Tab.Screen name="Mapa" component={LeagueMapStack}  listeners={{
          tabPress: e => {
            // Impede o pressionamento da aba
            e.preventDefault();
          },
        }}/>
      <Tab.Screen name="Criar Torneio" initialParams={route.params} component={LeagueHomeStack} />
      <Tab.Screen name="Meus Torneios." component={LeaguePersonalStack} listeners={{
          tabPress: e => {
            // Impede o pressionamento da aba
            e.preventDefault();
          },
        }} />
    </Tab.Navigator>
  );
};

export default LeagueStack;
