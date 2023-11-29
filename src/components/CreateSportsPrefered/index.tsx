import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal, FlatList
} from 'react-native';
import { useTheme } from '../../utils/Theme/ThemeContext';
import { useAuth } from '../../utils/Auth/AuthContext';
import API from '../../utils/API';
import LoaderUnique from '../LoaderUnique';
import Notification from '../Notification';
import Dark from '../../utils/Theme/Dark';
import Light from '../../utils/Theme/Light';
import { CheckBox } from 'react-native-elements';

interface Sport {
    id: number;
    name: string;
    default_number: number;
}

interface SportResponse {
    data: Sport[];
}


export const CreateSportsPrefered = ({ open, close }) => {
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
    const [sports, setSports] = useState<Sport[]>([])
    const [selectedSports, setSelectedSports] = useState([]);

    const handleSelectSport = (sportId) => {
        if (selectedSports.includes(sportId)) {
            setSelectedSports(selectedSports.filter(id => id !== sportId));
        } else if (selectedSports.length < 4) {
            setSelectedSports([...selectedSports, sportId]);
        }
    };
    const handleSavePreferedSports = () => {
        setLoading(true)
        API.$sports_prefered.create_prefered_sports({ username: user.username, sports: selectedSports }) // Substitua por sua função de API real
            .then(response => {
                setNotification({
                    message: 'As configurações foram salvas com sucesso!',
                    success: true,
                    visible: true,
                });
                close();
            })
            .catch(err => {
                setNotification({
                    message: 'Não conseguimos salvar as alterações :(',
                    success: false,
                    visible: true,
                });
                console.log(err)
            })
            .finally(() => {
                setLoading(false)
            })
    };
    const toggleModal = () => {
        close();
    };
    const fetchSports = () => {
        setLoading(true)
        API.$sports.select_sports({}).then((response: SportResponse) => {
            setSports(response.data)
        }).catch((err) => {
            console.log(err)
        }).finally(() => {
            setLoading(false)
        })
    };
    const renderSportItem = ({ item: sport }) => (
        <CheckBox
            containerStyle={styles.checkboxContainer}
            textStyle={styles.modalSports}
            title={sport.name}
            fontFamily='Sansation Regular'
            checked={selectedSports.includes(sport.id)}
            onPress={() => handleSelectSport(sport.id)}
        />
    );
    useEffect(() => {
        fetchSports()
    }, [])

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
                    <Text style={styles.modalText}>Esportes favoritos</Text>
                    <Text style={styles.modalBody}>Identificamos que você não possui esportes favoritos salvos.</Text>
                    <Text style={styles.modalBody}>Deseja definir seus favoritos agora?
                        Não se preocupe, você poderá modificar a qualquer momento no menu de configurações.</Text>
                    <Text style={styles.modalBody}>Selecione seus 4 esportes favoritos:</Text>
                    <FlatList data={sports} renderItem={renderSportItem}
                        keyExtractor={(item) => item.id.toString()} style={styles.list} />
                    <TouchableOpacity style={{ ...styles.modalButton, backgroundColor: theme.TERTIARY }} onPress={handleSavePreferedSports} >
                        <Text style={styles.modalButtonText}>Salvar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ ...styles.modalButton, backgroundColor: theme.TERTIARY }} onPress={toggleModal}>
                        <Text style={styles.modalButtonText}>Deixar para depois</Text>
                    </TouchableOpacity>
                    {loading && <LoaderUnique />}
                </View>
            </Modal>
        </>
    );
};

const createStyles = (theme: typeof Light | typeof Dark) =>
    StyleSheet.create({

        checkboxContainer: {
            color: theme.SECONDARY,
            backgroundColor: theme.TERTIARY
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
        modalBody: {
            marginBottom: 10,
            fontFamily: 'Sansation Regular',
            fontSize: 16,
            color: theme.SECONDARY,
        },
        modalSports: {
            marginBottom: 10,
            fontFamily: 'Sansation Regular',
            fontSize: 16,
            color: theme.QUATERNARY,
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
        list: {
            width: '100%'
        },
    });

