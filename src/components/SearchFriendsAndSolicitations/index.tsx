import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal
} from 'react-native';
import { useTheme } from '../../utils/Theme/ThemeContext';
import { useAuth } from '../../utils/Auth/AuthContext';
import API from '../../utils/API';
import Notification from '../../components/Notification';
import Dark from '../../utils/Theme/Dark';
import Light from '../../utils/Theme/Light';
import Friends from './Friends';
import FriendsSolicitations from './FriendsSolicitations';
import LoaderUnique from '../LoaderUnique';
import { SearchUsers } from '../SearchUsers';
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
  <TouchableOpacity style={[styles.tabButton, isActive && styles.tabButtonActive]} onPress={() => { onPress() }}  >
    <Text style={[styles.tabButtonText, isActive && styles.tabButtonTextActive]}>
      {title}
    </Text>
  </TouchableOpacity>
);

export const SearchFriendsAndSolicitations = ({ open, close, navigation }) => {
  // Definição padrão para qualquer componente
  const { user } = useAuth();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    message: '',
    success: false,
    visible: false,
  });
  // -----------------------------------------------------

  // Variável que controla a aba aberta
  const [activeTab, setActiveTab] = useState('Amigos');

  // Variáveis para controlar o recebimento de amigos e solicitações.
  const [friends, setFriends] = useState<Friend[] | null>(null);
  const [receivedSolicitations, setReceivedSolicitations] = useState<Friend[] | null>(null);
  const [requestedSolicitations, setRequestedSolicitations] = useState<Friend[] | null>(null);

  // Variável para controlar o aparecimento da modal de procurar usuários
  const [isSearchUsersModalVisible, setIsSearchUsersModalVisible] = useState(false);

  const fetchFriendsAndSolicitations = () => {
    setLoading(true);
    API.$friends.list_friends({ username: user.username }).then((response: FriendsResponse) => {
      setFriends(response.data.friends)
      setReceivedSolicitations(response.data.received_friends)
      setRequestedSolicitations(response.data.requested_friends)
    }).catch((erro: any) => {
      console.log(erro);
    }).finally(() => {
      setLoading(false);
    })
  };
  const toggleModal = () => {
    if (!open) { fetchFriendsAndSolicitations(); }
    close();
  };

  const toggleSearchUsersModal = () => {
    setIsSearchUsersModalVisible(!isSearchUsersModalVisible);
  };

  return (
    <>

      <Modal
        animationType="slide"
        transparent={true}
        visible={open}
        onShow={fetchFriendsAndSolicitations}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalView}>
          {loading && <LoaderUnique />}
          <View style={styles.tabBar}>
            {['Amigos', 'Solicitações de Amizade'].map((tab) => (
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
            <Friends navigation={navigation} friends={friends} close={toggleModal} toggleSearchUsersModal={toggleSearchUsersModal} />
          )}
          {activeTab === 'Solicitações de Amizade' && (
            <FriendsSolicitations friendsSolicitationsReceived={receivedSolicitations} friendsSolicitationsRequested={requestedSolicitations} search={fetchFriendsAndSolicitations} />
          )}
          <TouchableOpacity style={{ ...styles.modalButton, backgroundColor: theme.TERTIARY }} onPress={toggleModal}>
            <Text style={styles.modalButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
        <SearchUsers open={isSearchUsersModalVisible} close={toggleSearchUsersModal} />
      </Modal>
      <Notification
        message={notification.message}
        success={notification.success}
        visible={notification.visible}
        onClose={() => setNotification({ ...notification, visible: false })} />
    </>
  );
};

const createStyles = (theme: typeof Light | typeof Dark) =>
  StyleSheet.create({
    tabBar: {
      flexDirection: 'row'
    },
    tabButton: {
      flex: 1,
      marginVertical: 30,
      paddingHorizontal: 20,
      paddingVertical: 5,
      justifyContent: 'center'
    },
    tabButtonActive: {
      backgroundColor: theme.TERTIARY,
      borderRadius: 25,
    },
    tabButtonText: {
      fontFamily: 'Sansation Regular',
      textAlign: 'center',
      color: theme.SECONDARY,
      fontSize: 13,
    },
    tabButtonTextActive: {
      color: theme.QUATERNARY,
    },
    list: {
      flex: 1,
      width: '100%'
    },
    modalView: {
      alignItems: 'center',
      justifyContent: 'center',
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
  });
