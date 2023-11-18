import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  FlatList
} from 'react-native';
import { useTheme } from '../../utils/Theme/ThemeContext';
import { ScreenProps, screens } from '../../navigation/ScreenProps';
import { RootStackParamList } from '../../navigation/NavigationTypes';
import { NotificationIcon } from '../../components/IconsButton';
import { useAuth } from '../../utils/Auth/AuthContext';
import Recommended from './Recommended';
import { navigate } from '../../navigation/NavigationUtils';
import { AvatarImage } from '../../components/AvatarImage';

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
        name={screens.HomeRecommendedSchedules.name as keyof RootStackParamList}
        options={{
          headerShown: false,
        }}
        component={Recommended}
      />
    </Stack.Navigator>
  );
};

// Carregamento de ícones esportivos
const sportIcons = {
  basquete: require('../../assets/LogoSports/basquete.png'),
  futebol: require('../../assets/LogoSports/futebol.png'),
  vôlei: require('../../assets/LogoSports/vôlei.png'),
  tênis: require('../../assets/LogoSports/tênis.png'),
};

// Componente para exibir ícones esportivos
const SportIcon = ({ iconName, sportName, colorButton, color }) => (
  <View style={styles.centeredColumn}>
    <View style={[styles.iconContainer, { backgroundColor: colorButton }]}>
      <Image source={sportIcons[iconName]} />
    </View>
    <Text style={[styles.sportText, { color }]}>
      {sportName}
    </Text>
  </View>
);

// Página inicial
const Home = ({ navigation }) => {
  const { user, isAuthenticated } = useAuth();
  const { theme: { PRIMARY, SECONDARY, QUATERNARY, BASQUETE, FUTEBOL, VOLEI, TENIS } } = useTheme();

  return (
    <ScrollView style={[styles.scrollView, { backgroundColor: PRIMARY }]} >
      <View style={[styles.container, { backgroundColor: PRIMARY }]}>
        <Header user={user} SECONDARY={SECONDARY} />
        <SportSelectionRow SECONDARY={SECONDARY} BASQUETE={BASQUETE} FUTEBOL={FUTEBOL} VOLEI={VOLEI} TENIS={TENIS} />
        <ScheduledSuggestionsRow SECONDARY={SECONDARY} navigation={navigation} isAuthenticated={isAuthenticated} user={user} />
        <EventCardRow QUATERNARY={QUATERNARY} navigation={navigation} isAuthenticated={isAuthenticated} user={user} BASQUETE={BASQUETE} />
      </View>
    </ScrollView>
  );
};

// Componentes Auxiliares
const Header = ({ user, SECONDARY }) => (
  <View style={styles.headerRow}>
    <View style={styles.column}>
      <Text style={[styles.welcomeText, { color: SECONDARY }]}>
        Olá, {user.name}!
      </Text>
      <Text style={[styles.findMatchesText, { color: SECONDARY }]}>
        Encontre partidas
      </Text>
    </View>
    <View style={styles.column}>
      <UserNotificationRow user={user} SECONDARY={SECONDARY} />
    </View>
  </View>
);

const UserNotificationRow = ({ user, SECONDARY }) => (
  <View style={styles.notificationRow}>
    <NotificationIcon style={styles.notificationIcon} color={SECONDARY} size={32} />
    {user.picture && (
      <AvatarImage image={ user.picture} size={55}/>
    )}
  </View>
);

const SportSelectionRow = ({ SECONDARY, BASQUETE, FUTEBOL, VOLEI, TENIS }) => (
  <View style={styles.sportSelectionRow}>
    <SportIcon iconName="basquete" sportName="Basquete" colorButton={BASQUETE} color={SECONDARY} />
    <SportIcon iconName="futebol" sportName="Futebol" colorButton={FUTEBOL} color={SECONDARY} />
    <SportIcon iconName="vôlei" sportName="Vôlei" colorButton={VOLEI} color={SECONDARY} />
    <SportIcon iconName="tênis" sportName="Tênis" colorButton={TENIS} color={SECONDARY} />
  </View>
);

const ScheduledSuggestionsRow = ({ SECONDARY, navigation, isAuthenticated, user }) => (
  <View style={styles.scheduledSuggestionsRow}>
    <View style={styles.column}>
      <Text style={[styles.scheduledSuggestionsText, { color: SECONDARY }]}>Sugestões agendadas</Text>
    </View>
    <View style={styles.column}>
      <Text style={[styles.viewAllButton, { color: SECONDARY }]} onPress={() => navigate(navigation, screens.HomeRecommendedSchedules.name as keyof RootStackParamList, isAuthenticated, user)}>Ver todas</Text>
    </View>
  </View>
);

const EventCardRow = ({ QUATERNARY, navigation, isAuthenticated, user, BASQUETE }) => (
  <FlatList
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.cardList} // Adicione este estilo
    data={[1, 2, 3, 4]} // Array com 4 elementos para representar os 4 cards
    renderItem={({ item }) => (
      <View style={styles.centeredColumn}>
        <TouchableOpacity onPress={() => navigate(navigation, screens.HomeRecommendedSchedules.name as keyof RootStackParamList, isAuthenticated, user)}>
          <EventCard QUATERNARY={QUATERNARY} BASQUETE={BASQUETE} />
        </TouchableOpacity>
      </View>
    )}
    keyExtractor={item => item.toString()}
  />
);

const EventCard = ({ QUATERNARY, BASQUETE }) => (
  <View style={[styles.eventCard, { backgroundColor: BASQUETE }]}>
    <View style={{ ...styles.eventImagePlaceholder }}>
      <View style={{ backgroundColor: 'gray', width: '85%', height: 200, borderRadius: 10 }}></View>
    </View>
    <View style={styles.column}>
      <View style={{ ...styles.eventDetailsRow }}>
        <Text style={{ ...styles.eventAddressText, color: QUATERNARY }}>
          SQN 909, Norte - Asa Norte
        </Text>
      </View>
      <View style={{ ...styles.eventDetailsRow }}>
        <Text style={{ ...styles.eventInfoText, color: QUATERNARY }}>
          Segunda-feira às 9:00h
        </Text>
      </View>
      <View style={styles.eventAdditionalInfoRow}>
        <Text style={[styles.eventInfoText, { color: QUATERNARY }]}>
          1KM
        </Text>
        <Text style={[styles.eventInfoText, { color: QUATERNARY }]}>
          8/10
        </Text>
      </View>
    </View>
  </View>
);

// Estilos
const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1
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
  welcomeText: {
    fontFamily: 'Sansation Regular',
    marginTop: '10%',
    fontSize: 13,
  },
  findMatchesText: {
    fontFamily: 'Sansation Regular',
    fontSize: 28,
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
