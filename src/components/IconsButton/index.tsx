import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { View } from 'react-native';

export const HomeIcon = ({ color, size, isActive }) => {
    return (
        <View style={{ flexDirection: 'column', alignContent: 'center', height: '100%' }}>
            <View style={{ height: 1.8, width: 'auto', borderRadius: 25, backgroundColor: isActive ? color : 'transparent' }} />
            <AntDesign style={{marginTop: '10%'}} name='home' color={color} size={size} />
        </View>
    );
};
export const LeagueIcon = ({ color, size, isActive }) => {
    return (
        <View style={{ flexDirection: 'column', alignContent: 'center', width: '100%', height: '100%' }}>
            <View style={{ height: 1.8, borderRadius: 25, backgroundColor: isActive ? color : 'transparent' }} />
            <EvilIcons name='trophy' color={color} size={size} />
        </View>
    );
};
export const CreateMatchIcon = ({ color, size, isActive }) => {
    return (
        <View style={{ flexDirection: 'column', alignContent: 'center', width: '100%', height: '100%' }}>
            <View style={{ height: 1.8, borderRadius: 25, backgroundColor: isActive ? color : 'transparent' }} />
            <EvilIcons name='plus' color={color} size={size} />
        </View>
    );
};
export const MapIcon = ({ color, size, isActive }) => {
    return (
        <View style={{ flexDirection: 'column', alignContent: 'center', width: '100%', height: '100%' }}>
            <View style={{ height: 1.8, borderRadius: 25, backgroundColor: isActive ? color : 'transparent' }} />
            <EvilIcons name='location' color={color} size={size} />
        </View>
    );
};
export const ConfigurationIcon = ({ color, size, isActive }) => {
    return (
        <View style={{ flexDirection: 'column', alignContent: 'center', width: '100%', height: '100%' }}>
            <View style={{ height: 1.8, borderRadius: 25, backgroundColor: isActive ? color : 'transparent' }} />
            <EvilIcons name='gear' color={color} size={size} />
        </View>
    );
};

// Abaixo ícones dispersos pelo aplicativo.
export const NotificationIcon = ({ color, size, style }: { color: string, size: number, style: object }) => {
    return (
        <View style={{ ...style }}>
            <Ionicons name='notifications-outline' color={color} size={size} />
        </View>
    );
};




