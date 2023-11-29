import React, { useEffect, useState } from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import {
    TouchableOpacity, TouchableHighlight,
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    FlatList, ViewStyle, TextStyle, Alert
} from 'react-native';
import Light from '../../../utils/Theme/Light';
import Dark from '../../../utils/Theme/Dark';
import { User } from '../../../utils/Model/User';
import Loader from '../../Loader';
import LoaderUnique from '../../LoaderUnique';
import { screens } from '../../../navigation/ScreenProps';
import { RootStackParamList } from '../../../navigation/NavigationTypes';
import { navigate } from '../../../navigation/NavigationUtils';
import { ArenaImage } from '../../ArenaImage';

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

const EventCard = ({ styles, appointment, theme }) => (
    <View style={{ ...styles.eventCardContainer, backgroundColor: theme[appointment.sport_id] }}>
        <View style={styles.eventImage}>
            <ArenaImage image={appointment.image} size={200} />
        </View>
        <View style={{ margin: 20, flex: 1 }}>
            <View style={styles.eventRow}>
                <Text style={styles.addressText}>
                    {appointment.address}
                </Text>
            </View>
            <View style={styles.eventRow}>
                <Text style={styles.eventInfoText}>
                    {appointment.name}
                </Text>
            </View>
            <View style={styles.eventRow}>
                <Text style={styles.eventInfoText}>
                    {formatDate(appointment.date, appointment.horary)} às {formatTime(appointment.horary)}
                </Text>
            </View>

            <View style={styles.eventAdditionalInfoRow}>
                <Text style={{ ...styles.eventInfoText, fontWeight: 'bold' }}>
                    {appointment.distance} Km
                </Text>
                <Text style={{ ...styles.eventInfoText, textAlign: 'right' }}>
                    {appointment.players} {appointment.players === 1 ? 'Jogador presente' : 'Jogadores presentes'}
                </Text>
            </View>
        </View>
    </View>
);
const ScheduledSuggestionsRow = ({ styles, navigation, isAuthenticated, user }) => (
    <View style={styles.sugestionTextRow}>
        <Text style={styles.sugestionText}>Sugestões agendadas</Text>
        <Text style={styles.viewAllButton} onPress={() => navigate(navigation, screens.HomeAppointments.name as keyof RootStackParamList, isAuthenticated, user)}>Ver todas</Text>
    </View>
);
export const EventCardRow = ({ appointments, theme, navigation, isAuthenticated, user, action }) => {
    const styles = createStyles(theme);
    return (
        <View style={styles.container}>
            <ScheduledSuggestionsRow styles={styles} navigation={navigation} isAuthenticated={isAuthenticated} user={user} />
            <FlatList
                horizontal={appointments.data.length>0}
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={(<Text style={styles.emptyList}>Ops, não existem agendamentos por perto. Aproveite e crie um agendamento na arena mais próxima.</Text>)}
                data={appointments.data} // Array com 4 elementos para representar os 4 cards
                renderItem={({ item }) => (
                    <TouchableHighlight underlayColor={theme[item.sport_id]} style={{ borderRadius: 25 }} onPress={() => action(item)}>
                        <EventCard appointment={item} styles={styles} theme={theme} />
                    </TouchableHighlight>
                )}
            />
        </View>
    )
};


const createStyles = (theme: typeof Light | typeof Dark) =>
    StyleSheet.create({
        container: {
        },
        sugestionTextRow: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            paddingVertical: 10,
        },
        emptyList: {
            textAlign: "center",
            fontFamily: 'Sansation Regular',
            fontSize: 13,
            color: theme.SECONDARY
        },
        sugestionText: {
            flex: 1,
            alignSelf: 'center',
            textAlign: 'left',
            fontFamily: 'Sansation Regular',
            fontWeight: 'bold',
            fontSize: 16,
            color: theme.SECONDARY
        },
        viewAllButton: {
            flex: 1,
            textAlign: 'right',
            alignSelf: 'center',
            justifyContent: 'space-evenly',
            color: theme.SECONDARY,
            fontFamily: 'Sansation Regular',
            fontSize: 13,
        },
        eventCardContainer: {
            flex: 1,
            width: 250,
            borderRadius: 25,
            elevation: 5,
            marginVertical: 10,
            marginHorizontal: 10
        },
        eventImage: {
            marginHorizontal: 20,
            marginTop: 20,
            justifyContent: 'center',
            alignItems: 'center',
        },
        eventRow: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'flex-start',
        },
        addressText: {
            flex: 1,
            fontFamily: 'Sansation Regular',
            fontSize: 16,
            color: theme.QUATERNARY
        },
        eventInfoText: {
            flex: 1,
            fontFamily: 'Sansation Regular',
            fontSize: 13,
            color: theme.QUATERNARY
        },

        eventAdditionalInfoRow: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: 50
        },
    })