import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {screens} from '../../../navigation/ScreenProps';
import {RootStackParamList} from '../../../navigation/NavigationTypes';
import SettingsThemePreferences from './ThemePreferences';
import {useAuth} from '../../../utils/Auth/AuthContext';
import {useTheme} from '../../../utils/Theme/ThemeContext';
import {Text, ScrollView, View, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {BackButton, PreferenceThemeIcon} from '../../../components/IconsButton';
import Light from '../../../utils/Theme/Light';
import {navigate} from '../../../navigation/NavigationUtils';

const Stack = createStackNavigator<RootStackParamList>();

const SettingsPreferencesStack = () => {
  const {theme} = useTheme();
  return (
    <Stack.Navigator
      initialRouteName={
        screens.SettingsPreferences.name as keyof RootStackParamList
      }
      screenOptions={{
        ...TransitionPresets.SlideFromRightIOS,
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
        name={screens.SettingsPreferences.name as keyof RootStackParamList}
        options={{headerShown: false}}
        component={SettingsPreferences}
      />
      <Stack.Screen
        name={screens.SettingsThemePreferences.name as keyof RootStackParamList}
        options={{
          headerShown: false,
        }}
        component={SettingsThemePreferences}
      />
    </Stack.Navigator>
  );
};

export const SettingsPreferences = ({navigation}) => {
  const {isAuthenticated, user} = useAuth();
  const {theme} = useTheme();
  const styles = createStyles(theme);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <BackButton
          onPress={() => navigation.goBack()}
          style={{}}
          color={theme.SECONDARY}
        />
        <Text style={{...styles.title, color: theme.SECONDARY}}>
          Preferências
        </Text>
        <View style={{width: 50}} />
      </View>
      <View style={styles.col}>
        <TouchableOpacity
          onPress={() =>
            navigate(
              navigation,
              screens.SettingsThemePreferences.name as keyof RootStackParamList,
              isAuthenticated,
              user,
            )
          }
          style={styles.settingsButton}>
          <PreferenceThemeIcon color={theme.SECONDARY} />
          <View style={styles.buttonContent}>
            <Text style={styles.button_text_title}>Tema claro e escuro</Text>
            <Text style={styles.button_text}>
              Altere entre os temas claro e escuro.
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const createStyles = (theme: typeof Light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.PRIMARY,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginVertical: 15,
    },
    col: {
      flexDirection: 'column',
    },
    title: {
      fontFamily: 'Sansation Regular',
      fontSize: 28,
      textAlign: 'center',
      color: theme.SECONDARY,
    },
    settingsButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 3,
      paddingVertical: 8,
      elevation: 3,
      backgroundColor: theme.PRIMARY,
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 4,
      paddingVertical: 12,
      elevation: 3,
      backgroundColor: theme.PRIMARY,
    },
    buttonContent: {
      flex: 1,
    },
    button_text_title: {
      fontFamily: 'Sansation Regular',
      fontSize: 16,
      color: theme.SECONDARY,
    },
    button_text: {
      fontFamily: 'Sansation Regular',
      fontSize: 13,
      color: theme.SECONDARY,
    },
  });

export default SettingsPreferencesStack;
