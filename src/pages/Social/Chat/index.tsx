import React, { useEffect, useState, useRef } from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { screens } from '../../../navigation/ScreenProps';
import { RootStackParamList } from '../../../navigation/NavigationTypes';
import { useAuth } from '../../../utils/Auth/AuthContext';
import { useTheme } from '../../../utils/Theme/ThemeContext';
import { FlatList, TextInput, TouchableOpacity, Text, View, Image, StyleSheet, Keyboard } from 'react-native';
import { BackButton } from '../../../components/IconsButton';
import API from '../../../utils/API';
import Loader from '../../../components/Loader';
import ConfirmationDialog from '../../../components/ConfirmationDialog';
import Notification from '../../../components/Notification';

const Stack = createStackNavigator<RootStackParamList>();

const SocialChatStack = ({ route }) => {

  const { theme } = useTheme();
  return (
    <Stack.Navigator
      initialRouteName={screens.SocialChat.name as keyof RootStackParamList}
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
        initialParams={route.params}
        name={screens.SocialChat.name as keyof RootStackParamList}
        options={{ headerShown: false }}
        component={SocialChat}
      />
      {/* <Stack.Screen
        name={screens.SettingsThemePreferences.name as keyof RootStackParamList}
        options={{
          headerShown: false,
        }}
        component={}
      /> */}
    </Stack.Navigator>
  );
};

interface Message {
  id: number;
  message: string;
  created_at: string;
  chat_id: string;
  username: string;
}

interface Data {
  data: Message[],
  next_cursor: string
};
interface MessageResponse {
  data: Data;
}

export const SocialChat = ({ navigation, route }) => {
  const { isAuthenticated, user } = useAuth();
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isScreenActive, setIsScreenActive] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [nextPageCursor, setNextPageCursor] = useState(null);
  const ws = useRef(null);

  const flatListRef = useRef(null);
  const friend = route.params.friend;
  const image = route.params.image;
  const chat_id = route.params.chat_id;

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const formatTime = (createdAt: string | number | Date) => {
    const date = new Date(createdAt);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };
  const fetchMessages = () => {
    API.$messages.select_messages({ idToken: user.idToken, chat_id: chat_id })
      .then((response: MessageResponse) => {
        setMessages(response.data.data);
        setNextPageCursor(response.data.next_cursor);
      })
      .catch((error: any) => {
        console.error(error);
      }).finally(() => {
        setLoading(false);
        scrollToBottom();
      });
  };
  const loadMoreMessages = () => {
    if (loading || !nextPageCursor) return;
    setRefreshing(true);
    API.$messages.select_messages({ idToken: user.idToken, chat_id: chat_id, cursor: nextPageCursor })
      .then((response: MessageResponse) => {
        const newMessages = response.data.data.filter(
          newMessage => !messages.some(message => message.id === newMessage.id)
        );
        setMessages([...newMessages, ...messages]);
        setNextPageCursor(response.data.next_cursor);
      })
      .catch((error: any) => {
        console.error(error);
      }).finally(() => {
        setRefreshing(false)
      });
  };
  const openWebSocketConnection = () => {
    // Fechando a conexão WebSocket existente se estiver aberta
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.close();
    }

    // Abrindo uma nova conexão WebSocket
    ws.current = new WebSocket('https://chat.techarena.com.br/app/local_key');

    ws.current.onopen = () => {
      const subscribeMessage = {
        event: 'pusher:subscribe',
        data: {
          channel: `public.chat.${chat_id}`
        }
      };
      console.log('Estava fechada.')
      ws.current.send(JSON.stringify(subscribeMessage));
    };
    ws.current.onmessage = (e) => {
      // Receive a message from the server
      fetchMessages();
      console.log('on message: ', (JSON.parse(e.data)));
    };

    ws.current.onerror = (e: any) => {
      // An error occurred
      console.log(e.message);
    };

    ws.current.onclose = (e) => {
      // Connection closed
      console.log(e.code, e.reason);
    };

    fetchMessages();


  };
  const sendMessages = (message: string) => {
    if (ws.current.readyState === WebSocket.CLOSED) {
      openWebSocketConnection();
    }
    API.$messages.create_message({ idToken: user.idToken, chat_id: chat_id, message: message })
      .then((response: MessageResponse) => {
        //console.log(response)
      })
      .catch((error: any) => {
        console.error(error);
      })
      .finally(() => {
        scrollToBottom();
        setInputMessage('');
      });
  };

  useEffect(() => {

    setLoading(true)
    openWebSocketConnection();
    return () => {
      // Fechando a conexão WebSocket quando o componente é desmontado
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.close();
      }
    };
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', scrollToBottom);
    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleSendMessage = () => {
    sendMessages(inputMessage);
  };

  const isMyMessage = (message: Message) => {
    return message.username === user.username;
  };

  const renderItem = ({ item: message }) => (
    <View key={message.id} style={[
      styles.messageRow,
      isMyMessage(message) ? styles.myMessage : styles.friendMessage
    ]}>
      <Text style={{ ...styles.message, color: theme.SECONDARY }}>
        {message.message}
      </Text>
      <Text style={styles.time}>
        {formatTime(message.created_at)}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading && <Loader />}
      <View style={styles.headerRow}>
        <BackButton onPress={() => navigation.goBack()} style={{}} color={theme.SECONDARY} />
        <View style={styles.row}>
          <Image style={{ ...styles.image, borderColor: theme.SECONDARY }} source={{ uri: image }} />
          <Text style={{ ...styles.title, color: theme.SECONDARY }}>
            {friend}
          </Text>
        </View>
        <View style={{ width: 50 }} />
      </View>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        refreshing={refreshing}
        onRefresh={loadMoreMessages}
        keyExtractor={(message) => message.id.toString()}
        style={styles.messageList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputMessage}
          onPointerEnter={() => { scrollToBottom(); }}
          onChangeText={setInputMessage}
          placeholder="Digite sua mensagem aqui..."
          placeholderTextColor="#888"
        />
        <TouchableOpacity
          onPress={handleSendMessage}
          disabled={inputMessage.length === 0}
          style={{ ...styles.sendButton, backgroundColor: theme.TERTIARY }}
        >
          <Text style={{ ...styles.sendButtonText, color: theme.QUATERNARY }}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (theme: { PRIMARY: string; SECONDARY: string; TERTIARY: string; QUATERNARY: string; FUTEBOL: string; BASQUETE: string; VOLEI: string; TENIS: string; } | { PRIMARY: string; SECONDARY: string; TERTIARY: string; QUATERNARY: string; FUTEBOL: string; BASQUETE: string; VOLEI: string; TENIS: string; }) => StyleSheet.create({
  container: {
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
  image: {
    borderRadius: 50,
    borderWidth: 2,
    width: 50,
    height: 50,
  },
  title: {
    fontFamily: 'Sansation Regular',
    fontSize: 18,
    flex: 1,
    color: theme.SECONDARY,
    marginHorizontal: 10,
  },
  messageRow: {
    marginVertical: 3,
    marginHorizontal: 5,
    padding: 10,
    borderRadius: 25,
    justifyContent: 'center',
  },
  myMessage: {
    backgroundColor: 'lightgreen',
    alignSelf: 'flex-end',
  },
  friendMessage: {
    backgroundColor: 'lightblue',
    alignSelf: 'flex-start',
  },
  messageList: {
    flex: 1
  },
  message: {
    fontFamily: 'Sansation Regular',
    fontSize: 16,
    marginHorizontal: 10,
  },
  time: {
    fontFamily: 'Sansation Regular',
    fontSize: 12,
    color: '#888',
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
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
});

export default SocialChatStack;
