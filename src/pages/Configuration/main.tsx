import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, useColorScheme, Alert } from 'react-native';
import { ScreenProps } from '../../navigation/ScreenProps';
import { useAuth } from '../../utils/Auth/AuthContext';
import { useTheme } from '../../utils/Theme/ThemeContext';
import LoaderUnique from '../../components/LoaderUnique';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import { User } from '../../utils/Model/User';
import { RadioButton } from '../../components/RadioButton';
import Notification from '../../components/Notification';

const Configuration: React.FC<ScreenProps<'Configuration'>> = () => {
  // As próximas 5 linhas serão normal e frequentemente vistas por toda a a aplicação.
  // Possuem funções para setar o tema, controlar usuário, controlar componente de carregamento e notificação.
  const { logout, user, setUser } = useAuth();
  const { theme, setTheme, changeTheme, saveTheme } = useTheme();
  const [notification, setNotification] = useState({ message: '', success: false, visible: false });
  const [loading, setLoading] = useState(false);
  const deviceTheme = useColorScheme();

  // Os próximos componentes serão utilizados para o funcionamento deste próprio componente.
  const [preferedTheme, setPreferedTheme] = useState(user.prefered_theme);  
  const themeOptions: { label: string, value: User["prefered_theme"], description: string }[] = [
    { label: 'Configuração do Dispositivo', value: null, description: 'Esta configuração fara o aplicativo acompanhar o tema padrão do dispositivo.' },
    { label: 'Tema Escuro', value: 'dark', description: 'Esta configuração alterará o tema do aplicativo para escuro.' },
    { label: 'Tema Claro', value: 'light', description: 'Esta configuração alterará o tema do aplicativo para claro.' },
  ];

  const handleSelectedOption = (option: User["prefered_theme"]) => {
    setPreferedTheme(option);
    changeTheme(option, null, theme, setTheme, deviceTheme);
  }
  const savePreferedTheme = async () => {
    const save = () => {
      try {
        setLoading(true)
        saveTheme(preferedTheme, user, setUser)
        setNotification({ message: 'As configurações foram salvas com sucesso!', visible: true, success: true });
      }
      catch (error) {
        setNotification({ message: 'Não conseguimos salvar as alterações :(', visible: true, success: false });
      } finally {
        setLoading(false)
      }
    }
    ConfirmationDialog({
      title: 'Confirmação',
      message: 'Deseja salvar as alterações?',
      onConfirm: save,
      onCancel: () => { },
    });

  };
  const handleLogout = () => {
    ConfirmationDialog({
      title: 'Confirmação',
      message: 'Deseja sair da aplicação?',
      onConfirm: logout,
      onCancel: () => { },
    });
  };
  return (
    <ScrollView style={{ ...styles.scrollView, backgroundColor: theme.PRIMARY }}>
      <View style={{ ...styles.container, backgroundColor: theme.PRIMARY }} >
        <View style={styles.row}>
          <Text style={{ ...styles.title, color: theme.SECONDARY }}  >
            Configurações
          </Text>
        </View>
        <View style={styles.col}>
          {themeOptions.map(themeOption => (
            <RadioButton key={themeOption.label} colours={theme} label={themeOption.label} description={themeOption.description} value={themeOption.value} selectedOption={preferedTheme} handleSelectedOption={handleSelectedOption} />
          ))}
        </View>
        <View style={styles.row}>
          <TouchableOpacity onPress={savePreferedTheme} style={{ ...styles.button, backgroundColor: theme.TERCIARY }}>
            {loading && <LoaderUnique />}
            <Text style={{ ...styles.button_text, color: theme.QUATERNARY }} >
              Salvar
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
        <Notification
          message={notification.message}
          success={notification.success}
          visible={notification.visible}
          onClose={() => setNotification({ ...notification, visible: false })}
        />
      </View>
    </ScrollView >
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