import React from 'react';
import {
    TouchableOpacity,
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image, Alert,
    FlatList
} from 'react-native';
import Theme from '../../../utils/Theme';
import { NotificationIcon } from '../../IconsButton';
import { AvatarImage } from '../../AvatarImage';
import Light from '../../../utils/Theme/Light';
import Dark from '../../../utils/Theme/Dark';

export const Header = ({ user, theme }) => {
    const styles = createStyles(theme);

    return (
        <View style={styles.container}>
            <View style={styles.col}>
                <Text style={styles.welcomeText} >
                    Olá, {user.name}!
                </Text>
                <Text style={styles.findMatchesText}>
                    Encontre partidas
                </Text>
            </View>
            <UserNotificationRow user={user} styles={styles} theme={theme} />
        </View>
    );
}

const UserNotificationRow = ({ user, styles, theme }) => (
    <View style={styles.notificationRow}>
        <TouchableOpacity onPress={() => Alert.alert('Ops...', 'Logo logo você poderá ver suas notificações sobre amigos, agendamentos e torneios...')}>
            <NotificationIcon style={styles.notificationIcon} color={theme.SECONDARY} size={32} />
        </TouchableOpacity>
        {user.picture && (
            <AvatarImage image={user.picture} size={55} />
        )}
    </View>
);

const createStyles = (theme: typeof Light | typeof Dark) =>
    StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'flex-end',
        },
        col: {
            flex: 1,            
            justifyContent: 'flex-start',
        },
        notificationRow: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center'
        },
        welcomeText: {
            flex: 1,
            color: theme.SECONDARY,
            fontFamily: 'Sansation Regular',
            marginTop: '10%',
            fontSize: 13,
        },
        findMatchesText: {
            flex: 1,
            color: theme.SECONDARY,
            fontFamily: 'Sansation Regular',
            fontSize: 28,
        },

    });
