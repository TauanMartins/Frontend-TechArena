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

const HoraryMenu = ({ horarys, selectedHorary, onChange }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    const onChangeHorary = (horaryId) => {
        const filteredHorary = (horarys.filter((horary) => (horary.id === horaryId)))[0]
        onChange(filteredHorary);
    };

    return (
        <View style={styles.container}>
            <View style={{ flex:1  }}>
                <Text style={styles.title}>
                    Horários disponíveis
                </Text>
                <SelectList placeholder={selectedHorary ? selectedHorary.value : 'Selecione'}
                    setSelected={(itemValue) => onChangeHorary(itemValue)}
                    data={horarys.map(horary => ({ key: horary.id, value: horary.horary }))}
                    notFoundText='Nenhuma horário encontrado'
                    boxStyles={{ backgroundColor: theme.TERTIARY, borderWidth: 0, }}
                    inputStyles={{ color: theme.QUATERNARY }}
                    dropdownStyles={{ backgroundColor: theme.TERTIARY, borderWidth: 0, width: '100%', position: 'relative', elevation: 10 }}
                    dropdownTextStyles={{ color: theme.QUATERNARY }}
                    searchPlaceholder='Selecione'
                    fontFamily='Sansation Regular'
                />
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

export default HoraryMenu;
