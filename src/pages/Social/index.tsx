import React, { useEffect, useState } from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal, TextInput, FlatList
} from 'react-native';
import { useTheme } from '../../utils/Theme/ThemeContext';
import { screens } from '../../navigation/ScreenProps';
import { RootStackParamList } from '../../navigation/NavigationTypes';
import { useAuth } from '../../utils/Auth/AuthContext';
import API from '../../utils/API';
import { Chat } from '../../components/Chat';
import LoaderUnique from '../../components/LoaderUnique';
import SocialChatStack from './Chat';
import { AddUserFriendIcon, ChatIcon, FriendsIcon, SocialIcon, TeamsIcon } from '../../components/IconsButton';
import { Image } from 'react-native-elements';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import Notification from '../../components/Notification';
import { navigate } from '../../navigation/NavigationUtils';
import { Keyboard } from 'react-native';
import Dark from '../../utils/Theme/Dark';
import Light from '../../utils/Theme/Light';
import { SearchUsers } from '../../components/SearchUsers';
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


interface UsersSearch {
  id: number;
  name: string;
  image: string;
  username: string;
}

interface UsersSearchResponse {
  data: UsersSearch[];
}

interface Friend {
  id: number;
  name: string;
  image: string;
  username: string;
}

interface FriendsResponse {
  data: { friends: Friend[], received_friends: Friend[], requested_friends: Friend[] };
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

  const [chats, setChats] = useState<Chat[] | null>(null);

  const fetchChat = () => {
    setLoading(true);
    API.$chat.select_chats({ idToken: user.idToken }).then((response: ChatResponse) => {
      return setChats(response.data.friendsChats)
    }).catch((erro: any) => {
      console.log(erro)
    }).finally(() => {
      setLoading(false);
    })
  };
  const toggleFriendsModal = () => {
    setIsFriendsModalVisible(!isFriendsModalVisible);
  };
  const toggleTeamsModal = () => {
    setIsTeamsModalVisible(!isTeamsModalVisible);
  };
  useEffect(() => {
    fetchChat();
  }, [])
  const renderChatItem = ({ item }) => (
    <Chat key={item.id} id={item.id} name={item.name} message={item.last_message} navigation={navigation} image={item.image} isAuthenticated={isAuthenticated} user={user} />
  );
  return (
    <>
      <Notification
        message={notification.message}
        success={notification.success}
        visible={notification.visible}
        onClose={() => setNotification({ ...notification, visible: false })} />
      <FlatList
        ListHeaderComponent={(
          <>
            <View style={styles.headerRow}>
              <Text style={styles.title}>Social</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.subtitle}>Chat</Text>
            </View>
            <View style={{ ...styles.col, borderTopWidth: 1.5, borderColor: theme.TERTIARY }}>
              {loading && <LoaderUnique />}
            </View>
          </>
        )}
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={(chat) => chat.id.toString()}
        onRefresh={fetchChat}
        refreshing={loading}
        ListEmptyComponent={(
          <View style={styles.headerRow}>
            <Text style={styles.text}>Desculpe, você não possui chats ativos.</Text>
          </View>
        )}
        style={styles.container}
      />
      <SearchFriendsAndSolicitations open={isFriendsModalVisible} close={toggleFriendsModal} navigation={navigation} />
      <SearchTeamsAndSolicitations open={isTeamsModalVisible} close={toggleTeamsModal} navigation={navigation} />
      <TouchableOpacity style={styles.teams} onPress={toggleTeamsModal}>
        <TeamsIcon color={theme.SECONDARY} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.friends} onPress={toggleFriendsModal}>
        <FriendsIcon color={theme.SECONDARY} />
      </TouchableOpacity>
    </>
  );
};

const createStyles = (theme: typeof Light | typeof Dark) =>
  StyleSheet.create({
    friends: {
      position: 'absolute',
      right: 20,
      bottom: 20,
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
      position: 'absolute',
      left: 20,
      bottom: 20,
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
    chatToChatButton: {
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      backgroundColor: theme.PRIMARY,
    },
    addButtonText: {
      fontSize: 24,
      color: theme.SECONDARY, // Substitua pela cor desejada
    },
    list: {
      flex: 1,
      width: '100%'
    },
    inputContainer: {
      flexDirection: 'row',
      padding: 10,
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%', // Ocupa a largura total
      marginBottom: 20, // Adiciona espaçamento antes da lista começar
    },
    input: {
      flex: 1,
      padding: 10,
      borderRadius: 20,
      backgroundColor: theme.TERTIARY,
      marginRight: 10,
      fontFamily: 'Sansation Regular',
      fontSize: 16,
    },
    sendButton: {
      padding: 10,
      borderRadius: 20,
      backgroundColor: theme.SECONDARY,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sendButtonText: {
      fontFamily: 'Sansation Regular',
      fontSize: 16,
      color: '#fff',
    },
    modalView: {
      margin: 20,
      marginTop: 50, // Adiciona espaço na parte superior do modal
      marginBottom: 50, // Adiciona espaço na parte inferior do modal
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      justifyContent: 'flex-start', // Conteúdo alinhado ao topo
      backgroundColor: theme.PRIMARY,
      elevation: 5,
      position: 'absolute',
      left: 20,
      right: 20,
      top: 50,
      bottom: 50,
    },
    modalButton: {
      padding: 15,
      borderRadius: 20,
      position: 'absolute',
      bottom: 20,
      left: 20,
      right: 20,
      backgroundColor: theme.TERTIARY,
    },
    modalText: {
      fontFamily: 'Sansation Regular',
      fontSize: 20,
      color: theme.SECONDARY,
      textAlign: 'center',
    },
    modalButtonText: {
      fontFamily: 'Sansation Regular',
      fontSize: 16,
      color: theme.QUATERNARY,
      textAlign: 'center',
    },
    container: {
      flex: 1,
      backgroundColor: theme.PRIMARY,
    },
    userImage: {
      borderWidth: 2,
      borderRadius: 25,
      width: 40,
      height: 40,
      marginRight: 10,
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
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 15,
    },
    text: {
      fontFamily: 'Sansation Regular',
      fontSize: 13,
      color: theme.SECONDARY,
    },
    userButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderBottomWidth: 1,
      borderColor: theme.TERTIARY,
      marginBottom: 10,
    },
    userContent: {
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    friendButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderBottomWidth: 1,
      borderColor: theme.TERTIARY,
    },
    friendContent: {
      justifyContent: 'center',
      alignItems: 'flex-start',
    },


    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 4,
      paddingVertical: 12,
      elevation: 3,
      backgroundColor: theme.PRIMARY,
    },


    friendsRequests: {
      flexDirection: 'row',
      justifyContent: 'space-between', // Centraliza verticalmente
      alignItems: 'center',  // Centraliza o conteúdo do chat verticalmente
    },


    chatButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderBottomWidth: 1,
      borderColor: theme.TERTIARY,
    },
    chatContent: {
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    chat_text_title: {
      fontFamily: 'Sansation Regular',
      fontSize: 16,
      color: theme.SECONDARY,
    },
    chat_text: {
      fontFamily: 'Sansation Regular',
      fontSize: 13,
      color: theme.SECONDARY,
    },
  });

export default SocialStack;
