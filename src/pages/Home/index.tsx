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
import Recommended from './HomeAppointments';
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
import HomeAppointments from './HomeAppointments';
import { CreateMatchMapStack } from '../CreateMatch/CreateMatchMap';
import CreateMatchStack, { TopTabs } from '../CreateMatch';

const Stack = createStackNavigator<RootStackParamList>();
const HomeStack = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName={screens.Home.name as keyof RootStackParamList}
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
        name={screens.Home.name as keyof RootStackParamList}
        options={{
          headerShown: false,
        }}
        component={Home}
      />
      <Stack.Screen
        name={screens.HomeAppointments.name as keyof RootStackParamList}
        options={{
          headerShown: false,
        }}
        component={HomeAppointments}
      />
      <Stack.Screen
        name={screens.SocialChatStack.name as keyof RootStackParamList}
        options={{
          headerShown: false,
        }}
        component={SocialChatStack}
      />
      
      <Stack.Screen
        name={screens.CreateMatchStack.name as keyof RootStackParamList}
        options={{
          headerShown: false,
        }}
        component={CreateMatchStack} />
    </Stack.Navigator>
  );
};


const fetchLocalization = async (): Promise<Localization> => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        resolve({ lat: position.coords.latitude.toString(), longitude: position.coords.longitude.toString() });
      },
      (error) => {
        resolve(standardLocalization);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  });
};
// Página inicial
const Home = ({ navigation }) => {
  const { user, isAuthenticated, localization, setLocalization } = useAuth();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [loadingList, setLoadingList] = useState(false);
  const styles = createStyles(theme);

  const [preferedSports, setPreferedSports] = useState<[] | { id: number, name: string }[]>([])
  const [isDetailAppointmentModalVisible, setIsDetailAppointmentModalVisible] = useState(false)
  const [isCreatePreferedSportsModalVisible, setIsCreatePreferedSportsModalVisible] = useState(false)
  const [appointments, setAppointments] = useState({ data: [] });
  const [appointmentSelected, setAppointmentSelected] = useState([]);

  const toggleCreatePreferedSportsModal = () => {
    setLoading(true)
    fetchPreferedSports().then(() => {
      setLoading(false)
    })
    setIsCreatePreferedSportsModalVisible(!isCreatePreferedSportsModalVisible)
  };
  const toggleDetailAppointmentModal = () => {
    setIsDetailAppointmentModalVisible(!isDetailAppointmentModalVisible)
  };
  const handlePreferedSportPress = (e) => {
    if (e === 0) {
      toggleCreatePreferedSportsModal()
    } else {
      navigate(navigation, screens.HomeAppointments.name as keyof RootStackParamList, isAuthenticated, user)
    }
  };
  const fetchPreferedSports = async () => {
    API.$sports_prefered.select_prefered_sports({ username: user.username })
      .then((result) => {
        if (result.data.length === 0) {
          setPreferedSports(result.data)
          setIsCreatePreferedSportsModalVisible(!isCreatePreferedSportsModalVisible)
        } else {
          setPreferedSports(result.data)
        }
      }).catch((e) => {
        console.log(e)
      })
  };
  const fetchAppointments = async (latitude: string, longitude: string) => {
    API.$appointments.select_appointments({ lat: latitude, longitude: longitude, username: user.username, preferSports: true, orderByTime: 'recent', distance: 'near', page: 1 })
      .then((result) => {
        setAppointments(result.data)
      }).catch((e) => {
        console.log(e)
      })
  };
  const fetchAll = async (list = false) => {
    try {
      if (list) {
        setLoadingList(true)
      } else {
        setLoading(true);
      }
      const localization = await fetchLocalization();
      setLocalization(localization);
      const fetchAppointmentsPromise = fetchAppointments(localization.lat, localization.longitude);
      const fetchPreferedSportsPromise = fetchPreferedSports();

      await Promise.all([fetchAppointmentsPromise, fetchPreferedSportsPromise]);
    } catch (err) {
      console.log(err)
    } finally {
      if (list) {
        setLoadingList(false)
      } else {
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    fetchAll()
  }, [])
  return (
    <View style={{flex: 1}}>
      {loading && <Loader />}
      <FlatList
        ListHeaderComponent={() => <Header theme={theme} user={user} />}
        onRefresh={async () => { await fetchAll(true); }}
        refreshing={loadingList}
        data={[{ key: 'unique' }]}
        renderItem={() =>
          <View>
            <CreateSportsPrefered open={isCreatePreferedSportsModalVisible} close={toggleCreatePreferedSportsModal} />
            <DetailAppointment open={isDetailAppointmentModalVisible} close={toggleDetailAppointmentModal} appointment={appointmentSelected} navigation={navigation} isAuthenticated={isAuthenticated} />
            <FavoriteSports theme={theme} user={user} data={preferedSports} action={handlePreferedSportPress} />
            <EventCardRow appointments={appointments} isAuthenticated={isAuthenticated} navigation={navigation} theme={theme} user={user} action={(e) => { if (appointmentSelected !== e) { setAppointmentSelected(e) }; toggleDetailAppointmentModal() }} />
          </View>
        }
        style={styles.container}
      />
    </View>
  );
};


// Estilos
const createStyles = (theme: typeof Light | typeof Dark) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.PRIMARY,
      flex: 1,
      paddingHorizontal: 20
    },

    ///
    scrollView: {
      flex: 1,
    },
    cardList: {
      marginLeft: 0, // Espaçamento à esquerda (ajuste conforme necessário)
      marginRight: 110, // Espaçamento à direita (ajuste conforme necessário)
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center'
    },
    notificationRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    sportSelectionRow: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      marginVertical: 30,
    },
    scheduledSuggestionsRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      justifyContent: 'space-between',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    column: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    centeredColumn: {
      alignItems: 'center',
    },
    notificationIcon: {
      marginTop: '30%',
    },
    userPicture: {
      marginTop: '30%',
      marginLeft: '5%',
      borderRadius: 50,
      borderWidth: 2,
      width: 55,
      height: 55,
    },
    sportText: {
      fontFamily: 'Sansation Regular',
      marginTop: '4%',
      fontSize: 13,
    },
    scheduledSuggestionsText: {
      fontFamily: 'Sansation Regular',
      fontWeight: 'bold',
      fontSize: 16,
      padding: 10,
    },
    viewAllButton: {
      fontFamily: 'Sansation Regular',
      fontSize: 13,
      padding: 10,
    },
    iconContainer: {
      width: 50,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      elevation: 8
    },
    eventCard: {
      width: 250,
      height: 400,
      marginVertical: 20,
      marginHorizontal: 15,
      justifyContent: 'flex-start',
      borderRadius: 10,
      elevation: 10,
    },
    eventImagePlaceholder: {
      flexDirection: 'row',
      marginVertical: 20,
      justifyContent: 'center',
    },
    eventDetailsRow: {
      flexDirection: 'row',
      marginLeft: '10%',
      alignItems: 'flex-start',
    },
    eventAdditionalInfoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: '10%',
      marginTop: '30%',
    },
    eventAddressText: {
      fontFamily: 'Sansation Regular',
      fontSize: 16,
    },
    eventInfoText: {
      fontFamily: 'Sansation Regular',
      fontSize: 13,
    },
  });

export default HomeStack;
