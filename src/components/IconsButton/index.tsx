import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import { View, TouchableOpacity, ViewStyle } from 'react-native';

export const HomeIcon = ({ color, size, isActive }) => {
  return (
    <View
      style={{ flexDirection: 'column', alignContent: 'center', height: '100%' }}>
      <View
        style={{
          height: 1.8,
          width: 'auto',
          borderRadius: 25,
          backgroundColor: isActive ? color : 'transparent',
        }}
      />
      <AntDesign
        style={{ marginTop: '13%' }}
        name="home"
        color={color}
        size={size}
      />
    </View>
  );
};
export const LeagueIcon = ({ color, size, isActive }) => {
  return (
    <View
      style={{
        flexDirection: 'column',
        alignContent: 'center',
        width: '100%',
        height: '100%',
      }}>
      <View
        style={{
          height: 1.8,
          borderRadius: 25,
          backgroundColor: isActive ? color : 'transparent',
        }}
      />
      <EvilIcons name="trophy" color={color} size={size} />
    </View>
  );
};
export const CreateMatchIcon = ({ color, size, isActive }) => {
  return (
    <View
      style={{
        flexDirection: 'column',
        alignContent: 'center',
        width: '100%',
        height: '100%',
      }}>
      <View
        style={{
          height: 1.8,
          borderRadius: 25,
          backgroundColor: isActive ? color : 'transparent',
        }}
      />
      <EvilIcons name="plus" color={color} size={size} />
    </View>
  );
};
export const SocialIcon = ({ color, size, isActive }) => {
  return (
    <View
      style={{
        flexDirection: 'column', alignContent: 'center', height: '100%', 
      }}>
      <View
        style={{
          height: 1.8, 
          borderRadius: 25,
          width: 'auto',
          backgroundColor: isActive ? color : 'transparent',
        }}
      />
      <Feather style={{ marginTop: '13%' }} name="users" color={color} size={size} />
    </View>
  );
};
export const SettingsIcon = ({ color, size, isActive }) => {
  return (
    <View
      style={{
        flexDirection: 'column',
        alignContent: 'center',
        width: '100%',
        height: '100%',
      }}>
      <View
        style={{
          height: 1.8,
          borderRadius: 25,
          backgroundColor: isActive ? color : 'transparent',
        }}
      />
      <EvilIcons name="gear" color={color} size={size} />
    </View>
  );
};

// Abaixo ícones dispersos pelo aplicativo.
export const NotificationIcon = ({
  color,
  size,
  style,
}: {
  color: string;
  size: number;
  style: ViewStyle;
}) => {
  return (
    <View style={{ ...style }}>
      <Ionicons name="notifications-outline" color={color} size={size} />
    </View>
  );
};

export const BackButton = ({
  onPress,
  style,
  color,
}: {
  onPress: () => void;
  style: ViewStyle;
  color: string;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ ...style, paddingVertical: 10, paddingHorizontal: 10 }}>
      <AntDesign name="left" size={25} color={color} />
    </TouchableOpacity>
  );
};
export const PreferenceIcon = ({
  style,
  color,
}: {
  style?: ViewStyle;
  color: string;
}) => {
  return (
    <View style={{ ...style, paddingHorizontal: 10 }}>
      <FontAwesome5 name="sliders-h" size={20} color={color} />
    </View>
  );
};
export const PreferenceThemeIcon = ({
  style,
  color,
}: {
  style?: ViewStyle;
  color: string;
}) => {
  return (
    <View style={{ ...style, paddingHorizontal: 10 }}>
      <FontAwesome5 name="palette" size={20} color={color} />
    </View>
  );
};

export const AddUserFriendIcon = ({
  style,
  color,
}: {
  style?: ViewStyle;
  color: string;
}) => {
  return (
    <View style={{ ...style, paddingHorizontal: 10 }}>
      <Feather name="user-plus" size={20} color={color} />
    </View>
  );
};
export const ChatIcon = ({
  style,
  color,
}: {
  style?: ViewStyle;
  color: string;
}) => {
  return (
    <View style={{ ...style, paddingHorizontal: 10, alignSelf: 'center' }}>
      <Ionicons name="chatbubble" size={24} color={color} />
    </View>
  );
};
export const ChatsIcon = ({
  style,
  color,
}: {
  style?: ViewStyle;
  color: string;
}) => {
  return (
    <View style={{ ...style, paddingHorizontal: 10 }}>
      <Ionicons name="chatbubbles" size={30} color={color} />
    </View>
  );
};
