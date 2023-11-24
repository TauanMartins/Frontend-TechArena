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


export const FavoriteSports = ({ theme, user, data, action }: { theme: typeof Light | typeof Dark, user: User, data: { id: number, name: string }[], action: (id: number) => void }) => {
    const styles = createStyles(theme);

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Text style={{ ...styles.text, textAlign: 'left' }}>Esportes favoritos</Text>
                <TouchableOpacity style={{ paddingVertical: 10, flex: 1, }}  onPress={() => Alert.alert('Saiba mais', 'Seus esportes favoritos funcionam de forma que você ache os agendamentos mais rapidamente.')}>
                    <Text style={{ ...styles.text, textAlign: 'right' }}>Saiba mais</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.iconRow}>
                {data && data.length > 0 ? data.map((sport) => (
                    <SportIcon styles={styles} theme={theme} sportName={sport.name} sportCode={sport.id} key={sport.id} action={(e) => action(e)} />
                )) : <SportIcon styles={styles} theme={theme} sportName={''} sportCode={0} action={() => action(0)} />
                }
            </View>

        </View>
    )
};

const sportIcons = {
    0: require('../../../assets/LogoSports/plus.png'),
    1: require('../../../assets/LogoSports/vôlei.png'),
    2: require('../../../assets/LogoSports/futebol.png'),
    3: require('../../../assets/LogoSports/basquete.png'),
    4: require('../../../assets/LogoSports/futebol.png'),
    5: require('../../../assets/LogoSports/skate.png'),
    6: require('../../../assets/LogoSports/futebol.png'),
    7: require('../../../assets/LogoSports/tênis.png'),
    8: require('../../../assets/LogoSports/xadrez.png'),
    9: require('../../../assets/LogoSports/natacao.png'),
    10: require('../../../assets/LogoSports/tênis.png'),
    11: require('../../../assets/LogoSports/vôlei.png'),
    12: require('../../../assets/LogoSports/vôlei.png'),
    13: require('../../../assets/LogoSports/ciclismo.png'),
};

type SportIconStyles = {
    col: ViewStyle;
    iconContainer: ViewStyle;
    sportText: TextStyle;
};

type SportIconProps = {
    styles: SportIconStyles;
    sportCode: number;
    sportName: string;
    theme: typeof Light | typeof Dark;
    action: (sportCode: number) => void
};

const SportIcon = ({ styles, theme, sportCode, sportName, action }: SportIconProps) => (
    <TouchableHighlight underlayColor={theme.TERTIARY} style={{ borderRadius: 10, alignItems: 'center' }} onPress={() => action(sportCode)}>
        <View style={styles.col}>
            <View style={{ ...styles.iconContainer, backgroundColor: theme[sportCode] }}>
                <Image style={{ width: 35, height: 35, backgroundColor: theme[sportCode] }} source={sportIcons[sportCode]} />
            </View>
            <Text style={styles.sportText}>
                {sportName}
            </Text>
        </View>
    </TouchableHighlight>
);


const createStyles = (theme: typeof Light | typeof Dark) =>
    StyleSheet.create({
        container: {
            flex: 1,
            marginVertical: 30,
        },
        iconRow: {
            marginVertical: 15,
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        text: {
            flex: 1,
            color: theme.SECONDARY,
            fontFamily: 'Sansation Regular',
            fontSize: 13,
        },
        row: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
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
    })