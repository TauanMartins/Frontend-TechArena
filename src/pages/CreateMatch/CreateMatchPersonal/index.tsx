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
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/NavigationTypes';
import { CreateMatchMapStack } from '../CreateMatchMap';
import CreateMatchStack from '..';
import { DetailAppointment2 } from '../../../components/DetailAppointment2';


const Stack = createStackNavigator<RootStackParamList>();

export const CreateMatchPersonalStack = () => {
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
        name={screens.CreateMatchPersonal.name as keyof RootStackParamList}
        options={{
          headerShown: false,
        }}
        component={CreateMatchPersonal} />
      <Stack.Screen
        name={screens.CreateMatchStack.name as keyof RootStackParamList}
        options={{
          headerShown: false,
        }}
        component={CreateMatchStack} />
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

const CreateMatchPersonal: React.FC<ScreenProps<'CreateMatchPersonal'>> = ({ navigation, route }) => {
  const { user, localization, isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [appointments, setAppointments] = useState({ data: [], current_page: 1, total: 0, per_page: 5 });
  const [appointmentSelected, setAppointmentSelected] = useState([]);
  const [isDetailAppointmentModalVisible, setIsDetailAppointmentModalVisible] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ preferSports: true, orderByTime: 'recent', distance: 'near' });

  const fetchAppointments = async (latitude: string, longitude: string) => {
    setLoading(true);
    try {
      const result = await API.$user_appointments.select_user_appointments({
        lat: latitude,
        longitude: longitude,
        username: user.username,
        preferSports: filters.preferSports,
        orderByTime: filters.orderByTime,
        distance: filters.distance,
        page: 1
      });
      setAppointments(result.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  const fetchMoreAppointments = async (latitude: string, longitude: string) => {
    try {
      if (appointments.current_page < (appointments.total / appointments.per_page)) {
        const result = await API.$user_appointments.select_user_appointments({
          lat: latitude,
          longitude: longitude,
          username: user.username,
          preferSports: filters.preferSports,
          orderByTime: filters.orderByTime,
          distance: filters.distance,
          page: appointments.current_page + 1
        });

        setAppointments({ ...result.data, data: [...appointments.data, ...result.data.data] });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleShowFilters = () => {
    setShowFilters(!showFilters);
  };

  const toggleDetailAppointmentModal = () => {
    setIsDetailAppointmentModalVisible(!isDetailAppointmentModalVisible);
  };

  useEffect(() => {
    fetchAppointments(localization.lat, localization.longitude);
  }, [localization, filters]);

  const FiltersHeader = () => (
    <>
      <TouchableOpacity onPress={toggleShowFilters} style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>Filtros</Text>{showFilters ? <CollapseDown color={theme.SECONDARY} style={{ marginRight: 10 }} /> : <CollapseRight color={theme.SECONDARY} style={{ marginRight: 10 }} />}
      </TouchableOpacity>
      {showFilters &&
        <View>
          <CheckboxButton
            colours={theme}
            label='Por esportes favoritos'
            description='Filtrar pelos seus esportes favoritos'
            value={filters.preferSports}
            handleSelectedOption={() => { setFilters({ ...filters, preferSports: !filters.preferSports }); }}
          />
          <RadioButton2
            colours={theme}
            label="Próximos Agendamentos"
            description="Exibir agendamentos que acontecerão em breve."
            value="recent"
            selectedOption={filters.orderByTime}
            handleSelectedOption={() => { setFilters({ ...filters, orderByTime: 'recent' }); }}
          />
          <RadioButton2
            colours={theme}
            label="Agendamentos Futuros"
            description="Exibir agendamentos programados para datas mais distantes."
            value="future"
            selectedOption={filters.orderByTime}
            handleSelectedOption={() => { setFilters({ ...filters, orderByTime: 'future' }); }}
          />
          <RadioButton2
            colours={theme}
            label="Próximos por Distância"
            description="Mostrar agendamentos mais próximos à sua localização atual."
            value="near"
            selectedOption={filters.distance}
            handleSelectedOption={() => { setFilters({ ...filters, distance: 'near' }); }}
          />
          <RadioButton2
            colours={theme}
            label="Distantes por Distância"
            description="Mostrar agendamentos que estão mais longe de você."
            value="far"
            selectedOption={filters.distance}
            handleSelectedOption={() => { setFilters({ ...filters, distance: 'far' }); }}
          />
        </View>
      }
    </>
  );
  return (
    <View style={styles.container}>
      {loading && <Loader />}
      <DetailAppointment2
        open={isDetailAppointmentModalVisible}
        close={toggleDetailAppointmentModal}
        appointment={appointmentSelected}
        navigation={navigation}
        isAuthenticated={isAuthenticated}
      />
      <FlatList
        data={appointments.data}
        ListEmptyComponent={(
          <Text style={styles.emptyList}>
            Ops, você não participou de nenhum agendamento até o momento. 
          </Text>
        )}
        ListHeaderComponent={<FiltersHeader />}
        refreshing={refreshing}
        onRefresh={() => fetchAppointments(localization.lat, localization.longitude)}
        onEndReachedThreshold={0.1}
        onEndReached={() => fetchMoreAppointments(localization.lat, localization.longitude)}
        renderItem={({ item: appointment }) => (
          <AppointmentItem
            color={(appointment.date<(new Date()).toISOString().split('T')[0])?'lightgrey':theme[appointment.sport_id]}
            distance={appointment.distance}
            id={appointment.id}
            image={appointment.image}
            name={`${appointment.address} ${(appointment.date<(new Date()).toISOString().split('T')[0])?'- AGENDAMENTO ANTIGO':''}`}
            players={`${appointment.players} ${appointment.players === 1 ? 'Jogador presente' : 'Jogadores presentes'}`}
            sport={appointment.name}
            subtitle={`${formatDate(appointment.date, appointment.horary)} às ${formatTime(appointment.horary)}`}
            action={() => {
              if (appointmentSelected !== appointment) {
                setAppointmentSelected(appointment);
              }
              toggleDetailAppointmentModal();
            }}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
      />
    </View>
  );
};

const createStyles = (theme: typeof Light | typeof Dark) =>
  StyleSheet.create({
    sectionHeader: {
      paddingVertical: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.PRIMARY,
      elevation: 2
    },
    sectionHeaderText: {
      fontFamily: 'Sansation Regular',
      fontSize: 16,
      color: theme.SECONDARY,
    },
    scrollView: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo translúcido para obscurecer o conteúdo de trás
    },
    modalView: {
      alignItems: 'center',
      justifyContent: 'flex-start', // Alinhamento do conteúdo ao topo
      backgroundColor: theme.PRIMARY,
      flex: 1,
      borderRadius: 25,
      elevation: 5,
      paddingVertical: 20,
      paddingHorizontal: 15,
      margin: 25,
    },
    container_material: {
      flex: 1,
      backgroundColor: theme.PRIMARY,
    },
    list: {
      backgroundColor: theme.PRIMARY
    },
    emptyList: {
      textAlign: "center",
      fontFamily: 'Sansation Regular',
      fontSize: 13,
      color: theme.SECONDARY
    },
    container: {
      paddingHorizontal: 10, // Reduzir o padding para aumentar o espaço disponível
      flex: 1,
      backgroundColor: theme.PRIMARY,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 15,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    title: {
      fontFamily: 'Sansation Regular',
      fontSize: 18,
      flex: 1,
      color: theme.SECONDARY,
      marginHorizontal: 10,
    },
  });

export default CreateMatchPersonal;
