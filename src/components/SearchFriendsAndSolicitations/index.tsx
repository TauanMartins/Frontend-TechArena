import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal, FlatList
} from 'react-native';
import { useTheme } from '../../utils/Theme/ThemeContext';
import { screens } from '../../navigation/ScreenProps';
import { RootStackParamList } from '../../navigation/NavigationTypes';
import { useAuth } from '../../utils/Auth/AuthContext';
import API from '../../utils/API';
import LoaderUnique from '../../components/LoaderUnique';
import { ChatIcon } from '../../components/IconsButton';
import { Image } from 'react-native-elements';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import Notification from '../../components/Notification';
import { navigate } from '../../navigation/NavigationUtils';
import Dark from '../../utils/Theme/Dark';
import Light from '../../utils/Theme/Light';
import Friends, { FriendItem } from './Friends';
import FriendsSolicitations from './FriendsSolicitations';



interface UsersSearch {
  id: number;
  name: string;
  image: string;
  username: string;
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

const TabButton = ({ title, onPress, isActive, styles }) => (
  <TouchableOpacity
    style={[styles.tabButton, isActive && styles.tabButtonActive]}
    onPress={()=>onPress()}
  >
    <Text style={styles.tabButtonText}>
      {title}
    </Text>
  </TouchableOpacity>
);
export const SearchFriendsAndSolicitations = ({ open, close, navigation }) => {
  // Definição padrão para qualquer componente

  const { user, isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    message: '',
    success: false,
    visible: false,
  });

  // -----------------------------------------------------

  const [activeTab, setActiveTab] = useState('Amigos');

  const [friends, setFriends] = useState<Friend[] | null>(null);
  const [receivedSolicitations, setReceivedSolicitations] = useState<Friend[] | null>(null);
  const [requestedSolicitations, setRequestedSolicitations] = useState<Friend[] | null>(null);

  const fetchFriendsAndSolicitations = () => {
    setLoading(true);
    API.$friends.list_friends({ username: user.username }).then((response: FriendsResponse) => {
      setFriends(response.data.friends)
      console.log(response.data)
      setReceivedSolicitations(response.data.received_friends)
      setRequestedSolicitations(response.data.requested_friends)
    }).catch((erro: any) => {
      console.log(erro)
    }).finally(() => {
      setLoading(false);
    })
  };
  const toggleModal = () => {
    if (!open) { fetchFriendsAndSolicitations(); }
    close();
  };

  return (
    <>
      <Notification
        message={notification.message}
        success={notification.success}
        visible={notification.visible}
        onClose={() => setNotification({ ...notification, visible: false })} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={open}
        onShow={fetchFriendsAndSolicitations}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalView}>
          <View style={styles.tabBar}>
            {['Amigos', 'Solicitações de Amizade', 'Times', 'Solicitações de Time'].map((tab) => (
              <TabButton
                key={tab}
                title={tab}
                styles={styles}
                isActive={activeTab === tab}
                onPress={() => setActiveTab(tab)}
              />
            ))}
          </View>
          {activeTab === 'Amigos' && (
            <Friends navigation={navigation} friends={friends} close={toggleModal} />
          )}
          {activeTab === 'Solicitações de Amizade' && (
            <FriendsSolicitations friendsSolicitationsReceived={receivedSolicitations} friendsSolicitationsRequested={requestedSolicitations} search={fetchFriendsAndSolicitations}/>
          )}
          {activeTab === 'Times' && (
            <Text>3</Text>
          )}
          {activeTab === 'Solicitações de Time' && (
            <Text>4</Text>
          )}
          <TouchableOpacity style={{ ...styles.modalButton, backgroundColor: theme.TERTIARY }} onPress={toggleModal}>
            <Text style={styles.modalButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

const createStyles = (theme: typeof Light | typeof Dark) =>
  StyleSheet.create({
    container: {
      // Estilos para o container principal do modal
    },
    tabBar: {
      flexDirection: 'row',
      justifyContent: 'center',
      // Estilos para a barra de tabs
    },
    tabButton: {
      flex: 1,
      paddingHorizontal: 10,
      marginVertical: 30 , 
      justifyContent: 'center',
      alignItems: 'center'
    },
    tabButtonActive: {
      backgroundColor: theme.TERTIARY,
      borderRadius: 25 // Escolha a cor da barra de ativação
      // Estilos para o botão da tab quando ativo
    },
    tabButtonText: {
      fontFamily: 'Sansation Regular',
      color: theme.SECONDARY,
      fontSize: 13,
    },
    list: {
      flex: 1,
      width: '100%'
    },
    modalView: {
      alignItems: 'center',
      justifyContent: 'center', // Conteúdo alinhado ao topo
      backgroundColor: theme.PRIMARY,
      flex: 1,
      borderRadius: 25,
      elevation: 5,
      padding: 5,
      paddingHorizontal: 15,
      margin: 30
    },
    modalText: {
      marginTop: 30,
      marginBottom: 10,
      fontFamily: 'Sansation Regular',
      fontSize: 20,
      color: theme.SECONDARY,
    },
    modalButton: {
      padding: 15,
      marginVertical: 15,
      borderRadius: 25,
      width: '100%',
      backgroundColor: theme.TERTIARY,
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalButtonText: {
      fontFamily: 'Sansation Regular',
      fontSize: 16,
      color: theme.QUATERNARY,
    },
    userImage: {
      borderWidth: 2,
      borderRadius: 25,
      width: 40,
      height: 40,
      marginRight: 10,
    },
    col: {
      flexDirection: 'column',
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
