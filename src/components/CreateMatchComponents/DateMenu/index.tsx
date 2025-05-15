import React, { useState, useEffect } from 'react';
import { ScreenProps } from '../../../navigation/ScreenProps';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../../utils/Auth/AuthContext';
import { useTheme } from '../../../utils/Theme/ThemeContext';
import Light from '../../../utils/Theme/Light';
import Dark from '../../../utils/Theme/Dark';
import Loader from '../../../components/Loader';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button } from 'react-native-elements';

const DateMenu = ({ date, onChange }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    const [show, setShow] = useState(false);

    const onChangeDate = (event, selectedDate) => {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        toggleShowMode();
        if (selectedDate < currentDate) {
            Alert.alert('Ops', 'A data selecionada deve ser superior ao dia atual.');
        } else {
            onChange(selectedDate);
        }
    };

    const toggleShowMode = () => {
        setShow(!show);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.dateText}>
                {(date.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' }))}
            </Text>
            <TouchableOpacity style={styles.calendarButton} onPress={toggleShowMode} >
                <Text style={styles.calendarText}>
                    Selecionar outra data
                </Text>
            </TouchableOpacity>
            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    display="spinner"
                    mode='date'
                    onChange={onChangeDate}
                />
            )}
        </View>
    );
};

const createStyles = (theme: typeof Light | typeof Dark) =>
    StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'row',
            backgroundColor: theme.PRIMARY,
            alignItems: 'center',
            justifyContent: 'space-around'
        },
        calendarButton: {
            flex: 1,
            padding: 15,
            marginVertical: 5,
            borderRadius: 20,
            backgroundColor: theme.TERTIARY,
            alignItems: 'center',
            justifyContent: 'center',
        },
        dateText: {
            flex: 1,
            fontFamily: 'Sansation Regular',
            fontSize: 16,
            color: theme.SECONDARY,
        },
        calendarText: {
            flex: 1,
            fontFamily: 'Sansation Regular',
            fontSize: 16,
            color: theme.QUATERNARY,
        }
    });

export default DateMenu;
