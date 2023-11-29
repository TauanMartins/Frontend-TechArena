import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { ScreenProps } from '../../../../navigation/ScreenProps';
import { useAuth } from '../../../../utils/Auth/AuthContext';
import { useTheme } from '../../../../utils/Theme/ThemeContext';
import LoaderUnique from '../../../../components/LoaderUnique';
import ConfirmationDialog from '../../../../components/ConfirmationDialog';
import { User } from '../../../../utils/Model/User';
import RadioButton from '../../../../components/RadioButton';
import Notification from '../../../../components/Notification';
import { BackButton } from '../../../../components/IconsButton';

const themeOptions: {
  label: string;
  value: User['prefered_theme'];
  description: string;
}[] = [
    {
      label: 'Configuração do Dispositivo',
      value: null,
      description:
        'Esta configuração fará o aplicativo acompanhar o tema padrão do dispositivo.',
    },
    {
      label: 'Tema Escuro',
      value: 'dark',
      description: 'Esta configuração alterará o tema do aplicativo para escuro.',
    },
    {
      label: 'Tema Claro',
      value: 'light',
      description: 'Esta configuração alterará o tema do aplicativo para claro.',
    },
  ];

const SettingsThemePreferences: React.FC<
  ScreenProps<'SettingsThemePreferences'>
> = ({ navigation }) => {
  // As próximas cinco linhas serão normalmente visualizadas pois contam com elementos para
  // gerenciar usuário, gerenciar o tema e gerenciar componentes de carregamento e notificação.
  const { user, setUser } = useAuth();
  const { theme, setTheme, changeTheme, saveTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    message: '',
    success: false,
    visible: false,
  });
  const deviceTheme = useColorScheme();

  const [preferedTheme, setPreferedTheme] = useState({
    prefered_theme: user.prefered_theme,
    edited: false,
  } as { prefered_theme: User['prefered_theme']; edited: boolean });

  const handleSelectedOption = (option: User['prefered_theme']) => {
    setPreferedTheme({
      prefered_theme: option,
      edited: option !== user.prefered_theme,
    });
    changeTheme(option, null, theme, setTheme, deviceTheme);
  };

  const handleSavePreferedTheme = () => {
    ConfirmationDialog({
      title: 'Confirmação',
      message: 'Deseja salvar as alterações?',
      onConfirm: async () => {
        try {
          setLoading(true);
          saveTheme(preferedTheme.prefered_theme, user, setUser);
          setNotification({
            message: 'As configurações foram salvas com sucesso!',
            success: true,
            visible: true,
          });
          setPreferedTheme({ ...preferedTheme, edited: false });
        } catch (error) {
          setNotification({
            message: 'Não conseguimos salvar as alterações 😞',
            success: false,
            visible: true,
          });
        } finally {
          setLoading(false);
        }
      },
      onCancel: () => { },
    });
  };

  useEffect(() => {
    const backHandler = navigation.addListener('beforeRemove', e => {
      if (!preferedTheme.edited) {
        return;
      }
      e.preventDefault();
      ConfirmationDialog({
        title: 'Descartar alterações?',
        message:
          'Você tem alterações não salvas. Tem certeza de que deseja descartá-las?',
        onConfirm: () => {
          changeTheme(null, user.prefered_theme, theme, setTheme, deviceTheme);
          navigation.dispatch(e.data.action);
        },
        onCancel: () => { },
      });
    });

    return backHandler;
  }, [navigation, preferedTheme.edited]);
  return (
    <>
      <ScrollView style={{ ...styles.scrollView, backgroundColor: theme.PRIMARY }}>
        <View style={{ ...styles.container, backgroundColor: theme.PRIMARY }}>
          <View style={styles.headerRow}>
            <BackButton
              onPress={() => navigation.goBack()}
              style={{}}
              color={theme.SECONDARY}
            />
            <Text style={{ ...styles.title, color: theme.SECONDARY }}>
              Temas claro e escuro
            </Text>
            <View style={{ width: 50 }} />
          </View>
          <View style={styles.col}>
            {themeOptions.map(themeOption => (
              <RadioButton
                key={themeOption.label}
                colours={theme}
                label={themeOption.label}
                description={themeOption.description}
                value={themeOption.value}
                selectedOption={preferedTheme.prefered_theme}
                handleSelectedOption={handleSelectedOption}
              />
            ))}
          </View>
          <View style={styles.row}>
            <TouchableOpacity
              onPress={handleSavePreferedTheme}
              disabled={!preferedTheme.edited}
              style={{ ...styles.button, backgroundColor: theme.TERTIARY }}>
              {loading && <LoaderUnique />}
              <Text style={{ ...styles.button_text, color: theme.QUATERNARY }}>
                Salvar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      
      <Notification
        message={notification.message}
        success={notification.success}
        visible={notification.visible}
        onClose={() => setNotification({ ...notification, visible: false })}
      />
    </>

  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  title: {
    fontFamily: 'Sansation Regular',
    fontSize: 26,
    alignItems: 'center',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  col: {
    justifyContent: 'center',
  },
  button: {
    elevation: 7,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    paddingVertical: '4%',
    margin: 15,
    borderRadius: 50,
  },
  button_text: {
    fontFamily: 'Sansation Regular',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
    fontSize: 14,
  },
});

export default SettingsThemePreferences;
