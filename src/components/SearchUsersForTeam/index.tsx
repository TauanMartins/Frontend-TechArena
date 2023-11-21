import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal, TextInput, FlatList, Alert
} from 'react-native';
import { useTheme } from '../../utils/Theme/ThemeContext';
import { useAuth } from '../../utils/Auth/AuthContext';
import API from '../../utils/API';
import LoaderUnique from '../LoaderUnique';
import ConfirmationDialog from '../ConfirmationDialog';
import Notification from '../Notification';
import { Keyboard } from 'react-native';
import Dark from '../../utils/Theme/Dark';
import Light from '../../utils/Theme/Light';
import { UserItem } from '../UserItem';


interface UsersSearch {
    id: number;
    name: string;
    image: string;
    username: string;
}

interface UsersSearchResponse {
    data: UsersSearch[];
}


export const SearchUsersForTeam = ({ open, close, team_id }) => {
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

    // Variáveis para texto de pesquisa de usuários e usuário encontrados
    const [inputUserSearchForUsers, setinputUserSearchForUsers] = useState('');
    const [usersSearched, setUsersSearched] = useState<UsersSearch[] | null>(null)
    const [notFound, setNotFound] = useState(false)

    const handleSendFriendRequest = (userPossibleFriend: UsersSearch) => {
        ConfirmationDialog({
            title: 'Confirmação',
            message: 'Deseja adicionar ao time?',
            onConfirm: async () => {
                setLoading(true);
                API.$teams_owner.request_member({ username_owner: user.username, username_member: userPossibleFriend.username, team_id: team_id })
                    .then((response: UsersSearchResponse) => {
                        setUsersSearched(response.data);
                        setNotification({
                            message: 'Solicitação de ingresso enviado com sucesso!',
                            success: true,
                            visible: true,
                        });
                    })
                    .catch((error: any) => {
                        console.log(error)
                        setNotification({
                            message: 'Não conseguimos enviar a solicitação de ingresso :(',
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
        Keyboard.dismiss();
        setLoading(true);
        API.$users.select_users({ search: inputUserSearchForUsers })
            .then((response: UsersSearchResponse) => {
                if (response.data.length === 0) {
                    setNotFound(true)
                } else {
                    setNotFound(false)
                }
                setUsersSearched(response.data);
            })
            .catch((error: any) => {
                console.error(error);
            }).finally(() => {
                setLoading(false);
            })
    };
    const toggleModal = () => {
        setinputUserSearchForUsers('');
        setUsersSearched(null)
        close();
    };
    return (
        <>

            <Modal animationType="fade"
                transparent={true}
                visible={open}
                onRequestClose={toggleModal}>
                <Notification
                    message={notification.message}
                    success={notification.success}
                    visible={notification.visible}
                    onClose={() => setNotification({ ...notification, visible: false })} />
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>Usuários</Text>
                    <View style={styles.inputContainer}>
                        <TextInput style={styles.input} value={inputUserSearchForUsers} onChangeText={setinputUserSearchForUsers} placeholder="Digite o nome de usuário" />
                        <TouchableOpacity onPress={handleSearch} disabled={inputUserSearchForUsers.length === 0} style={styles.searchButton}>
                            <Text style={styles.searchButtonText}>Pesquisar</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => { Alert.alert('Ops', 'Essa funcionalidade não está pronta ainda.') }} style={styles.inviteButton}>
                        <Text style={styles.inviteButtonText}>Não encontrou? Convide seus amigos.</Text>
                    </TouchableOpacity>
                    {notFound && <Text style={styles.notFoundText}>Nenhum usuário encontrado.</Text>}
                    {loading && <LoaderUnique />}
                    <FlatList data={usersSearched} renderItem={({ item: user }) => (<UserItem action={() => handleSendFriendRequest(user)} key={user.id} id={user.id} image={user.image} name={user.name} subtitle={user.username} />)} style={styles.list} />
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
        inputContainer: {
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
        },
        input: {
            flex: 1,
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
        notFoundText: {
            textAlign: 'center',
            fontFamily: 'Sansation Regular',
            fontSize: 18,
            color: theme.SECONDARY,
        },
        list: {
            width: '100%'
        },
    });

