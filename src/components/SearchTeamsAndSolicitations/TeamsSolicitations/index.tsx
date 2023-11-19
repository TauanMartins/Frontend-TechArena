import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList
} from 'react-native';
import { useTheme } from '../../../utils/Theme/ThemeContext';
import { useAuth } from '../../../utils/Auth/AuthContext';
import API from '../../../utils/API';
import LoaderUnique from '../../LoaderUnique';
import ConfirmationDialog from '../../ConfirmationDialog';
import Notification from '../../Notification';
import Dark from '../../../utils/Theme/Dark';
import Light from '../../../utils/Theme/Light';
import { UserItem } from '../../UserItem';

export const FriendSolicitationRequestedItem = ({ user, action }) => {
    const { theme } = useTheme();
    return (
        <TouchableOpacity onPress={() => { action(user) }} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderColor: theme.TERTIARY }}>
            <View style={{ flex: 1 }}>
                <UserItem border={false} action={() => { action(user) }} image={user.image} name={user.name} id={user.id} subtitle={user.username} key={user.id} />
            </View>
            <Text style={{
                color: theme.SECONDARY, fontFamily: 'Sansation Regular',
                fontSize: 12
            }}>Pendente</Text>
        </TouchableOpacity>
    )
};
export const FriendSolicitationReceivedItem = ({ user, action }) => {
    const { theme } = useTheme();
    return (
        <TouchableOpacity onPress={() => { action(user) }} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderColor: theme.TERTIARY }}>
            <View style={{ flex: 1 }}>
                <UserItem border={false} action={() => { action(user) }} image={user.image} name={user.name} id={user.id} subtitle={user.username} key={user.id} />
            </View>
            <Text style={{
                color: theme.SECONDARY, fontFamily: 'Sansation Regular',
                fontSize: 12
            }}>Aceitar</Text>
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

const TeamsSolicitations = ({ teamsSolicitationsReceived, teamsSolicitationsRequested, search }) => {
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
    const combinedData = [
        ...teamsSolicitationsReceived.map((item: Friend) => ({ ...item, type: 'received' })),
        ...teamsSolicitationsRequested.map((item: Friend) => ({ ...item, type: 'requested' })),
    ];

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
                        search();
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

    return (
        <>
            <Notification
                message={notification.message}
                success={notification.success}
                visible={notification.visible}
                onClose={() => setNotification({ ...notification, visible: false })} />
            <View style={{ ...styles.modalView, backgroundColor: theme.PRIMARY }}>
                {loading && <LoaderUnique />}
                <FlatList
                    data={combinedData}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => {
                        if (item.type === 'received') {
                            return (
                                <FriendSolicitationReceivedItem
                                    action={() => handleAcceptRequest(item)}
                                    user={item}
                                />
                            );
                        } else {
                            return (
                                <FriendSolicitationRequestedItem
                                    action={() => {}} 
                                    user={item}
                                />
                            );
                        }
                    }}
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

export default TeamsSolicitations;