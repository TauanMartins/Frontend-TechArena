import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Alert, FlatList, Keyboard
} from 'react-native';
import { ScreenProps } from '../../../../navigation/ScreenProps';
import { useAuth } from '../../../../utils/Auth/AuthContext';
import { useTheme } from '../../../../utils/Theme/ThemeContext';
import ConfirmationDialog from '../../../../components/ConfirmationDialog';
import Notification from '../../../../components/Notification';
import { AddUserFriendIcon, BackButton } from '../../../../components/IconsButton';
import { AvatarImage } from '../../../../components/AvatarImage';
import { TextInput } from 'react-native-gesture-handler';
import Light from '../../../../utils/Theme/Light';
import Dark from '../../../../utils/Theme/Dark';
import { MediaType, launchImageLibrary } from 'react-native-image-picker';
import API from '../../../../utils/API';
import Loader from '../../../../components/Loader';
import { UserItem } from '../../../../components/UserItem';
import { navigate } from '../../../../navigation/NavigationUtils';
import { screens } from '../../../../navigation/ScreenProps';
import { RootStackParamList } from '../../../../navigation/NavigationTypes';
import { SearchUsersForTeam } from '../../../../components/SearchUsersForTeam';
interface Team {
  id: number | null
  name: string;
  image: string;
  description: string;
  created_at: string;
  valid: boolean,
  checked: boolean
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
export const UserInGroupItem = ({ user, action }) => {
  const { theme } = useTheme();
  return (
    <TouchableOpacity onPress={() => { action(user) }} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderColor: theme.TERTIARY }}>
      <View style={{ flex: 1 }}>
        <UserItem border={false} action={() => { action(user) }} image={user.image} name={user.name} id={user.id} subtitle={user.username} key={user.id} />
      </View>
      {!user.is_friend &&
        <Text style={{
          color: theme.SECONDARY, fontFamily: 'Sansation Regular',
          fontSize: 12
        }}>Adicionar como amigo</Text>}
    </TouchableOpacity>
  )
};
export const UserRequestItem = ({ user, action }) => {
  const { theme } = useTheme();
  return (
    <TouchableOpacity onPress={() => { action(user) }} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderColor: theme.TERTIARY }}>
      <View style={{ flex: 1 }}>
        <UserItem border={false} action={() => { action(user) }} image={user.image} name={user.name} id={user.id} subtitle={user.username} key={user.id} />
      </View>
      {!user.is_friend &&
        <Text style={{
          color: theme.SECONDARY, fontFamily: 'Sansation Regular',
          fontSize: 12
        }}>Aceitar no time</Text>}
    </TouchableOpacity>
  )
};
const SocialUserChatDetail: React.FC<ScreenProps<'SocialUserChatDetail'>> = ({ navigation, route }) => {
  // As próximas cinco linhas serão normalmente visualizadas pois contam com elementos para
  // gerenciar usuário, gerenciar o tema e gerenciar componentes de carregamento e notificação.
  const { user, isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    message: '',
    success: false,
    visible: false,
  });

  const [team, setTeam] = useState<Team>({ id: null, name: '', image: '', description: '', valid: true, created_at: '', checked: false })

  const [image, setImage] = useState(route.params.image)
  const [isTeamChat, setIsTeamChat] = useState(false)
  const [isOwner, setIsOwner] = useState(false);
  const [users, setUsers] = useState([]);
  const [userSolicitations, setUserSolicitations] = useState([]);
  // Variável para controlar o aparecimento da modal de procurar usuários
  const [isSearchUsersModalVisible, setIsSearchUsersModalVisible] = useState(false);
  const name = route.params.name;
  const chat_id = route.params.chat_id;
  const is_group_chat = route.params.is_group_chat;

  const selectImage = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      maxWidth: 2000,
      maxHeight: 2000,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('Usuário cancelou a seleção de imagem');
      } else if (response.errorCode) {
        console.log('Erro na ImagePicker: ', response.errorMessage);
      } else {
        if (response.assets && response.assets[0].fileSize <= 10485760) {
          const imageUri = response.assets[0].uri;
          setImage(imageUri);
          setTeam({ ...team, image: imageUri });
        } else {
          Alert.alert('Ops', 'A imagem é muito grande. Por favor, selecione uma imagem menor que 10MB.');
        }
      }
    });
  };
  const fetchGroupChatDetail = () => {
    setLoading(true)
    API.$chat_group_detail.detail_chat({ idToken: user.idToken, chat_id: chat_id }).then((response) => {
      setIsTeamChat(response.data.isTeamChat)
      if (response.data.isTeamChat) {
        setTeam({ ...team, id: response.data.teamId, name: name, description: response.data.detail[0].description, created_at: response.data.detail[0].created_at })
      } else {
        setTeam({ ...team, id: response.data.teamId, name: name, created_at: response.data.detail[0].created_at })
      }
      setUserSolicitations(response.data.usersSolicitationsRequests);
      setIsOwner(response.data.isOwner)
      setUsers(response.data.users)
    }).catch((error: any) => {
      console.error(error);
    })
      .finally(() => {
        setLoading(false)
      });

  }
  const fetchPrivateChatDetail = () => {
    setLoading(true)
    API.$chat_user_detail.detail_chat({ idToken: user.idToken, chat_id: chat_id }).then((response) => {
      console.log(response.data);
      setTeam({ ...team, name: name, created_at: response.data[0].created_at }) // incluir dps setTeam({ ...team, id: response.data.teamId, name: name, description: response.data.detail[0].description, created_at: response.data.detail[0].created_at })

    }).catch((error: any) => {
      console.error(error);
    })
      .finally(() => {
        setLoading(false)
      });

  }
  const handleEditTeamRequest = async () => {
    if (team.valid) {
      ConfirmationDialog({
        title: 'Confirmação',
        message: 'Deseja editar o time com os dados fornecidos?',
        onConfirm: async () => {
          setLoading(true);
          const teamData = {
            name: team.name,
            description: team.description,
            username: user.username,
            team_id: team.id,
            image: null
          };
          if (team.image) {
            const base64Image: any = await fetch(team.image)
              .then(response => response.blob())
              .then(blob => {
                return new Promise((resolve, reject) => {
                  const reader = new FileReader();
                  reader.onloadend = () => resolve(reader.result);
                  reader.onerror = reject;
                  reader.readAsDataURL(blob);
                });
              });

            const base64Data = base64Image.split(',')[1];
            teamData.image = base64Data;
          } else {
            teamData.image = image
          }
          console.log(teamData)
          API.$teams.edit_team(teamData).then(() => {
            setNotification({
              message: 'Time editado com sucesso!',
              success: true,
              visible: true,
            });
          })
            .catch((error: any) => {
              console.log(error.message)
              setNotification({
                message: `Desculpe, não conseguimos editar o seu time 😞\nCódigo do erro: ${error.message}`,
                success: false,
                visible: true,
              });
            }).finally(() => {
              setLoading(false);
            })
        },
        onCancel: () => { },
      });
    }
  };

  const handleUserRequest = (userRequested: UsersSearch) => {
    ConfirmationDialog({
      title: 'Confirmação',
      message: 'Deseja adicionar ao time?',
      onConfirm: async () => {
        setLoading(true);
        API.$teams_owner.accept_member({ username_owner: user.username, username_member: userRequested.username, team_id: team.id })
          .then((response: UsersSearchResponse) => {
            fetchGroupChatDetail()
            setNotification({
              message: 'Solicitação de ingresso aceita com sucesso!',
              success: true,
              visible: true,
            });
          })
          .catch((error: any) => {
            console.log(error)
            setNotification({
              message: 'Não conseguimos enviar a solicitação de ingresso 😞',
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
            navigate(navigation,
              screens.SocialChat.name as keyof RootStackParamList,
              isAuthenticated,
              user, { chat_id: response.data.chat_id, name: friend.name, image: friend.image, is_group_chat: false })
          })
          .catch((error: any) => {
            console.log(error);
            setNotification({
              message: 'Não conseguimos iniciar uma conversa 😞',
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
  const toggleSearchUsersModal = () => {
    setIsSearchUsersModalVisible(!isSearchUsersModalVisible);
  };
  const handleSendFriendRequest = (userPossibleFriend: UsersSearch) => {
    ConfirmationDialog({
      title: 'Confirmação',
      message: 'Deseja enviar pedido de amizade?',
      onConfirm: async () => {
        setLoading(true);
        API.$friends.request_friend({ username_user_1: user.username, username_user_2: userPossibleFriend.username })
          .then((response: UsersSearchResponse) => {
            setNotification({
              message: 'Pedido de amizade enviado com sucesso!',
              success: true,
              visible: true,
            });
          })
          .catch((error: any) => {
            console.log(error)
            setNotification({
              message: 'Não conseguimos enviar o pedido de amizade 😞',
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
  useEffect(() => {
    if (is_group_chat) {
      fetchGroupChatDetail();
    } else {
      fetchPrivateChatDetail();
    }
  }, [])
  return (
    <View style={styles.modalView}>
      {loading && <Loader />}
      <Notification
        message={notification.message}
        success={notification.success}
        visible={notification.visible}
        onClose={() => setNotification({ ...notification, visible: false })} />
      <FlatList
        ListHeaderComponent={(
          <>
            <View style={styles.headerRow}>
              <BackButton onPress={() => navigation.goBack()} style={{}} color={theme.SECONDARY} />
              <Text style={{ ...styles.title, color: theme.SECONDARY }}>
                Dados do {is_group_chat ? 'Grupo' : 'Usuário'}
              </Text>
            </View>
            <View style={styles.inputContainer}>
              <AvatarImage image={image} key={image} size={100} />
              {is_group_chat && isOwner &&
                <TouchableOpacity style={styles.modalButton} onPress={selectImage}>
                  <Text style={styles.modalButtonText} >Selecionar Imagem</Text>
                </TouchableOpacity>
              }
              <View style={styles.container}>
                <Text style={styles.label}>Nome</Text>
                <TextInput multiline={true}
                  style={styles.input}
                  value={team.name}
                  editable={false}
                  placeholder={`Nome do ${is_group_chat ? 'Time' : 'Usuário'}`}
                />
              </View>
              {is_group_chat && isTeamChat &&
                <View style={styles.container}>
                  <Text style={styles.label}>Descrição</Text>
                  <TextInput multiline={true} style={styles.input} value={team.description} onChangeText={(e) => setTeam({ ...team, description: e, valid: true, checked: false })} placeholder="Descrição do time" editable={is_group_chat && isOwner} />
                </View>
              }
              <View style={styles.container}>
                <Text style={styles.label}>{`Data de criação ${is_group_chat ? isTeamChat ? 'do Time' : 'do Agendamento' : 'da amizade'}`}</Text>
                <TextInput multiline={true} style={styles.input} value={team.created_at} placeholder={`Data de criação ${is_group_chat ? isTeamChat ? 'do Time' : 'do Agendamento' : 'da amizade'}`} editable={false} />
              </View>

            </View>
            {!team.valid && team.checked && <Text style={styles.notAllowedText}>Um time com este nome já existe, por favor escolha outro.</Text>}

            {is_group_chat && isOwner &&
              <TouchableOpacity style={{ ...styles.modalButton, backgroundColor: theme.TERTIARY }} onPress={handleEditTeamRequest} disabled={!team.valid}>
                <Text style={styles.modalButtonText}>Salvar</Text>
              </TouchableOpacity>
            }
            {is_group_chat && isTeamChat && isOwner &&
              <SearchUsersForTeam open={isSearchUsersModalVisible} close={toggleSearchUsersModal} team_id={team.id} />
            }
            {userSolicitations && userSolicitations.length > 0 && is_group_chat && isTeamChat && isOwner && (
              <View style={styles.container}>
                <View style={styles.container}>
                  <Text style={styles.label}>Solicitações de Ingresso no Time</Text>
                </View>
                <FlatList
                  data={userSolicitations}
                  renderItem={({ item: userRequest }) => (
                    <UserRequestItem
                      action={() => handleUserRequest(userRequest)}
                      key={userRequest.id}
                      user={userRequest}
                    />
                  )}
                  style={styles.list}
                />
              </View>
            )}

            {is_group_chat &&
              <View style={{ ...styles.container, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={styles.label}>Usuários no grupo</Text>
                <TouchableOpacity onPress={()=>{Alert.alert('Saiba mais', 'O termo "Holder" é usado para descrever a pessoa encarregada de levar os equipamentos e materiais necessários, garantindo que a partida, sessão ou evento esportivo ocorra sem problemas.')}}>
                  <Text style={{ ...styles.label, fontSize: 13 }}>Saiba mais</Text>
                </TouchableOpacity>
              </View>
            }
            {is_group_chat && isTeamChat && isOwner &&
              <TouchableOpacity style={styles.headerRowText} onPress={() => { toggleSearchUsersModal() }}>
                <AddUserFriendIcon color={theme.QUATERNARY} />
                <Text style={styles.text}>Adicionar usuários ao grupo</Text>
              </TouchableOpacity>
            }
          </>
        )}
        data={users}
        renderItem={({ item: user }) => (<UserInGroupItem action={() => { if (user.is_friend) { handleChatToUser(user) } else { handleSendFriendRequest(user) } }} key={user.id} user={user} />)}
        style={styles.list}
      />

    </View>
  );
};

const createStyles = (theme: typeof Light | typeof Dark) => StyleSheet.create({
  text: {
    fontFamily: 'Sansation Regular',
    fontSize: 13,
    color: theme.QUATERNARY,
  },
  container: {
    marginTop: 25,
    flex: 1,
    width: '100%'
  },
  label: {
    fontFamily: 'Sansation Regular',
    fontSize: 18,
    color: theme.SECONDARY,
  },
  headerRowText: {
    backgroundColor: theme.TERTIARY,
    borderRadius: 25,
    padding: 15,
    flexDirection: 'row',
    marginVertical: 15,
    flex: 1,
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 15,
    flex: 1,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    flex: 1,
  },
  title: {
    fontFamily: 'Sansation Regular',
    fontSize: 18,
    flex: 1,
    color: theme.SECONDARY,
    marginHorizontal: 10,
    justifyContent: 'center'
  },
  scrollView: {
    flex: 1,
  },
  modalView: {
    alignItems: 'center',
    justifyContent: 'center', // Conteúdo alinhado ao topo
    backgroundColor: theme.PRIMARY,
    flex: 1,
    paddingHorizontal: 15,
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
  inputContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  input: {
    width: '100%',
    borderRadius: 25,
    paddingHorizontal: 10,
    marginVertical: 10,
    backgroundColor: theme.TERTIARY,
    fontFamily: 'Sansation Regular',
    fontSize: 16,
  },
  searchButton: {
    borderRadius: 25,
    padding: 15,
    backgroundColor: theme.TERTIARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inviteButton: {
    width: "auto",
    borderRadius: 25,
    padding: 15,
    justifyContent: 'center',
  },
  searchButtonText: {
    fontFamily: 'Sansation Regular',
    fontSize: 16,
    color: theme.QUATERNARY,
  },
  inviteButtonText: {
    fontFamily: 'Sansation Regular',
    fontSize: 16,
    color: theme.SECONDARY,
    textDecorationLine: 'underline'
  },
  notAllowedText: {
    textAlign: 'justify',
    fontFamily: 'Sansation Regular',
    fontSize: 13,
    color: 'red',
  },
  list: {
    width: '100%'
  },
});

export default SocialUserChatDetail;
