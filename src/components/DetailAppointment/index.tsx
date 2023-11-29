import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal, TextInput, FlatList, Alert, ScrollView, SectionList
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
import { ArenaImage } from '../ArenaImage';
import { navigate } from '../../navigation/NavigationUtils';
import { screens } from '../../navigation/ScreenProps';
import { RootStackParamList } from '../../navigation/NavigationTypes';
import { CollapseDown, CollapseRight } from '../IconsButton';
import CheckboxButton from '../CheckboxButton';


interface UsersSearch {
    id: number;
    name: string;
    image: string;
    username: string;
}

interface UsersSearchResponse {
    data: UsersSearch[];
}



const formatDate = (dateString, timeString) => {
    if (!dateString) {
        return ''
    }
    const utcDate = new Date(dateString + `T${timeString}Z`);
    const spTimeZoneOffset = 0; // Fuso horário de São Paulo, sem considerar horário de verão
    const spDate = new Date(utcDate.getTime() + spTimeZoneOffset * 60 * 60 * 1000);

    const day = spDate.getUTCDate();
    const monthNames = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    const month = monthNames[spDate.getUTCMonth()];
    const year = spDate.getUTCFullYear();

    return `${day} de ${month} de ${year}`;
};

const formatTime = (timeString) => {
    if (!timeString) {
        return ''; // Ou algum valor padrão se preferir
    }
    const [hours, minutes] = timeString.split(':');
    return `${hours}h${minutes}`;
};
export const DetailAppointment = ({ open, close, appointment, navigation, isAuthenticated }) => {
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
    const [entered, setEntered] = useState(false);
    const [showMaterials, setShowMaterial] = useState(true);
    const [materials, setMaterials] = useState([]);
    const [holder, setHolder] = useState(false);

    const handleRequestAppointment = () => {
        ConfirmationDialog({
            title: 'Confirmação',
            message: 'Deseja marcar presença neste agendamento? As pessoas que ingressarem terão conhecimento disso.',
            onConfirm: async () => {
                setLoading(true);
                API.$users_appointments.request({ appointment_id: appointment.id, username: user.username, holder: holder })
                    .then((response: UsersSearchResponse) => {
                        setEntered(true);
                        appointment.is_inside = true
                        setNotification({
                            message: 'Ingresso realizado com sucesso, divirta-se!',
                            success: true,
                            visible: true,
                        });
                    })
                    .catch((error: any) => {
                        setNotification({
                            message: `Não conseguimos agendar seu ingresso 😞.\nCódigo do erro: ${error.message}`,
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

    const fetchMaterials = () => {
        setLoading(true)
        API.$sports_material.select_sports_materials({ sport_id: appointment.sport_id }).then((response) => {
            setMaterials(response.data)
        }).catch((err) => {
            console.log(err)
        }).finally(() => {
            setLoading(false)
        })
    };
    const handleChatToAppointment = () => {
        ConfirmationDialog({
            title: 'Confirmação',
            message: 'Deseja iniciar uma conversa?',
            onConfirm: async () => {
                setLoading(true);
                API.$chat_appointment.post_chats_appointments({ username: user.username, appointment_id: appointment.id })
                    .then((response) => {
                        console.log(response.data)
                        toggleModal();
                        navigate(navigation,
                            screens.SocialChatStack.name as keyof RootStackParamList,
                            isAuthenticated,
                            user, { chat_id: response.data.chat_id, name: appointment.address, image: appointment.image, is_group_chat: true })
                    })
                    .catch((error: any) => {
                        console.log(error);
                        setNotification({
                            message: `Não conseguimos iniciar uma conversa 😞. Código do erro: ${error.message}`,
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
    const toggleModal = () => {
        setHolder(false)
        setMaterials([])
        setEntered(false)
        close();
    };
    const toggleShowMaterial = () => {
        setShowMaterial(!showMaterials);
    };

    const renderItem = ({ item, section }) => {
        let isVisible: boolean;
        let isGroupChat: boolean;

        switch (section.title) {
            case 'Materiais necessários':
                isVisible = showMaterials;
                isGroupChat = false; // Friends chat é um chat pessoal, não de grupo
                break;
            default:
                isVisible = false;
                isGroupChat = false;
        }

        // Se a visibilidade da seção está desativada, não renderize os itens
        if (!isVisible) return null;
        item.is_group_chat = isGroupChat;
        return (
            <Text style={{ ...styles.label, paddingTop: 10, }}>{item.description}</Text>
        );
    };
    const renderSectionHeader = ({ section: { title } }) => {
        let toggle;
        let active;
        switch (title) {
            case 'Materiais necessários':
                toggle = toggleShowMaterial;
                active = showMaterials;
                break;
            default:
                toggle = () => { };
        }
        return (
            <TouchableOpacity onPress={toggle} style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>{title}</Text>{active ? <CollapseDown color={theme.SECONDARY} style={{ marginRight: 10 }} /> : <CollapseRight color={theme.SECONDARY} style={{ marginRight: 10 }} />}
            </TouchableOpacity>
        );
    };
    return (
        <Modal animationType="fade"
            visible={open}
            onShow={() => { if (appointment.is_inside) { setEntered(true) } else { setEntered(false) } fetchMaterials() }}
            transparent={true}
            onRequestClose={toggleModal}>
            <Notification
                message={notification.message}
                success={notification.success}
                visible={notification.visible}
                onClose={() => setNotification({ ...notification, visible: false })} />
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.modalView}>
                    {loading && <LoaderUnique />}
                    <Text style={styles.modalText}>Detalhes do agendamento</Text>
                    <View style={styles.inputContainer}>

                        <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
                            <ArenaImage image={appointment.image} size={200} />
                        </View>
                        <View style={styles.container}>
                            <View style={{ paddingTop: 20, flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
                                <Text style={styles.label}>Endereço:</Text>
                                <TouchableOpacity onPress={() => { Alert.alert('Ops', 'Essa funcionalidade está em desenvolvimento')/*navigate(navigation, )*/ }}>
                                    <Text style={{ ...styles.label, textAlign: 'right', fontSize: 13, textDecorationLine: 'underline' }}>Ver no mapa</Text>
                                </TouchableOpacity>
                            </View>
                            <TextInput multiline={true}
                                style={styles.input}
                                value={appointment.address}
                                editable={false}
                            />
                        </View>
                        <View style={styles.container}>
                            <Text style={styles.label}>Data marcada:</Text>
                            <TextInput multiline={true}
                                style={styles.input}
                                value={`${formatDate(appointment.date, appointment.horary)} às ${formatTime(appointment.horary)}`}
                                editable={false}
                            />
                        </View>
                        <View style={{ paddingTop: 20, flexDirection: 'row', flex: 1, justifyContent: 'space-between', }}>
                            <View style={{ flexDirection: 'column', flex: 1, paddingRight: 5 }}>
                                <Text style={styles.label}>Distância da sua localização:</Text>
                                <TextInput multiline={true}
                                    style={styles.input}
                                    value={`${appointment.distance} Km`}
                                    editable={false}
                                />
                            </View>
                            <View style={{ flexDirection: 'column', flex: 1, paddingLeft: 5 }}>
                                <Text style={styles.label}>Esporte:</Text>
                                <TextInput multiline={true}
                                    style={styles.input}
                                    value={`${appointment.name}`}
                                    editable={false}
                                />
                            </View>
                        </View>
                        <View style={styles.container}>
                            <Text style={styles.label}>Quantidade de pessoas que ingressaram neste agendamento:</Text>
                            <TextInput multiline={true}
                                style={styles.input}
                                value={`${appointment.players} ${appointment.players === 1 ? 'Jogador presente' : 'Jogadores presentes'}`}
                                editable={false}
                            />
                        </View>
                        <View style={styles.container}>
                            <Text style={styles.label}>Nome de usuário do organizador do agendamento:</Text>
                            <TextInput multiline={true}
                                style={styles.input}
                                value={`${appointment.username}`}
                                editable={false}
                            />
                        </View>
                        {!appointment.is_inside &&
                            <View style={styles.container}>
                                <Text style={styles.label}>Ao marcar o item abaixo você se compromete a levar algum material necessário:</Text>
                                <CheckboxButton
                                    colours={theme}
                                    label='Holder'
                                    value={holder}
                                    handleSelectedOption={() => setHolder(!holder)}
                                    description='Levarei o material necessário'
                                />
                            </View>
                        }
                        <View style={styles.container}>
                            <SectionList
                                sections={[{ title: 'Materiais necessários', data: materials }]}
                                renderItem={renderItem}
                                renderSectionHeader={renderSectionHeader}
                                keyExtractor={(item) => item.id.toString()}
                                style={styles.container_material}
                                scrollEnabled={false}
                            />
                        </View>

                        <View style={styles.container}>
                            {entered &&
                                <TouchableOpacity style={{ ...styles.modalButton, backgroundColor: theme.TERTIARY }} onPress={handleChatToAppointment}>
                                    <Text style={styles.modalButtonText}>Ir ao chat</Text>
                                </TouchableOpacity>
                            }
                            {!appointment.is_inside &&
                                <TouchableOpacity style={{ ...styles.modalButton, backgroundColor: theme.TERTIARY }} onPress={handleRequestAppointment}>
                                    <Text style={styles.modalButtonText}>Ingressar</Text>
                                </TouchableOpacity>
                            }
                            <TouchableOpacity style={{ ...styles.modalButton, backgroundColor: theme.TERTIARY }} onPress={toggleModal}>
                                <Text style={styles.modalButtonText}>Fechar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </Modal>
    );
};

const createStyles = (theme: typeof Light | typeof Dark) =>
    StyleSheet.create({

        sectionHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: theme.PRIMARY,
            elevation: 2
        },
        sectionHeaderText: {
            fontFamily: 'Sansation Regular',
            fontSize: 16,
            color: theme.SECONDARY,
        },
        scrollView: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo translúcido para obscurecer o conteúdo de trás
        },
        modalView: {
            alignItems: 'center',
            justifyContent: 'flex-start', // Alinhamento do conteúdo ao topo
            backgroundColor: theme.PRIMARY,
            flex: 1,
            borderRadius: 25,
            elevation: 5,
            paddingVertical: 20,
            paddingHorizontal: 15,
            margin: 25,
        },
        container_material: {
            width: '100%',
            flex: 1,
            backgroundColor: theme.PRIMARY,

        },
        container: {
            paddingTop: 20,
            alignSelf: 'stretch', // Estica o contêiner para preencher a largura
            alignItems: 'flex-start',
        },
        label: {
            flex: 1,
            fontFamily: 'Sansation Regular',
            fontSize: 16,
            color: theme.SECONDARY,
        },
        modalText: {
            fontFamily: 'Sansation Regular',
            fontSize: 22,
            color: theme.SECONDARY,
            marginBottom: 20,
        },
        modalButton: {
            padding: 15,
            marginVertical: 5,
            borderRadius: 20,
            alignSelf: 'stretch', // Estica o botão para preencher a largura
            backgroundColor: theme.TERTIARY,
            alignItems: 'center',
            justifyContent: 'center',
        },
        modalButtonText: {
            fontFamily: 'Sansation Regular',
            fontSize: 18,
            color: theme.QUATERNARY,
        },
        inputContainer: {
            alignSelf: 'stretch', // Estica o contêiner para preencher a largura
            alignItems: 'center',
        },
        input: {
            flex: 1,
            paddingHorizontal: 15,
            borderRadius: 20,
            width: '100%',
            backgroundColor: theme.TERTIARY,
            fontFamily: 'Sansation Regular',
            fontSize: 16,
            color: theme.QUATERNARY,
        },
    });

