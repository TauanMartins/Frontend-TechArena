import React, { useState } from 'react';
import { Button, StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenProps, screens } from '../../navigation/ScreenProps';
import { useAuth } from '../../utils/Auth/AuthContext';
import axios from 'axios';
import { useTheme } from '../../utils/Theme/ThemeContext';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/NavigationTypes';

const Configuration: React.FC<ScreenProps<'Configuration'>> = ({ }) => {
  const { logout, user } = useAuth();
  const { theme, changeTheme } = useTheme();

  const [answer, setAnswer] = useState({})
  const healthCheck = async () => {
    await axios.get('https://api.techarena.com.br/api/health-check')
      .then((response: { data: JSON }) => {
        return setAnswer(response.data);
      })
      .catch((error: string | undefined) => {
        throw new Error(error);
      });
  };
  const handleLogout = () => {
    logout();
  };
  return (
    <ScrollView style={{ ...styles.scrollView, backgroundColor: theme.PRIMARY }}>
      <View style={{ ...styles.container, backgroundColor: theme.PRIMARY }} >
        <View style={styles.row}>
          <Text style={{ ...styles.title, color: theme.SECONDARY }}  >
            Configurações
          </Text>
        </View>
        <View style={styles.row}>
        </View>
        <View style={styles.row}>
          <TouchableOpacity onPress={() => changeTheme('dark')} style={{ ...styles.button, backgroundColor: theme.TERCIARY }}>
            <Text style={{ ...styles.button_text, color: theme.QUATERNARY }}  >
              Mudar Tema para tema escuro
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity onPress={() => changeTheme('light')} style={{ ...styles.button, backgroundColor: theme.TERCIARY }}>
            <Text style={{ ...styles.button_text, color: theme.QUATERNARY }} >
              Mudar Tema para tema claro
            </Text>
          </TouchableOpacity>

        </View>
        <View style={styles.row}>
          <TouchableOpacity onPress={handleLogout} style={{ ...styles.button, backgroundColor: theme.TERCIARY }}>
            <Text style={{ ...styles.button_text, color: theme.QUATERNARY }} >
              Sair
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1
  },
  container: {
    flex: 1
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  col: {
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Sansation Regular',
    marginTop: '3%',
    fontSize: 28,
  },
  button: {
    elevation: 7,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '5%',
    width: '100%',
    paddingRight: '10%',
    paddingLeft: '10%',
    paddingTop: '5%',
    paddingBottom: '5%',
    borderRadius: 50,
  },
  button_text: {
    fontFamily: 'Sansation Regular',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
    fontSize: 14

  }
});

export default Configuration;
