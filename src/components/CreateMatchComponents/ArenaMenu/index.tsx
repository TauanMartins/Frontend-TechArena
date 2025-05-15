import React, { useState, useEffect } from 'react';
import { ScreenProps } from '../../../navigation/ScreenProps';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../../utils/Auth/AuthContext';
import { useTheme } from '../../../utils/Theme/ThemeContext';
import Light from '../../../utils/Theme/Light';
import Dark from '../../../utils/Theme/Dark';
import Loader from '../../Loader';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button } from 'react-native-elements';
import { SelectList } from 'react-native-dropdown-select-list'
import { SportIcon } from '../../HomeScreenComponents/FavoriteSports';
import { ArenaImage } from '../../ArenaImage';

const ArenaMenu = ({ arenas, selectedArena, onChange, navigation, checkArena }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    const onChangeArena = (arenaId) => {
        const filteredArena = (arenas.filter((arena) => (arena.arena_id === arenaId)))[0]
        onChange(filteredArena);
    };

    return (
        <View style={styles.container}>
            <View style={{ width: '70%' }}>
                <Text style={styles.title}>
                    Arena
                </Text>
                <SelectList placeholder={selectedArena ? selectedArena.address : 'Selecione'}
                    setSelected={(itemValue) => onChangeArena(itemValue)}
                    data={arenas.map(arena => ({ key: arena.arena_id, value: arena.address }))}
                    notFoundText='Nenhuma arena mapeada para este esporte.'
                    boxStyles={{ backgroundColor: theme.TERTIARY, borderWidth: 0, }}
                    inputStyles={{ color: theme.QUATERNARY }}
                    dropdownStyles={{ backgroundColor: theme.TERTIARY, borderWidth: 0, width: '100%', position: 'relative', elevation: 10 }}
                    dropdownTextStyles={{ color: theme.QUATERNARY }}
                    searchPlaceholder='Selecione'
                    fontFamily='Sansation Regular'

                />
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
                {selectedArena &&
                    <>
                        <ArenaImage image={selectedArena.image} size={75} />
                        <TouchableOpacity onPress={() => { checkArena() }}>
                            <Text style={{ ...styles.label, textAlign: 'right', fontSize: 13, textDecorationLine: 'underline', padding: 10 }}>Ver no mapa</Text>
                        </TouchableOpacity>
                    </>

                }
            </View>
        </View>
    )
};

const createStyles = (theme: typeof Light | typeof Dark) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            flex: 1,
            backgroundColor: theme.PRIMARY,
            alignItems: 'center',
            justifyContent: 'flex-end'
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
        label: {
            fontFamily: 'Sansation Regular',
            fontSize: 16,
            color: theme.SECONDARY,
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

export default ArenaMenu;
