import React, { useState, useEffect } from 'react';
import { ScreenProps } from '../../../navigation/ScreenProps';
import { Alert, SectionList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../../utils/Auth/AuthContext';
import { useTheme } from '../../../utils/Theme/ThemeContext';
import Light from '../../../utils/Theme/Light';
import Dark from '../../../utils/Theme/Dark';
import Loader from '../../../components/Loader';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button } from 'react-native-elements';
import { SelectList } from 'react-native-dropdown-select-list'
import { SportIcon } from '../../HomeScreenComponents/FavoriteSports';
import API from '../../../utils/API';
import { CollapseDown, CollapseRight } from '../../IconsButton';
import CheckboxButton from '../../CheckboxButton';



const SportMenu = ({ sports, selectedSport, onChange, holder, setHolder }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    const [showMaterials, setShowMaterial] = useState(true);
    const [materials, setMaterials] = useState([]);

    const fetchMaterials = (sport_id) => {
        API.$sports_material.select_sports_materials({ sport_id: sport_id }).then((response) => {
            setMaterials(response.data)
        }).catch((err) => {
            console.log(err)
        })
    };
    const toggleShowMaterial = () => {
        setShowMaterial(!showMaterials);
    };
    const onChangeSport = (sportId) => {
        const filteredSport = (sports.filter((sport) => (sport.id === sportId)))[0]
        fetchMaterials(sportId)
        onChange(filteredSport);
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
        <>
            <View style={styles.container}>
                <View style={{ width: '70%' }}>
                    <Text style={styles.title}>
                        Esporte
                    </Text>
                    <SelectList placeholder={selectedSport ? selectedSport.name : 'Selecione'}
                        setSelected={(itemValue) => onChangeSport(itemValue)}
                        data={sports.map(sport => ({ key: sport.id, value: sport.name }))}
                        notFoundText='Nenhum esporte encontrado'
                        boxStyles={{ backgroundColor: theme.TERTIARY, borderWidth: 0, }}
                        inputStyles={{ color: theme.QUATERNARY }}
                        dropdownStyles={{ backgroundColor: theme.TERTIARY, borderWidth: 0, width: '100%', position: 'relative', elevation: 10 }}
                        dropdownTextStyles={{ color: theme.QUATERNARY }}
                        searchPlaceholder='Selecione'
                        fontFamily='Sansation Regular'

                    />
                </View>
                <View style={{ flex: 1 }}>
                    {selectedSport ?
                        <SportIcon styles={styles} theme={theme} sportName={selectedSport.name} sportCode={selectedSport.id} action={() => { }} />
                        : <SportIcon styles={styles} theme={theme} sportName={''} sportCode={0} action={() => { Alert.alert('Aviso', 'Selecione um esporte no campo ao lado.') }} />}
                </View>
            </View>

            {selectedSport &&
                <>
                    <View style={styles.horizontalRule} />
                    <Text style={styles.label}>Para este esporte, {selectedSport.default_value_player_numbers} é o número recomendado de jogadores por equipe.</Text>
                </>
            }
            <View style={styles.horizontalRule} />
            <View style={{ flex: 1 }}>

                <View style={styles.container_holder}>
                    <Text style={styles.label}>Ao marcar o item abaixo você se compromete a levar algum material necessário (opcional):</Text>
                    <CheckboxButton
                        colours={theme}
                        label='Holder'
                        value={holder}
                        handleSelectedOption={() => setHolder(!holder)}
                        description='Levarei o material necessário'
                    />
                </View>
                <SectionList
                    sections={[{ title: 'Materiais necessários', data: materials }]}
                    renderItem={renderItem}
                    renderSectionHeader={renderSectionHeader}
                    keyExtractor={(item) => item.id.toString()}
                    style={styles.container_material}
                    scrollEnabled={false}
                />
            </View>
        </>
    )
};

const createStyles = (theme: typeof Light | typeof Dark) =>
    StyleSheet.create({
        horizontalRule: {
            borderBottomColor: 'grey', // Cor da linha
            borderBottomWidth: 1,      // Espessura da linha
            marginVertical: 10,        // Espaço vertical acima e abaixo da linha
        },
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
        label: {
            flex: 1,
            fontFamily: 'Sansation Regular',
            fontSize: 16,
            color: theme.SECONDARY,
        },
        container_holder: {
            alignSelf: 'stretch', // Estica o contêiner para preencher a largura
            alignItems: 'flex-start',
        },
        container: {
            flexDirection: 'row',
            flex: 1,
            backgroundColor: theme.PRIMARY,
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        title: {
            fontFamily: 'Sansation Regular',
            fontSize: 16,
            color: theme.SECONDARY,
        },
        selectSport: {
            fontFamily: 'Sansation Regular',
            fontSize: 16,
            color: theme.QUATERNARY,
        },
        col: {
            justifyContent: 'center',
            alignItems: 'center',
        },
        iconContainer: {
            margin: 3,
            width: 50,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            elevation: 3,
        }, sportText: {
            flex: 1,
            fontFamily: 'Sansation Regular',
            textAlign: 'center',
            color: theme.SECONDARY,
            marginTop: '4%',
            fontSize: 13,
        }
    });

export default SportMenu;
