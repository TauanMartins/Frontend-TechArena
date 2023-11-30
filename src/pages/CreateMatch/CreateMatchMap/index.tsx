import React, { useState, useEffect } from 'react';
import { ScreenProps, screens } from '../../../navigation/ScreenProps';
import { StyleSheet, FlatList, View, TouchableOpacity, Text, TouchableHighlight, SectionList } from 'react-native';
import { useAuth } from '../../../utils/Auth/AuthContext';
import { BackButton, CollapseDown, CollapseRight, NotificationIcon } from '../../../components/IconsButton';
import { useTheme } from '../../../utils/Theme/ThemeContext';
import Light from '../../../utils/Theme/Light';
import Dark from '../../../utils/Theme/Dark';
import Loader from '../../../components/Loader';
import { AvatarImage } from '../../../components/AvatarImage';
import API from '../../../utils/API';
import { AppointmentItem } from '../../../components/AppointmentItem';
import { DetailAppointment } from '../../../components/DetailAppointment';
import CheckboxButton from '../../../components/CheckboxButton';
import CheckboxButton2 from '../../../components/CheckboxButton2';
import RadioButton2 from '../../../components/RadioButton2';
import { RootStackParamList } from '../../../navigation/NavigationTypes';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator<RootStackParamList>();

export const CreateMatchMapStack = ({ route }) => {
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
        name={screens.CreateMatchMap.name as keyof RootStackParamList}
        options={{
          headerShown: false,
        }}
        component={CreateMatchMap} />
    </Stack.Navigator>
  );
};




const CreateMatchMap: React.FC<ScreenProps<'CreateMatchMap'>> = ({ navigation, route }) => {
  const { user, localization, isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [loading, setLoading] = useState(false);
  const arena_id = route.params?.arena_id;


  return (
    <View style={styles.container}>
      {loading && <Loader />}
      <Text style={styles.text}>
        {`Mapa\nParâmetros vindos de outra página:${arena_id}\nLocalização: ${localization.lat}, ${localization.longitude}`}
      </Text>
    </View>
  );
};

const createStyles = (theme: typeof Light | typeof Dark) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.PRIMARY,
    },
    text: {
      fontFamily: 'Sansation Regular',
      fontSize: 18,
      textAlign: 'center',
      color: theme.SECONDARY,
    }
  });

export default CreateMatchMap;
