import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { View } from 'react-native';

export const HomeIcon = ({ color, size, isActive }) => {
    return (
        <View>
            <View style={{ height: 1.8, bottom: 4, backgroundColor: isActive ? color : 'transparent' }} />
            <AntDesign name='home' style={{width: '100%'}} color={color} size={size} />
        </View>
    );
};
export const LeagueIcon = ({ color, size, isActive }) => {
    return (
        <View>
            <View style={{ height: 1.8, bottom: 4, backgroundColor: isActive ? color : 'transparent' }} />
            <EvilIcons name='trophy' style={{width: '100%'}} color={color} size={size} />
        </View>
    );
};
export const CreateMatchIcon = ({ color, size, isActive }) => {
    return (
        <View style={{ justifyContent: 'center' }}>
            <View style={{ height: 1.8, bottom: 4, backgroundColor: isActive ? color : 'transparent' }} />
            <EvilIcons name='plus' style={{width: '100%'}} color={color} size={size} />
        </View>
    );
};
export const MapIcon = ({ color, size, isActive }) => {
    return (
        <View>
            <View style={{ height: 1.8, bottom: 4, backgroundColor: isActive ? color : 'transparent' }} />
            <EvilIcons name='location' style={{width: '100%'}} color={color} size={size} />
        </View>
    );
};
export const ProfileIcon = ({ color, size, isActive }) => {
    return (
        <View>
            <View style={{ height: 1.8, bottom: 4, backgroundColor: isActive ? color : 'transparent' }} />
            <EvilIcons name='gear' style={{width: '100%'}} color={color} size={size} />
        </View>
    );
};

