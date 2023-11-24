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

export const TeamSolicitationRequestedItem = ({ team, action }) => {
    const { theme } = useTheme();
    return (
        <TouchableOpacity onPress={() => { action(team) }} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderColor: theme.TERTIARY }}>
            <View style={{ flex: 1 }}>
                <UserItem border={false} action={() => { action(team) }} image={team.image} name={team.name} id={team.id} subtitle={(team.description).substring(0, 100) + '...'} key={team.id} />
            </View>
            <Text style={{
                color: theme.SECONDARY, fontFamily: 'Sansation Regular',
                fontSize: 12
            }}>Pendente</Text>
        </TouchableOpacity>
    )
};
export const TeamSolicitationReceivedItem = ({ team, action }) => {
    const { theme } = useTheme();
    return (
        <TouchableOpacity onPress={() => { action(team) }} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderColor: theme.TERTIARY }}>
            <View style={{ flex: 1 }}>
                <UserItem border={false} action={() => { action(team) }} image={team.image} name={team.name} id={team.id} subtitle={(team.description).substring(0, 100) + '...'} key={team.id} />
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

interface Team {
    id: number;
    name: string;
    image: string;
}

const TeamsSolicitations = ({ teamsSolicitationsReceived, teamsSolicitationsRequested }) => {
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
        ...teamsSolicitationsReceived.map((item: Team) => ({ ...item, type: 'received' })),
        ...teamsSolicitationsRequested.map((item: Team) => ({ ...item, type: 'requested' })),
    ];

    const handleAcceptRequest = (userPossibleTeam: UsersSearch) => {
        ConfirmationDialog({
            title: 'Confirmação',
            message: 'Deseja aceitar o pedido de ingresso ao time?',
            onConfirm: async () => {
                setLoading(true);
                API.$users_team.accept_team({ username: user.username, team_id: userPossibleTeam.id })
                    .then((response) => {
                        setNotification({
                            message: 'Pedido aceito com sucesso!',
                            success: true,
                            visible: true,
                        });
                    })
                    .catch((error: any) => {
                        console.log(error.message)
                        setNotification({
                            message: `Não conseguimos aceitar o pedido 😞\nCódigo do erro: ${error.message}`,
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
            {loading && <LoaderUnique />}
            <View style={{ ...styles.modalView, backgroundColor: theme.PRIMARY }}>
                <FlatList
                    data={combinedData}
                    ListEmptyComponent={(
                        <Text style={styles.text}>Opa, nada para ver aqui.</Text>
                    )}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => {
                        if (item.type === 'received') {
                            return (
                                <TeamSolicitationReceivedItem
                                    action={() => handleAcceptRequest(item)}
                                    team={item}
                                />
                            );
                        } else {
                            return (
                                <TeamSolicitationRequestedItem
                                    action={() => { }}
                                    team={item}
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
        text: {
            textAlign: 'center',
            fontFamily: 'Sansation Regular',
            fontSize: 13,
            color: theme.SECONDARY,
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