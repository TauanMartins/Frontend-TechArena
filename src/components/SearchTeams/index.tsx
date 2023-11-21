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


interface TeamsSearch {
    id: number;
    name: string;
    image: string;
    description: string;
}

interface TeamsSearchResponse {
    data: TeamsSearch[];
}


export const SearchTeams = ({ open, close }) => {
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
    const [inputUserSearchForTeams, setinputUserSearchForTeams] = useState('');
    const [teamsSearched, setTeamsSearched] = useState<TeamsSearch[] | null>(null)
    const [notFound, setNotFound] = useState(false)

    const handleSendTeamRequest = (team: TeamsSearch) => {
        ConfirmationDialog({
            title: 'Confirmação',
            message: 'Deseja enviar pedido para ingressar ao time?',
            onConfirm: async () => {
                setLoading(true);
                API.$users_team.request_team({ username: user.username, team_id: team.id })
                    .then((response: TeamsSearchResponse) => {
                        setTeamsSearched(response.data);
                        setNotification({
                            message: 'Pedido de ingresso enviado com sucesso ao dono do Time!',
                            success: true,
                            visible: true,
                        });
                    })
                    .catch((error: any) => {
                        console.log(error.message)
                        setNotification({
                            message: `Não conseguimos enviar o pedido de amizade :(\nCódigo do erro: ${error.message}`,
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
        API.$teams.select_teams({ search: inputUserSearchForTeams })
            .then((response: TeamsSearchResponse) => {
                if (response.data.length === 0) {
                    setNotFound(true)
                } else {
                    setNotFound(false)
                }
                setTeamsSearched(response.data);
            })
            .catch((error: any) => {
                console.error(error);
            }).finally(() => {
                setLoading(false);
            })
    };
    const toggleModal = () => {
        setinputUserSearchForTeams('');
        setTeamsSearched(null)
        close();
    };
    return (
        <>

            <Modal animationType="fade"
                transparent={true}
                visible={open}
                onRequestClose={toggleModal}>
                <View style={styles.modalView}>
                    <Notification
                        message={notification.message}
                        success={notification.success}
                        visible={notification.visible}
                        onClose={() => setNotification({ ...notification, visible: false })} />
                    <Text style={styles.modalText}>Times</Text>
                    <View style={styles.inputContainer}>
                        <TextInput style={styles.input} value={inputUserSearchForTeams} onChangeText={setinputUserSearchForTeams} placeholder="Digite o nome do time" />
                        <TouchableOpacity onPress={handleSearch} disabled={inputUserSearchForTeams.length === 0} style={styles.searchButton}>
                            <Text style={styles.searchButtonText}>Pesquisar</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => { Alert.alert('Ops', 'Essa funcionalidade não está pronta ainda.') }} style={styles.inviteButton}>
                        <Text style={styles.inviteButtonText}>Não encontrou? Crie seu Time.</Text>
                    </TouchableOpacity>
                    {notFound && <Text style={styles.notFoundText}>Nenhum time encontrado.</Text>}
                    {loading && <LoaderUnique />}
                    <FlatList data={teamsSearched} renderItem={({ item: team }) => (<UserItem action={() => handleSendTeamRequest(team)} key={team.id} id={team.id} image={team.image} name={team.name} subtitle={(((team.description).substring(0, 30)) + '...')} />)} style={styles.list} />
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

