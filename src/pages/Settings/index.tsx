import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {useTheme} from '../../utils/Theme/ThemeContext';
import {screens} from '../../navigation/ScreenProps';
import {RootStackParamList} from '../../navigation/NavigationTypes';
import Light from '../../utils/Theme/Light';
import {FavoriteIcon, PreferenceIcon} from '../../components/IconsButton';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import {useAuth} from '../../utils/Auth/AuthContext';
import SettingsPreferencesStack from './Preferences';
import { UpdateSportsPrefered } from '../../components/UpdateSportsPrefered';

const Stack = createStackNavigator<RootStackParamList>();

const SettingsStack = () => {
  const {theme} = useTheme();

  return (
    <Stack.Navigator
      initialRouteName={screens.Settings.name as keyof RootStackParamList}
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
        name={screens.Settings.name as keyof RootStackParamList}
        options={{
          headerShown: false,
        }}
        component={Settings}
      />
      <Stack.Screen
        name={screens.SettingsPreferencesStack.name as keyof RootStackParamList}
        options={{
          headerShown: false,
        }}
        component={SettingsPreferencesStack}
      />
      <Stack.Screen
        name={screens.SettingsFavoriteSports.name as keyof RootStackParamList}
        options={{
          headerShown: false,
        }}
        component={UpdateSportsPrefered}
      />
    </Stack.Navigator>
  );
};

export const Settings = ({navigation}) => {
  const {logout} = useAuth();
  const {theme} = useTheme();
  const styles = createStyles(theme);

  const handleLogout = () => {
    ConfirmationDialog({
      title: 'Confirmação',
      message: 'Deseja sair da aplicação?',
      onConfirm: logout,
      onCancel: () => {},
    });
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Configurações</Text>
      </View>
      <View style={styles.col}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(
              screens.SettingsPreferencesStack.name as keyof RootStackParamList,
            )
          }
          style={styles.settingsButton}>
          <PreferenceIcon color={theme.SECONDARY} />
          <View style={styles.buttonContent}>
            <Text style={styles.button_text_title}>Preferências</Text>
            <Text style={styles.button_text}>
              Selecione entre os temas claro e escuro, troque o idioma e limite
              a forma como o TechArena usa parte de seus dados.
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(
              screens.SettingsFavoriteSports.name as keyof RootStackParamList,
            )
          }
          style={styles.settingsButton}>
          <FavoriteIcon color={theme.SECONDARY} />
          <View style={styles.buttonContent}>
            <Text style={styles.button_text_title}>Esportes favoritos</Text>
            <Text style={styles.button_text}>
              Modifique os seus esportes marcados como favoritos.
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout} style={styles.button}>
          <Text style={styles.button_text_title}>Sair</Text>
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
      justifyContent: 'center',
      marginVertical: 15,
    },
    col: {
      flexDirection: 'column',
    },
    title: {
      fontFamily: 'Sansation Regular',
      fontSize: 28,
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

export default SettingsStack;
