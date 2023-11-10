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
import Light from '../../utils/Theme/Light';
import { useAuth } from '../../utils/Auth/AuthContext';
import API from '../../utils/API';
import { Chat } from '../../components/Chat';
import LoaderUnique from '../../components/LoaderUnique';
import SocialChatStack from './Chat';
import { AddUserFriendIcon, ChatIcon, ChatsIcon } from '../../components/IconsButton';
import { Image } from 'react-native-elements';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import Notification from '../../components/Notification';
import { navigate } from '../../navigation/NavigationUtils';

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
  data: Chat[];
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
  const [chats, setChats] = useState<Chat[] | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inputUserSearchForUsers, setinputUserSearchForUsers] = useState('');
  const [isFriendsModalVisible, setIsFriendsModalVisible] = useState(false);
  const [friends, setFriends] = useState<Friend[] | null>(null);
  const [friendsReceived, setFriendsReceived] = useState<Friend[] | null>(null);
  const [friendsRequested, setFriendsRequested] = useState<Friend[] | null>(null);

  const [usersSearched, setUsersSearched] = useState<UsersSearch[] | null>(null)
  const [notification, setNotification] = useState({
    message: '',
    success: false,
    visible: false,
  });
  const handleSendFriendRequest = (userPossibleFriend: UsersSearch) => {
    ConfirmationDialog({
      title: 'Confirmação',
      message: 'Deseja enviar pedido de amizade?',
      onConfirm: async () => {
        setLoading(true);
        API.$friends.request_friend({ username_user_1: user.username, username_user_2: userPossibleFriend.username })
          .then((response: UsersSearchResponse) => {
            setUsersSearched(response.data);
            setNotification({
              message: 'Pedido de amizade enviado com sucesso!',
              success: true,
              visible: true,
            });
          })
          .catch((error: any) => {
            setNotification({
              message: 'Não conseguimos enviar o pedido de amizade :(',
              success: false,
              visible: true,
            });
          }).finally(() => {
            setLoading(false);
          })
      },
      onCancel: () => { },
    });
  };
  const handleAcceptRequest = (userPossibleFriend: UsersSearch) => {
    ConfirmationDialog({
      title: 'Confirmação',
      message: 'Deseja aceitar o pedido de amizade?',
      onConfirm: async () => {
        setLoading(true);
        API.$friends.accept_friend({ username_user_1: user.username, username_user_2: userPossibleFriend.username })
          .then((response) => {
            setNotification({
              message: 'Pedido de amizade aceito com sucesso!',
              success: true,
              visible: true,
            });
            fetchFriends();
          })
          .catch((error: any) => {
            setNotification({
              message: 'Não conseguimos aceitar o pedido de amizade :(',
              success: false,
              visible: true,
            });
          }).finally(() => {
            setLoading(false);
          })
      },
      onCancel: () => { },
    });
  };
  const handleChatToUser = (friend: UsersSearch) => {
    ConfirmationDialog({
      title: 'Confirmação',
      message: 'Deseja iniciar uma conversa?',
      onConfirm: async () => {
        setLoading(true);
        API.$chat.post_chats({ username_user_1: user.username, username_user_2: friend.username })
          .then((response) => {
            toggleFriendsModal();
            navigate(navigation,
              screens.SocialChatStack.name as keyof RootStackParamList,
              isAuthenticated,
              user, { chat_id: response.data.chat_id, friend: friend.name, image: friend.image })
          })
          .catch((error: any) => {
            console.log(error);
            setNotification({
              message: 'Não conseguimos iniciar uma conversa :(',
              success: false,
              visible: true,
            });
          }).finally(() => {
            setLoading(false);
          })
      },
      onCancel: () => { },
    });
  };
  const handleSearch = () => {
    setLoading(true);
    API.$users.select_users({ search: inputUserSearchForUsers })
      .then((response: UsersSearchResponse) => {
        setUsersSearched(response.data);
      })
      .catch((error: any) => {
        console.error(error);
      }).finally(() => {
        setLoading(false);
      })
  };
  const fetchChat = () => {
    setLoading(true);
    API.$chat.select_chats({ idToken: user.idToken }).then((response: ChatResponse) => {
      return setChats(response.data)
    }).catch((erro: any) => {
      console.log(erro)
    }).finally(() => {
      setLoading(false);
    })
  };
  const fetchFriends = () => {
    setLoading(true);
    API.$friends.list_friends({ username: user.username }).then((response: FriendsResponse) => {
      setFriends(response.data.friends)
      setFriendsReceived(response.data.received_friends)
      setFriendsRequested(response.data.requested_friends)
    }).catch((erro: any) => {
      console.log(erro)
    }).finally(() => {
      setLoading(false);
    })
  };
  const toggleModal = () => {
    setinputUserSearchForUsers('');
    setUsersSearched(null)
    setIsModalVisible(!isModalVisible);
  };
  const toggleFriendsModal = () => {
    if (!isFriendsModalVisible) { fetchFriends(); }
    setIsFriendsModalVisible(!isFriendsModalVisible);
  };
  useEffect(() => {
    fetchChat();
  }, [])
  const renderItemUser = ({ item: user }) => (
    <TouchableOpacity onPress={() => handleSendFriendRequest(user)} style={styles.userButton}>
      <Image style={styles.userImage} source={{ uri: user.image }} />
      <View style={styles.userContent}>
        <Text style={styles.chat_text_title}>{user.name}</Text>
        <Text style={styles.chat_text_title}>{user.username}</Text>
      </View>
    </TouchableOpacity>
  );
  const renderItemFriends = ({ item: user }) => (
    <TouchableOpacity onPress={() => { handleChatToUser(user) }} style={styles.friendButton}>
      <Image style={styles.userImage} source={{ uri: user.image }} />
      <View style={{ justifyContent: 'space-between', flex: 1, flexDirection: 'row' }}>
        <View style={styles.friendContent}>
          <Text style={styles.chat_text_title}>{user.name}</Text>
          <Text style={styles.chat_text_title}>{user.username}</Text>
        </View>
        <ChatIcon color={theme.SECONDARY} />
      </View>
    </TouchableOpacity>
  );
  const renderItemFriendsRequested = ({ item: user }) => (
    <TouchableOpacity onPress={() => { }} style={styles.friendButton}>
      <Image style={styles.userImage} source={{ uri: user.image }} />
      <View style={styles.friendContent}>
        <View style={styles.col}>
          <Text style={styles.chat_text_title}>{user.name}</Text>
          <Text style={styles.chat_text_title}>{user.username}</Text>
        </View>
        <Text style={styles.chat_text}>Pendente</Text>
      </View>
    </TouchableOpacity>
  );
  const renderItemFriendsReceived = ({ item: user }) => (
    <TouchableOpacity onPress={() => { handleAcceptRequest(user) }} style={styles.friendButton}>
      <Image style={styles.userImage} source={{ uri: user.image }} />
      <View style={styles.friendContent}>
        <View style={styles.col}>
          <Text style={styles.chat_text_title}>{user.name}</Text>
          <Text style={styles.chat_text_title}>{user.username}</Text>
        </View>
        <Text style={styles.chat_text}>Aceitar</Text>
      </View>
    </TouchableOpacity>
  );
  const renderChatItem = ({ item }) => (
    <Chat key={item.id} id={item.id} styles={styles} friend={item.name} message={item.last_message} navigation={navigation} image={item.image} isAuthenticated={isAuthenticated} user={user} />
  );
  return (
    <>
      <FlatList
        ListHeaderComponent={(
          <>
            <View style={styles.headerRow}>
              <Text style={styles.title}>Social</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.subtitle}>Amigos</Text>
              <TouchableOpacity style={{ padding: 10 }} onPress={toggleModal}>
                <AddUserFriendIcon color={theme.SECONDARY} />
              </TouchableOpacity>
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
      <Modal animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}>

        <View style={{ ...styles.modalView, backgroundColor: theme.PRIMARY }}>
          <Text style={styles.modalText}>Usuários</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={inputUserSearchForUsers}
              onChangeText={setinputUserSearchForUsers}
              placeholder="Digite o nome do usuário"
            />
            <TouchableOpacity
              onPress={handleSearch}
              disabled={inputUserSearchForUsers.length === 0}
              style={{ ...styles.sendButton, backgroundColor: theme.TERTIARY }}
            >
              <Text style={{ ...styles.sendButtonText, color: theme.QUATERNARY }}>Pesquisar</Text>
            </TouchableOpacity>
          </View>
          {loading && <LoaderUnique />}
          <FlatList
            data={usersSearched}
            renderItem={renderItemUser}
            keyExtractor={(userSearched) => userSearched.id.toString()}
            style={styles.list}
          />
          <TouchableOpacity style={{ ...styles.modalButton, backgroundColor: theme.TERTIARY }} onPress={toggleModal}>
            <Text style={styles.modalButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isFriendsModalVisible}
        onRequestClose={toggleFriendsModal}
      >
        <View style={{ ...styles.modalView, backgroundColor: theme.PRIMARY }}>
          {loading && <LoaderUnique />}
          <Text style={styles.modalText}>Amigos</Text>
          <FlatList
            data={friends}
            renderItem={renderItemFriends}
            keyExtractor={(friend) => friend.id.toString()}
            style={styles.list}
          />
          <Text style={styles.modalText}>Solicitações de amizade</Text>
          {friendsRequested && friendsRequested.length > 0 &&
            (<FlatList
              data={friendsRequested}
              renderItem={renderItemFriendsRequested}
              keyExtractor={(friend) => friend.id.toString()}
              style={styles.list}
            />)}
          {friendsReceived && friendsReceived.length > 0 &&
            (<FlatList
              data={friendsReceived}
              renderItem={renderItemFriendsReceived}
              keyExtractor={(friend) => friend.id.toString()}
              style={styles.list}
            />)}
          <TouchableOpacity style={{ ...styles.modalButton, backgroundColor: theme.TERTIARY }} onPress={toggleFriendsModal}>
            <Text style={styles.modalButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <TouchableOpacity
        style={styles.addButton}
        onPress={toggleFriendsModal}>
        <ChatsIcon color={theme.SECONDARY} />
      </TouchableOpacity>
      <Notification
        message={notification.message}
        success={notification.success}
        visible={notification.visible}
        onClose={() => setNotification({ ...notification, visible: false })} />
    </>
  );
};

const createStyles = (theme: typeof Light) =>
  StyleSheet.create({
    addButton: {
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
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 15,
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
