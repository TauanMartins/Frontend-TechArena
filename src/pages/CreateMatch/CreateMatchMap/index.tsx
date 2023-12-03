import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ScreenProps, screens } from '../../../navigation/ScreenProps';
import { StyleSheet, FlatList, View, TouchableOpacity, Text, TouchableHighlight, SectionList, Image, TouchableWithoutFeedback, Dimensions } from 'react-native';
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
import MapView, { Callout, Marker } from 'react-native-maps';
import { ArenaImage } from '../../../components/ArenaImage';
import { useFocusEffect } from '@react-navigation/native';

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
  const [arenas, setArenas] = useState([]);
  var arenaId = route.params?.arena_id;
  const [selectedArena, setSelectedArena] = useState(null);
  const [selectedArenaSportsEnabled, setSelectedArenaSportsEnabled] = useState([]);
  const [region, setRegion] = useState({
    latitude: parseFloat(localization.lat),
    longitude: parseFloat(localization.longitude),
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const fetchArenas = () => {
    if (arenas.length === 0) {
      setLoading(true)
    }
    API.$arenas_user.select_arenas_user({ lat: localization.lat, longitude: localization.longitude }).then(async (response) => {
      setArenas(response.data)
      if (!arenaId) {
        setRegion({
          ...region,
          latitude: parseFloat(localization.lat),
          longitude: parseFloat(localization.longitude)
        })
      }
    }).catch((err) => {
      console.log(err)
    }).finally(() => {
      setLoading(false)
    })
  };
  const fetchSportsArena = () => {
    API.$sport_arena.select_sports_arena({ arena_id: selectedArena.id }).then(async (response) => {
      setSelectedArenaSportsEnabled(response.data)
    }).catch((err) => {
      console.log(err)
    }).finally(() => {
      navigation.setParams({ arena_id: null });
    })
  };

  useFocusEffect(
    useCallback(() => {
      fetchArenas();
    }, [])
  );

  const markerRefs = useRef(new Map());

  useEffect(() => {
    if (selectedArena && markerRefs.current.has(selectedArena.id)) {
      fetchSportsArena();
      setTimeout(async () => {
        markerRefs.current.get(selectedArena.id).showCallout();
      }, 500);
    }
  }, [selectedArena]);
  useEffect(() => {
    const selectedArena = arenas.find(arena => arena.id === arenaId);
    if (selectedArena) {
      setSelectedArena(selectedArena)
      setRegion({
        latitude: parseFloat(selectedArena.lat),
        longitude: parseFloat(selectedArena.longitude),
        latitudeDelta: 0.03,
        longitudeDelta: 0.01,
      });
    }
  }, [arenas]);

  return (
    <View style={styles.container}>
      {loading && <Loader />}
      <MapView
        style={{ flex: 1, width: '100%', height: '100%' }}
        region={region}
        initialRegion={region}
        onRegionChangeComplete={setRegion}
        loadingEnabled={true}
        showsUserLocation
        loadingIndicatorColor={theme.SECONDARY}
        loadingBackgroundColor={theme.PRIMARY}
        zoomControlEnabled
        userInterfaceStyle={user.prefered_theme}
      >
        {arenas.map((arena) => (
          <Marker
            key={arena.id}
            coordinate={{ latitude: parseFloat(arena.lat), longitude: parseFloat(arena.longitude) }}
            onPress={(e) => { setSelectedArenaSportsEnabled([]); setSelectedArena(arena); }}
            ref={(ref) => {
              markerRefs.current.set(arena.id, ref);
            }}
            onCalloutPress={() => navigation.navigate('CreateMatchHome', { arena: arena })}
            title={arena.address}
            description={`Esportes possíveis: ${selectedArenaSportsEnabled.map((sport) => sport.name).join(', ')}`}
          />
        ))}
      </MapView>
    </View>
  );
};

const createStyles = (theme: typeof Light | typeof Dark) =>
  StyleSheet.create({
    modalContainer: {
      backgroundColor: theme.TERTIARY,
      borderRadius: 10,
      padding: 10,
      alignItems: 'center',
      marginBottom: 10,
      position: 'relative',
    },
    modalTitle: {
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 16,
      fontFamily: 'Sansation Regular',
      color: theme.QUATERNARY, // Supondo que você tenha um tema de texto primário
    },
    modalSubTitle: {
      fontWeight: 'bold',
      fontSize: 13,
      fontFamily: 'Sansation Regular',
      color: theme.QUATERNARY, // Supondo que você tenha um tema de texto primário
    },
    modalText: {
      flexDirection: 'row',
      textAlign: 'left',
      fontSize: 13,
      fontFamily: 'Sansation Regular',
      color: theme.QUATERNARY, // Supondo que você tenha um tema de texto primário
    },
    modalButton: {
      backgroundColor: theme.PRIMARY, // Supondo que você tenha uma cor de acento no seu tema
      borderRadius: 20,
    },
    modalButtonText: {
      color: theme.QUATERNARY,
      fontSize: 14,
      fontFamily: 'Sansation Regular',
      fontWeight: 'bold',
    },
    userLocationMarker: {
      padding: 5,
      backgroundColor: 'cadetblue',
      borderRadius: 20,
      borderColor: theme.SECONDARY,
      borderWidth: 2,
    },
    buttonContainer: {
      position: 'absolute',
      bottom: 25,
      left: 25,
    },
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
