import React, { useState, useEffect, useCallback } from 'react';
import { ScreenProps, screens } from '../../../navigation/ScreenProps';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../../utils/Auth/AuthContext';
import { useTheme } from '../../../utils/Theme/ThemeContext';
import Light from '../../../utils/Theme/Light';
import Dark from '../../../utils/Theme/Dark';
import Loader from '../../../components/Loader';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button } from 'react-native-elements';
import DateMenu from '../../../components/CreateMatchComponents/DateMenu';
import API from '../../../utils/API';
import SportMenu from '../../../components/CreateMatchComponents/SportMenu';

import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/NavigationTypes';
import ArenaMenu from '../../../components/CreateMatchComponents/ArenaMenu';
import HoraryMenu from '../../../components/CreateMatchComponents/HoraryMenu';
import ConfirmationDialog from '../../../components/ConfirmationDialog';
import Notification from '../../../components/Notification';
import { useFocusEffect } from '@react-navigation/native';


const Stack = createStackNavigator<RootStackParamList>();

export const CreateMatchHomeStack = () => {
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
        name={screens.CreateMatchHome.name as keyof RootStackParamList}
        options={{
          headerShown: false,
        }}
        component={CreateMatchHome} />
    </Stack.Navigator>
  );
};

const formatDate = (dateString, timeString) => {
  if (!dateString) {
    return ''
  }
  const utcDate = new Date(dateString + `T${timeString}Z`);
  const spTimeZoneOffset = 0; // Fuso horário de São Paulo, sem considerar horário de verão
  const spDate = new Date(utcDate.getTime() + spTimeZoneOffset * 60 * 60 * 1000);

  const day = spDate.getUTCDate();
  const monthNames = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  const month = monthNames[spDate.getUTCMonth()];
  const year = spDate.getUTCFullYear();

  return `${day} de ${month} de ${year}`;
};

const formatTime = (timeString) => {
  if (!timeString) {
    return ''; // Ou algum valor padrão se preferir
  }
  const [hours, minutes] = timeString.split(':');
  return `${hours}h${minutes}`;
};
const CreateMatchHome: React.FC<ScreenProps<'CreateMatchHome'>> = ({ navigation, route }) => {
  const { user, localization, isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [notification, setNotification] = useState({
    message: '',
    success: false,
    visible: false,
  });

  const [loading, setLoading] = useState(false);
  const [sports, setSports] = useState([]);
  const [arenas, setArenas] = useState([]);
  const [horarys, setHorarys] = useState([]);


  const [date, setDate] = useState(new Date());
  const [sport, setSport] = useState(null);
  const [arena, setArena] = useState(null);
  const [horary, setHorary] = useState(null);
  const [holder, setHolder] = useState(false);
  const formattedDate = date.toISOString().split('T')[0];
  const onChange = (date) => {
    setDate(date);
  };


  const saveAppointment = () => {
    if (!(arena?.arena_id && horary?.id && sport?.id)) {
      return Alert.alert('Erro', 'Por favor, preencha os dados corretamente.');
    }
    ConfirmationDialog({
      title: 'Confirmação',
      message: `Deseja criar o agendamento com os dados fornecidos? Confirme abaixo:\n--Arena: ${arena.address}\n--Esporte: ${sport.name}\n--Dia e hora: ${formatDate(formattedDate, horary.horary)} às ${formatTime(horary.horary)}\n--Holder: ${holder ? 'sim' : 'não'}`,
      onConfirm: async () => {
        setLoading(true);
        API.$appointments.create_appointments({ arena_id: arena.arena_id, date: formattedDate, schedule_id: horary.id, sport_id: sport.id, username: user.username, holder: holder }).then(async (response) => {
          setNotification({
            message: 'Parabéns, agendamento criado com sucesso!',
            success: true,
            visible: true,
          });
        }).catch((error) => {

          setNotification({
            message: `Desculpe, não conseguimos criar o seu agendamento 😞\nCódigo do erro: ${error.message}`,
            success: false,
            visible: true,
          });
        }).finally(() => {
          setLoading(false)
        })
      },
      onCancel: () => { },
    });
  };
  const fetchSports = () => {
    setLoading(true)
    API.$sports.select_sports({}).then(async (response) => {
      setSports(response.data)
    }).catch((err) => {
      console.log(err)
    }).finally(() => {
      setLoading(false)
    })
  };


  const fetchArena = () => {
    if (sport) {
      setLoading(true)
      API.$arenas_sport.select_arenas_sports({ sport_id: sport.id }).then(async (response) => {
        setArenas(response.data)
      }).catch((err) => {
        console.log(err)
      }).finally(() => {
        setLoading(false)
      })
    }
  };

  const fetchHorary = () => {
    if (arena) {
      setLoading(true)
      API.$horary.select_available_horary({ arena_id: arena.arena_id, sport_id: sport.id, date: formattedDate }).then(async (response) => {
        const today = new Date();
        // Ajuste para o fuso horário de São Paulo
        today.setHours(today.getHours() + today.getTimezoneOffset() / 60 - 3); // Supondo que São Paulo esteja em UTC-3

        // Formatar a data atual para comparação (YYYY-MM-DD)
        const currentDateFormatted = today.toISOString().split('T')[0];

        // A data selecionada já está no formato ISO (YYYY-MM-DD)
        const selectedDate = date.toISOString().split('T')[0];

        if (selectedDate === currentDateFormatted) {
          const currentHours = today.getHours();
          const currentMinutes = today.getMinutes();

          const availableHorarys = response.data.filter(horary => {
            const [hours, minutes] = horary.horary.split(':').map(Number);
            // Se a hora atual for menor (ainda não chegou) do que a hora disponível, mantenha o horário na lista
            return currentHours < hours || (currentHours === hours && currentMinutes < minutes);
          });
          setHorarys(availableHorarys);
        } else {
          setHorarys(response.data);
        }
      }).catch((err) => {
        console.log(err)
      }).finally(() => {
        setLoading(false)
      })
    }
  };


  useEffect(() => {
    setSport(null);
    setArena(null);
    setHorary(null);
  }, [date])
  useEffect(() => {
    fetchHorary();
    setHorary(null);
  }, [arena])
  useEffect(() => {
    fetchArena();
    setArena(null)
    setHorary(null);
  }, [sport])
  useEffect(() => {
    fetchSports();
  }, [])
  return (
    <ScrollView style={styles.container}>
      <Notification
        message={notification.message}
        success={notification.success}
        visible={notification.visible}
        onClose={() => setNotification({ ...notification, visible: false })} />
      {loading && <Loader />}
      <DateMenu date={date} onChange={onChange} />
      <View style={styles.horizontalRule} />
      <SportMenu onChange={setSport} selectedSport={sport} sports={sports} holder={holder} setHolder={setHolder} />
      <View style={styles.horizontalRule} />
      <ArenaMenu onChange={setArena} selectedArena={arena} arenas={arenas} navigation={navigation} />
      <View style={styles.horizontalRule} />
      <HoraryMenu onChange={setHorary} selectedHorary={horary} horarys={horarys} />
      <View style={styles.horizontalRule} />
      <TouchableOpacity style={{ ...styles.modalButton, backgroundColor: theme.TERTIARY }} onPress={saveAppointment}>
        <Text style={styles.modalButtonText}>Salvar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
const createStyles = (theme: typeof Light | typeof Dark) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.PRIMARY,
      paddingVertical: 20,
      paddingHorizontal: 10
    },
    calendarButton: {
      padding: 15,
      marginVertical: 5,
      borderRadius: 20,
      alignSelf: 'stretch', // Estica o botão para preencher a largura
      backgroundColor: theme.TERTIARY,
      alignItems: 'center',
      justifyContent: 'center',
    },
    horizontalRule: {
      borderBottomColor: 'grey', // Cor da linha
      borderBottomWidth: 1,      // Espessura da linha
      marginVertical: 10,        // Espaço vertical acima e abaixo da linha
    },
    modalButton: {
      padding: 15,
      marginVertical: 5,
      borderRadius: 20,
      alignSelf: 'stretch', // Estica o botão para preencher a largura
      backgroundColor: theme.TERTIARY,
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalButtonText: {
      fontFamily: 'Sansation Regular',
      fontSize: 18,
      color: theme.QUATERNARY,
    },
  });

export default CreateMatchHome;
