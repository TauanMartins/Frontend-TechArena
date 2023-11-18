import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal, FlatList
} from 'react-native';
import { useTheme } from '../../../utils/Theme/ThemeContext';
import { screens } from '../../../navigation/ScreenProps';
import { RootStackParamList } from '../../../navigation/NavigationTypes';
import { useAuth } from '../../../utils/Auth/AuthContext';
import API from '../../../utils/API';
import LoaderUnique from '../../../components/LoaderUnique';
import { ChatIcon } from '../../../components/IconsButton';
import { Image } from 'react-native-elements';
import ConfirmationDialog from '../../../components/ConfirmationDialog';
import Notification from '../../../components/Notification';
import { navigate } from '../../../navigation/NavigationUtils';
import Dark from '../../../utils/Theme/Dark';
import Light from '../../../utils/Theme/Light';
import { UserItem } from '../../UserItem';

export const TeamSolicitationItem = ({ user, action }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    return (
        <TouchableOpacity onPress={() => { action(user) }} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderColor: theme.TERTIARY }}>
            <View style={{ flex: 1 }}>
                <UserItem border={false} action={() => {action(user)  }} image={user.image} name={user.name} id={user.id} subtitle={user.username} key={user.id} />
            </View>
            <ChatIcon color={theme.SECONDARY} />
        </TouchableOpacity>
    )
};

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

const Friends = ({ open, close, navigation }) => {
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

    const [friends, setFriends] = useState<Friend[] | null>(null);

    const handleChatToUser = (friend: UsersSearch) => {
        ConfirmationDialog({
            title: 'Confirmação',
            message: 'Deseja iniciar uma conversa?',
            onConfirm: async () => {
                setLoading(true);
                API.$chat.post_chats({ username_user_1: user.username, username_user_2: friend.username })
                    .then((response) => {
                        toggleModal();
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
    const fetchFriends = () => {
        setLoading(true);
        API.$friends.list_friends({ username: user.username }).then((response: FriendsResponse) => {
            setFriends(response.data.friends)
        }).catch((erro: any) => {
            console.log(erro)
        }).finally(() => {
            setLoading(false);
        })
    };
    const toggleModal = () => {
        if (!open) { fetchFriends(); }
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
                onShow={fetchFriends}
                onRequestClose={toggleModal}
            >
                <View style={{ ...styles.modalView, backgroundColor: theme.PRIMARY }}>
                    {loading && <LoaderUnique />}
                    <Text style={styles.modalText}>Amigos</Text>
                    <FlatList
                        data={friends}
                        renderItem={({ item: user }) => (<TeamSolicitationItem action={() => handleChatToUser(user)} key={user.id} user={user} />)}
                        style={styles.list}
                    />
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
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
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

export default Friends;