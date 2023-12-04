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
import RadioButton2 from '../../../components/RadioButton2';


const Stack = createStackNavigator<RootStackParamList>();

export const LeagueHomeStack = () => {
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
        name={screens.LeagueHome.name as keyof RootStackParamList}
        options={{
          headerShown: false,
        }}
        component={LeagueHome} />
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
const CreateMatchHomeBySport = ({ navigation, createBy,
  notification, setNotification,
  setLoading, loading,
  sports, setSports,
  arenas, setArenas,
  horarys, setHorarys,
  sport, setSport,
  horary, setHorary,
  date, setDate,
  holder, setHolder,
  arena, setArena,
  fetchArenaBySport, fetchHorary, checkArena }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const onChange = (date) => {
    setDate(date);
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
    fetchArenaBySport();
    setArena(null);
    setHorary(null);
    setHorarys([])
  }, [sport])
  return (
    <>
      <DateMenu date={date} onChange={onChange} />
      <View style={styles.horizontalRule} />
      <SportMenu onChange={setSport} selectedSport={sport} sports={sports} holder={holder} setHolder={setHolder} />
      <View style={styles.horizontalRule} />
      <ArenaMenu onChange={setArena} selectedArena={arena} arenas={arenas} navigation={navigation} checkArena={checkArena} />
      <View style={styles.horizontalRule} />
      <HoraryMenu onChange={setHorary} selectedHorary={horary} horarys={horarys} />
      <View style={styles.horizontalRule} />
    </>
  );
};

const CreateMatchHomeByArena = ({ navigation, createBy,
  notification, setNotification,
  setLoading, loading,
  sports, setSports,
  arenas, setArenas,
  horarys, setHorarys,
  sport, setSport,
  horary, setHorary,
  date, setDate,
  holder, setHolder,
  arena, setArena,
  fetchSportsByArena, fetchHorary, checkArena }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const onChange = (date) => {
    setDate(date);
  };
  useEffect(() => {
    setSport(null);
    setHorary(null);
    fetchSportsByArena();
  }, [arena])
  useEffect(() => {
    setHorary(null);
    fetchHorary();
  }, [sport])

  return (
    <>
      <DateMenu date={date} onChange={onChange} />
      <View style={styles.horizontalRule} />
      <ArenaMenu onChange={setArena} selectedArena={arena} arenas={arenas} navigation={navigation} checkArena={checkArena} />
      <View style={styles.horizontalRule} />
      <SportMenu onChange={setSport} selectedSport={sport} sports={sports} holder={holder} setHolder={setHolder} />
      <View style={styles.horizontalRule} />
      <HoraryMenu onChange={setHorary} selectedHorary={horary} horarys={horarys} />
      <View style={styles.horizontalRule} />
    </>
  );
};

const LeagueHome: React.FC<ScreenProps<'LeagueHome'>> = ({ navigation, route }) => {
  const { user, localization, isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [notification, setNotification] = useState({
    message: '',
    success: false,
    visible: false,
  });
  var arenaSelected = route.params?.arena;

  const [sports, setSports] = useState([]);
  const [arenas, setArenas] = useState([]);
  const [horarys, setHorarys] = useState([]);

  const [date, setDate] = useState(new Date());
  const [sport, setSport] = useState(null);
  const [horary, setHorary] = useState(null);
  const [holder, setHolder] = useState(false);
  const [arena, setArena] = useState(null); // standard option - null

  const [loading, setLoading] = useState(false);
  const [createBy, setCreateBy] = useState('sport'); // option A - arena, B - sport



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

  const fetchSportsByArena = () => {
    if (arena) {
      setLoading(true)
      API.$sport_arena.select_sports_arena({ arena_id: arena.id }).then(async (response) => {
        setSports(response.data)
      }).catch((err) => {
        console.log(err)
      }).finally(() => {
        setLoading(false)
      })
    }
  };

  const fetchArenaBySport = () => {
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

  const fetchArenas = () => {
    setLoading(true)
    API.$arenas_user.select_arenas_user({ lat: localization.lat, longitude: localization.longitude }).then(async (response) => {
      setArenas(((response.data).map(arena => { return { ...arena, arena_id: arena.id } })))
    }).catch((err) => {
      console.log(err)
    }).finally(() => {
      setLoading(false)
    })
  }

  const fetchHorary = () => {
    const formattedDate = date.toISOString().split('T')[0];
    if (arena && sport) {
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
  const handleChangeCreateMode = (option) => {
    navigation.setParams({arena: null});
    setCreateBy(option)
    setArena(null)
    setSport(null)
    setHorary(null)
    setArenas([])
    setSports([])
    setHorarys([])
  }
  const checkArena = () => {
    navigation.setParams({arena: null});
    navigation.navigate('CreateMatchMap', { arena_id: arena.arena_id })
  }

  const saveAppointment = () => {
    const formattedDate = date.toISOString().split('T')[0];
    if (!(arena?.arena_id && horary?.id && sport?.id)) {
      return Alert.alert('Ops', 'Desculpe, essa funcionalidade ainda não está pronta.');
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

  useFocusEffect(
    useCallback(() => {
      if (arenaSelected) {        
        setCreateBy('arena')
        setArena(arenaSelected)
      } else {
        if (!arena) {
          setCreateBy('sport')
        }
      }
      navigation.setParams({arena: null});
    }, [arenaSelected])
  );


  useEffect(() => {
    if (createBy === 'arena') {
      fetchArenas();
    } else {
      fetchSports();
    }
  }, [createBy, arena])
  return (
    <>
      {loading && <Loader />}
      <ScrollView style={styles.container}>

        <Notification
          message={notification.message}
          success={notification.success}
          visible={notification.visible}
          onClose={() => setNotification({ ...notification, visible: false })} />

        <View style={{ paddingTop: 20 }} >
          <Text style={styles.text}>Crie uma liga:</Text>
        </View>
        <View style={styles.horizontalRule} />
        <TouchableOpacity style={{ ...styles.modalButton, backgroundColor: theme.TERTIARY }} onPress={saveAppointment}>
          <Text style={styles.modalButtonText}>Salvar</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
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
      marginBottom: 25,
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
    text: {
      fontFamily: 'Sansation Regular',
      fontSize: 18,
      color: theme.QUATERNARY,
    },
  });

export default LeagueHome;
