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
import Teams from './Teams';
import TeamsSolicitations from './TeamsSolicitations';
import LoaderUnique from '../LoaderUnique';
import { SearchTeams } from '../SearchTeams';
import { CreateTeam } from '../CreateTeam';
interface Team {
  id: number;
  name: string;
  image: string;
}

interface TeamsResponse {
  data: { teams: Team[], received_teams: Team[], requested_teams: Team[] };
}

const TabButton = ({ title, onPress, isActive, styles }) => (
  <TouchableOpacity style={[styles.tabButton, isActive && styles.tabButtonActive]} onPress={() => { onPress() }}  >
    <Text style={[styles.tabButtonText, isActive && styles.tabButtonTextActive]}>
      {title}
    </Text>
  </TouchableOpacity>
);

export const SearchTeamsAndSolicitations = ({ open, close, navigation }) => {
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
  const [activeTab, setActiveTab] = useState('Times');

  // Variáveis para controlar o recebimento de amigos e solicitações.
  const [teams, setTeams] = useState<Team[] | null>([]);
  const [receivedSolicitations, setReceivedSolicitations] = useState<Team[] | null>([]);
  const [requestedSolicitations, setRequestedSolicitations] = useState<Team[] | null>([]);

  // Variável para controlar o aparecimento da modal de procurar times
  const [isSearchTeamsModalVisible, setIsSearchTeamsModalVisible] = useState(false);
  const [isCreateTeamModalVisible, setIsCreateTeamModalVisible] = useState(false);

  const fetchTeamsAndSolicitations = () => {
    setLoading(true);
    API.$users_team.select_user_teams({ idToken: user.idToken }).then((response: TeamsResponse) => {
      setTeams(response.data.teams)
      setReceivedSolicitations(response.data.received_teams)
      setRequestedSolicitations(response.data.requested_teams)
    }).catch((erro: any) => {
      console.log(erro)
    }).finally(() => {
      setLoading(false);
    })
  };
  const toggleModal = () => {
    if (!open) { fetchTeamsAndSolicitations(); }
    close();
  };

  const toggleSearchTeamsModal = () => {
    setIsSearchTeamsModalVisible(!isSearchTeamsModalVisible);
  };
  const toggleCreateTeamModal = () => {
    if (isCreateTeamModalVisible) fetchTeamsAndSolicitations();
    setIsCreateTeamModalVisible(!isCreateTeamModalVisible);
  };

  return (
    <>

      <Modal
        animationType="slide"
        transparent={true}
        visible={open}
        onShow={fetchTeamsAndSolicitations}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalView}>
          <Notification
            message={notification.message}
            success={notification.success}
            visible={notification.visible}
            onClose={() => setNotification({ ...notification, visible: false })} />
          {loading && <LoaderUnique />}
          <View style={styles.tabBar}>
            {['Times', 'Solicitações de Times'].map((tab) => (
              <TabButton
                key={tab}
                title={tab}
                styles={styles}
                isActive={activeTab === tab}
                onPress={() => { fetchTeamsAndSolicitations(); setActiveTab(tab) }}
              />
            ))}
          </View>
          {activeTab === 'Times' && (
            <Teams navigation={navigation} teams={teams} close={toggleModal} toggleSearchTeamsModal={toggleSearchTeamsModal} toggleCreateTeamModal={toggleCreateTeamModal} search={fetchTeamsAndSolicitations} />
          )}
          {activeTab === 'Solicitações de Times' && (
            <TeamsSolicitations teamsSolicitationsReceived={receivedSolicitations} teamsSolicitationsRequested={requestedSolicitations} />
          )}
          <TouchableOpacity style={{ ...styles.modalButton, backgroundColor: theme.TERTIARY }} onPress={toggleModal}>
            <Text style={styles.modalButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
        <SearchTeams open={isSearchTeamsModalVisible} close={toggleSearchTeamsModal} />
        <CreateTeam open={isCreateTeamModalVisible} close={toggleCreateTeamModal} />
      </Modal>
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
