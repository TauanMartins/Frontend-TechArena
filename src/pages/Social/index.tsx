import React, { useEffect, useState } from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SectionList
} from 'react-native';
import { useTheme } from '../../utils/Theme/ThemeContext';
import { screens } from '../../navigation/ScreenProps';
import { RootStackParamList } from '../../navigation/NavigationTypes';
import { useAuth } from '../../utils/Auth/AuthContext';
import API from '../../utils/API';
import { Chat } from '../../components/Chat';
import LoaderUnique from '../../components/LoaderUnique';
import SocialChatStack from './Chat';
import { CollapseDown, CollapseRight, FriendsIcon, TeamsIcon } from '../../components/IconsButton';
import Notification from '../../components/Notification';
import Dark from '../../utils/Theme/Dark';
import Light from '../../utils/Theme/Light';
import { SearchFriendsAndSolicitations } from '../../components/SearchFriendsAndSolicitations';
import { SearchTeamsAndSolicitations } from '../../components/SearchTeamsAndSolicitations';

const Stack = createStackNavigator<RootStackParamList>();

const SocialStack = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName={screens.Social.name as keyof RootStackParamList}
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
        name={screens.Social.name as keyof RootStackParamList}
        options={{
          headerShown: false,
        }}
        component={Social}
      />
      <Stack.Screen
        name={screens.SocialChatStack.name as keyof RootStackParamList}
        options={{
          headerShown: false,
        }}
        component={SocialChatStack}
      />
    </Stack.Navigator>
  );
};

interface Chat {
  id: number;
  name: string;
  image: string;
  last_message: string;
}

interface ChatResponse {
  data: { friendsChats: Chat[], teamsChats: Chat[], appointmentsChats: Chat[] };
}


export const Social = ({ navigation }) => {
  const { user, isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    message: '',
    success: false,
    visible: false,
  });

  // variáveis para controlar aparecimento de modais.
  const [isFriendsModalVisible, setIsFriendsModalVisible] = useState(false);
  const [isTeamsModalVisible, setIsTeamsModalVisible] = useState(false);

  const [friendsChats, setFriendsChats] = useState<Chat[]>([]);
  const [teamsChats, setTeamsChats] = useState<Chat[]>([]);
  const [appointmentsChats, setAppointmentsChats] = useState<Chat[]>([]);

  const [showFriendsChats, setShowFriendsChats] = useState(true);
  const [showTeamsChats, setShowTeamsChats] = useState(true);
  const [showAppointmentsChats, setShowAppointmentsChats] = useState(true);

  const fetchChat = () => {
    setLoading(true);
    API.$chat.select_chats({ idToken: user.idToken }).then((response: ChatResponse) => {
      setFriendsChats(response.data.friendsChats);
      setTeamsChats(response.data.teamsChats);
      setAppointmentsChats(response.data.appointmentsChats);
    }).catch((erro: any) => {
      console.log(erro)
    }).finally(() => {
      setLoading(false);
    })
  };

  // Toggle dos modais
  const toggleFriendsModal = () => {
    setIsFriendsModalVisible(!isFriendsModalVisible);
  };
  const toggleTeamsModal = () => {
    setIsTeamsModalVisible(!isTeamsModalVisible);
  };

  // Toggle dos chats
  const toggleFriendsChats = () => setShowFriendsChats(!showFriendsChats);
  const toggleTeamsChats = () => setShowTeamsChats(!showTeamsChats);
  const toggleAppointmentsChats = () => setShowAppointmentsChats(!showAppointmentsChats);

  useEffect(() => {
    fetchChat();
  }, [])
  const renderChatItem = ({ item }) => (
    <Chat key={item.id} id={item.id} name={item.name} message={item.last_message} navigation={navigation} image={item.image} isAuthenticated={isAuthenticated} user={user} is_group_chat={item.is_group_chat} />
  );
  const renderSectionHeader = ({ section: { title } }) => {
    let toggle;
    let active;
    switch (title) {
      case 'Chat':
        toggle = toggleFriendsChats;
        active = showFriendsChats;
        break;
      case 'Chat do Time':
        toggle = toggleTeamsChats;
        active = showTeamsChats;
        break;
      case 'Chat do Agendamento':
        toggle = toggleAppointmentsChats;
        active = showAppointmentsChats
        break;
      default:
        toggle = () => { };
    }

    return (
      <TouchableOpacity onPress={toggle} style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>{title}</Text>{active ? <CollapseDown color={theme.SECONDARY} style={{ marginRight: 10 }} /> : <CollapseRight color={theme.SECONDARY} style={{ marginRight: 10 }} />}
      </TouchableOpacity>
    );
  };
  const renderItem = ({ item, section }) => {
    let isVisible: boolean;
    let isGroupChat: boolean;

    switch (section.title) {
      case 'Chat':
        isVisible = showFriendsChats;
        isGroupChat = false; // Friends chat é um chat pessoal, não de grupo
        break;
      case 'Chat do Time':
        isVisible = showTeamsChats;
        isGroupChat = true; // Team chat é um chat de grupo
        break;
      case 'Chat do Agendamento':
        isVisible = showAppointmentsChats;
        isGroupChat = true; // Appointment chat é um chat de grupo
        break;
      default:
        isVisible = false;
        isGroupChat = false;
    }

    // Se a visibilidade da seção está desativada, não renderize os itens
    if (!isVisible) return null;
    item.is_group_chat = isGroupChat;

    return renderChatItem({ item });
  };
  const renderSectionFooter = ({ section: { title, data } }) => {
    let isVisible = false;
    switch (title) {
      case 'Chat':
        isVisible = showFriendsChats;
        break;
      case 'Chat do Time':
        isVisible = showTeamsChats;
        break;
      case 'Chat do Agendamento':
        isVisible = showAppointmentsChats;
        break;
    }

    // Se a seção está vazia e visível, renderiza o rodapé
    if (data.length === 0 && isVisible) {
      return (
        <View style={styles.emptySection}>
          <Text style={styles.text_footer}>Nenhum chat ativo nesta categoria.</Text>
        </View>
      );
    }
    return null;
  };
  const sections = [
    { title: 'Chat', data: friendsChats },
    { title: 'Chat do Time', data: teamsChats },
    { title: 'Chat do Agendamento', data: appointmentsChats },
  ];
  return (
    <View style={{flex: 1, backgroundColor: theme.PRIMARY}}>
      <Notification
        message={notification.message}
        success={notification.success}
        visible={notification.visible}
        onClose={() => setNotification({ ...notification, visible: false })} />
      <View style={styles.headerRow}>
        <Text style={styles.title}>Social</Text>
      </View>
      <SectionList
        sections={sections}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        renderSectionFooter={renderSectionFooter}
        keyExtractor={(item, index) => item + index}
        onRefresh={fetchChat}
        refreshing={loading}
        style={styles.container}
      />
      <SearchFriendsAndSolicitations open={isFriendsModalVisible} close={toggleFriendsModal} navigation={navigation} />
      <SearchTeamsAndSolicitations open={isTeamsModalVisible} close={toggleTeamsModal} navigation={navigation} />
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.teams} onPress={toggleTeamsModal}>
          <TeamsIcon color={theme.SECONDARY} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.friends} onPress={toggleFriendsModal}>
          <FriendsIcon color={theme.SECONDARY} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (theme: typeof Light | typeof Dark) =>
  StyleSheet.create({
    emptySection: {
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: theme.PRIMARY,
      paddingVertical: 20,
      paddingHorizontal: 15,
      elevation: 4
    },
    sectionHeaderText: {
      fontFamily: 'Sansation Regular',
      fontSize: 18,
      color: theme.SECONDARY,
    },
    friends: {
      width: 60,
      height: 60,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.PRIMARY, // Substitua pela cor desejada
      borderRadius: 30,
      elevation: 5, // Sombra para Android
      shadowColor: '#000', // Sombra para iOS
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    teams: {
      width: 60,
      height: 60,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.PRIMARY, // Substitua pela cor desejada
      borderRadius: 30,
      elevation: 5, // Sombra para Android
      shadowColor: '#000', // Sombra para iOS
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    buttonsContainer: {
      flexDirection: 'row',
      backgroundColor: theme.PRIMARY,
      padding: 10,
      marginLeft: 20,
      marginRight: 20,
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    chatToChatButton: {
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      backgroundColor: theme.PRIMARY,
    },
    container: {
      flex: 1,
      backgroundColor: theme.PRIMARY,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginVertical: 15,
      padding: 10
    },
    col: {
      flexDirection: 'column',
    },
    title: {
      fontFamily: 'Sansation Regular',
      fontSize: 28,
      color: theme.SECONDARY,
    },
    subtitle: {
      fontFamily: 'Sansation Regular',
      fontSize: 18,
      marginHorizontal: 10,
      color: theme.SECONDARY,
    },
    headerRow: {
      backgroundColor: theme.PRIMARY,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 15
    },
    text: {
      fontFamily: 'Sansation Regular',
      fontSize: 13,
      color: theme.SECONDARY,
    },
    text_footer: {
      fontFamily: 'Sansation Regular',
      fontSize: 16,
      color: theme.SECONDARY,
    },
  });

export default SocialStack;
