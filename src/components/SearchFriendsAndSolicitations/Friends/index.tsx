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

export const FriendItem = ({ user, action }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    return (
        <TouchableOpacity onPress={() => { action(user) }} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderColor: theme.TERTIARY }}>
            <View style={{ flex: 1 }}>
                <UserItem border={false} action={() => { action(user) }} image={user.image} name={user.name} id={user.id} subtitle={user.username} key={user.id} />
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

const Friends = ({ navigation, friends, close }) => {
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

    const handleChatToUser = (friend: UsersSearch) => {
        ConfirmationDialog({
            title: 'Confirmação',
            message: 'Deseja iniciar uma conversa?',
            onConfirm: async () => {
                setLoading(true);
                API.$chat.post_chats({ username_user_1: user.username, username_user_2: friend.username })
                    .then((response) => {
                        close();
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

    return (
        <>
            <Notification
                message={notification.message}
                success={notification.success}
                visible={notification.visible}
                onClose={() => setNotification({ ...notification, visible: false })} />
            <View style={styles.modalView}>
                {loading && <LoaderUnique />}
                <Text style={styles.modalText}>Amigos</Text>
                <FlatList
                    data={friends}
                    renderItem={({ item: user }) => (<FriendItem action={() => handleChatToUser(user)} key={user.id} user={user} />)}
                    style={styles.list}
                />
            </View>
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
            width: '100%',
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