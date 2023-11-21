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
import { AvatarImage } from '../AvatarImage';
import { MediaType, launchImageLibrary } from 'react-native-image-picker';
import Geolocation from '@react-native-community/geolocation';
import RNFetchBlob from 'rn-fetch-blob';

interface Team {
    name: string;
    image: string;
    description: string;
    valid: boolean,
    checked: boolean
}

interface TeamsExistResponse {
    data: [];
}


export const CreateTeam = ({ open, close }) => {
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
    const [team, setTeam] = useState<Team>({ name: '', image: '', description: '', valid: false, checked: false })

    const handleCreateTeamRequest = async () => {
        if (!team.checked) {
            await handleCheckNameTeam()
        }
        if (team.valid) {
            ConfirmationDialog({
                title: 'Confirmação',
                message: 'Deseja criar o time com os dados fornecidos?',
                onConfirm: async () => {
                    setLoading(true);
                    const teamData = {
                        name: team.name,
                        description: team.description,
                        username: user.username,
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
                        teamData.image = null
                    }

                    API.$teams.create_team(teamData)
                        .then((response: TeamsExistResponse) => {
                            console.log(response)
                            setNotification({
                                message: 'Parabéns, Time criado com sucesso!',
                                success: true,
                                visible: true,
                            });
                        })
                        .catch((error: any) => {
                            console.log(error)
                            setNotification({
                                message: `Desculpe, não conseguimos criar o seu time :(\nCódigo do erro: ${error.message}`,
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
    const handleCheckNameTeam = () => {
        Keyboard.dismiss();
        if (team.name) {
            setLoading(true);
            API.$teamsCheck.check_existing_name_teams({ name: team.name })
                .then((response: TeamsExistResponse) => {
                    setTeam({ ...team, valid: true, checked: true })
                })
                .catch((error: any) => {
                    setTeam({ ...team, valid: false, checked: true })
                }).finally(() => {
                    setLoading(false);
                })
        }
    };
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
                    setTeam({ ...team, image: imageUri });
                } else {
                    Alert.alert('Ops', 'A imagem é muito grande. Por favor, selecione uma imagem menor que 10MB.');
                }
            }
        });
    };
    const toggleModal = () => {
        setTeam({ name: '', image: null, description: '', valid: false, checked: false });
        close();
    };

    // Geolocation.getCurrentPosition(
    //     (position) => {
    //         console.log(position);
    //     },
    //     (error) => {
    //         console.warn(error);
    //     },
    //     { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    // );
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
                    <Text style={styles.modalText}>Criar Time</Text>
                    <View style={styles.inputContainer}>
                        <AvatarImage image={team.image} key={team.image} size={100} />
                        <TouchableOpacity style={styles.modalButton} onPress={selectImage}>
                            <Text style={styles.modalButtonText} >Selecionar Imagem</Text>
                        </TouchableOpacity>
                        <TextInput style={styles.input} value={team.name} onChangeText={(e) => setTeam({ ...team, name: e, valid: true, checked: false })} onBlur={handleCheckNameTeam} placeholder="Nome do time" />
                        <TextInput style={styles.input} value={team.description} onChangeText={(e) => setTeam({ ...team, description: e, valid: true, checked: false })} placeholder="Descrição do time" />
                        <TouchableOpacity style={{ ...styles.modalButton, backgroundColor: theme.TERTIARY }} onPress={handleCreateTeamRequest} disabled={!team.valid}>
                            <Text style={styles.modalButtonText}>Criar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ ...styles.modalButton, backgroundColor: theme.TERTIARY }} onPress={toggleModal}>
                            <Text style={styles.modalButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                    {!team.valid && team.checked && <Text style={styles.notAllowedText}>Um time com este nome já existe, por favor escolha outro.</Text>}
                    {loading && <LoaderUnique />}

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

